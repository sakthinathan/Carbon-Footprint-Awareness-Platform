"use client";
import { useState } from "react";
import { useAnalyticsTrends, useAnalyticsCategoryBreakdown, useAnalyticsBenchmarks, useAnalyticsScopeBreakdown } from "@/hooks/useEmissions";
import { formatCO2e } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const INDUSTRIES = ["technology", "manufacturing", "retail", "finance", "healthcare", "logistics", "agriculture", "education"];
const SCOPE_COLORS = ["#16a34a", "#10b981", "#a3e635"];

export default function AnalyticsPage() {
  const [industry, setIndustry] = useState("technology");
  const [employees, setEmployees] = useState(100);

  const { data: trends }     = useAnalyticsTrends(12);
  const { data: categories } = useAnalyticsCategoryBreakdown();
  const { data: benchmarks } = useAnalyticsBenchmarks(industry, employees);
  const { data: scopes }     = useAnalyticsScopeBreakdown();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>Analytics & Reports</h1>
        <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
          Trend analysis, breakdown & industry benchmarks
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Highest Month", value: "82.1 t CO₂e", sub: "Aug 2024", icon: "📈", color: "#ef4444" },
          { label: "Lowest Month",  value: "64.5 t CO₂e", sub: "May 2025", icon: "📉", color: "#22c55e" },
          { label: "YoY Reduction", value: "−14.7%",       sub: "vs FY 2023-24", icon: "🏆", color: "#10b981" },
          { label: "Top Source",    value: "Electricity",  sub: "36.9% of total",  icon: "⚡", color: "#f59e0b" },
        ].map((k) => (
          <div key={k.label} style={{
            background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)",
            borderRadius: 14, padding: "1rem 1.125rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${k.color}, transparent)` }} />
            <div style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(134,239,172,0.4)", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "#f0fdf4", fontFamily: "JetBrains Mono, monospace" }}>{k.value}</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.35)", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 12-month trend area chart */}
      <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4" }}>12-Month Emission Trend</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginTop: 2 }}>GHG scope breakdown · kg CO₂e</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {[{ color: "#16a34a", label: "Scope 1" }, { color: "#10b981", label: "Scope 2" }, { color: "#a3e635", label: "Scope 3" }].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "rgba(134,239,172,0.55)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />{s.label}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trends || []} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
            <defs>
              {[["g1","#16a34a"],["g2","#10b981"],["g3","#a3e635"]].map(([id,color]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,163,74,0.06)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(134,239,172,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(134,239,172,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "rgba(5,14,5,0.98)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`${Number(v).toLocaleString()} kg`, ""]} />
            <Area type="monotone" dataKey="scope_1_kg" stroke="#16a34a" fill="url(#g1)" strokeWidth={2} name="Scope 1" />
            <Area type="monotone" dataKey="scope_2_kg" stroke="#10b981" fill="url(#g2)" strokeWidth={2} name="Scope 2" />
            <Area type="monotone" dataKey="scope_3_kg" stroke="#a3e635" fill="url(#g3)" strokeWidth={2} name="Scope 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: categories + scope pie + benchmark */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px 320px", gap: 14 }}>
        {/* Category bar */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1rem" }}>Top Emission Categories</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categories || []} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(22,163,74,0.06)" />
              <XAxis type="number" tick={{ fill: "rgba(134,239,172,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="label" type="category" tick={{ fill: "rgba(134,239,172,0.55)", fontSize: 10 }} width={145} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any) => [formatCO2e(Number(v)), "CO₂e"]} contentStyle={{ background: "rgba(5,14,5,0.98)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="total_kg" fill="#16a34a" radius={[0, 6, 6, 0]} name="CO₂e (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scope donut */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "0.75rem" }}>Scope Split</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={scopes || []} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value_kg" nameKey="label" paddingAngle={3}>
                {(scopes || []).map((_: any, i: number) => <Cell key={i} fill={SCOPE_COLORS[i % 3]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [formatCO2e(Number(v)), ""]} contentStyle={{ background: "rgba(5,14,5,0.98)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 12, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.5)" }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Scope % breakdown */}
          <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: 6 }}>
            {(scopes || []).map((s: any, i: number) => (
              <div key={s.scope} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span style={{ color: "rgba(134,239,172,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: SCOPE_COLORS[i], display: "inline-block" }} />{s.label}
                </span>
                <span style={{ fontWeight: 600, color: "#f0fdf4", fontFamily: "monospace" }}>
                  {((s.value_kg / (scopes?.reduce((a: number, x: any) => a + x.value_kg, 0) || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry benchmark */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1rem" }}>🏭 Industry Benchmark</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <select className="eco-input" style={{ flex: 1, fontSize: "0.75rem", padding: "0.4rem 0.625rem" }} value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
            </select>
            <input className="eco-input" type="number" min={1} value={employees} onChange={(e) => setEmployees(parseInt(e.target.value)||100)} style={{ width: 70, fontSize: "0.75rem", padding: "0.4rem 0.5rem", fontFamily: "monospace" }} />
          </div>

          {benchmarks && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Your organization", value: `${benchmarks.org_per_employee_tonnes.toFixed(2)} t`, color: "#4ade80" },
                { label: "Industry average",  value: `${benchmarks.benchmark_per_employee_tonnes.toFixed(2)} t`, color: "rgba(134,239,172,0.5)" },
              ].map((row) => (
                <div key={row.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                    <span style={{ color: "rgba(134,239,172,0.55)" }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: row.color, fontFamily: "monospace" }}>{row.value} / employee</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(22,163,74,0.1)", borderRadius: 999 }}>
                    <div style={{ height: "100%", borderRadius: 999, background: row.color === "#4ade80" ? "linear-gradient(90deg,#16a34a,#22c55e)" : "rgba(134,239,172,0.2)", width: `${Math.min(100, (parseFloat(row.value) / 20) * 100)}%` }} />
                  </div>
                </div>
              ))}
              <div style={{
                padding: "0.75rem", borderRadius: 12, textAlign: "center", marginTop: 4,
                background: benchmarks.performance === "above_average" ? "rgba(22,163,74,0.08)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${benchmarks.performance === "above_average" ? "rgba(22,163,74,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: benchmarks.performance === "above_average" ? "#22c55e" : "#ef4444" }}>
                  {benchmarks.vs_benchmark_pct > 0 ? "+" : ""}{benchmarks.vs_benchmark_pct.toFixed(1)}%
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.45)", marginTop: 2 }}>
                  {benchmarks.performance === "above_average" ? "🌱 Better than industry average!" : "⚠️ Above industry average"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
