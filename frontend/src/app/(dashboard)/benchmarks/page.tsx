"use client";
import { useState } from "react";
import { useAnalyticsBenchmarks, useAnalyticsScopeBreakdown } from "@/hooks/useEmissions";
import { formatCO2e } from "@/lib/utils";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";

const INDUSTRIES = ["technology", "manufacturing", "retail", "finance", "healthcare", "logistics", "agriculture", "education"];

const FRAMEWORKS = [
  { name: "GHG Protocol", status: "aligned", description: "Scope 1, 2 & 3 methodology", icon: "📘" },
  { name: "TCFD",          status: "aligned", description: "Climate risk disclosure",      icon: "🏦" },
  { name: "CSRD",          status: "in_progress", description: "EU sustainability reporting", icon: "🇪🇺" },
  { name: "SBTi",          status: "pending",  description: "Science-Based Targets",       icon: "🎯" },
  { name: "CDP",           status: "aligned",  description: "Carbon Disclosure Project",   icon: "🌿" },
  { name: "ISO 14064",     status: "in_progress", description: "GHG inventory standard",  icon: "🔬" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  aligned:     { color: "#22c55e", bg: "rgba(22,163,74,0.12)",  label: "✓ Aligned"      },
  in_progress: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "⏳ In Progress" },
  pending:     { color: "rgba(134,239,172,0.4)", bg: "rgba(22,163,74,0.05)", label: "○ Pending" },
};

export default function BenchmarksPage() {
  const [industry, setIndustry]   = useState("technology");
  const [employees, setEmployees] = useState(100);

  const { data: bench } = useAnalyticsBenchmarks(industry, employees);
  const { data: scopes } = useAnalyticsScopeBreakdown();

  // Radar chart — compare org vs industry across categories
  const radarData = [
    { subject: "Scope 1",    org: 25, industry: 35 },
    { subject: "Scope 2",    org: 37, industry: 42 },
    { subject: "Scope 3",    org: 38, industry: 45 },
    { subject: "Travel",     org: 18, industry: 28 },
    { subject: "Supply Chain", org: 42, industry: 55 },
    { subject: "Waste",      org: 8,  industry: 14 },
  ];

  // Peer comparison bar data
  const peerData = [
    { name: "Your Org",   value: bench?.org_per_employee_tonnes ?? 8.47,  color: "#16a34a" },
    { name: "Top 25%",    value: 6.2,   color: "rgba(134,239,172,0.4)" },
    { name: "Avg " + (industry.charAt(0).toUpperCase() + industry.slice(1)), value: bench?.benchmark_per_employee_tonnes ?? 12.3, color: "rgba(134,239,172,0.25)" },
    { name: "Bottom 25%", value: 18.4,  color: "rgba(134,239,172,0.15)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>Benchmarks & Standards</h1>
        <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
          Compare your performance against industry peers and regulatory frameworks
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Industry</label>
          <select className="eco-input" value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ fontSize: "0.8125rem", padding: "0.4rem 0.75rem" }}>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Employees</label>
          <input className="eco-input" type="number" min={1} value={employees} onChange={(e) => setEmployees(parseInt(e.target.value) || 100)} style={{ width: 90, fontSize: "0.8125rem", padding: "0.4rem 0.75rem", fontFamily: "monospace" }} />
        </div>
        {bench && (
          <div style={{
            marginLeft: "auto", padding: "0.625rem 1.25rem", borderRadius: 12,
            background: bench.performance === "above_average" ? "rgba(22,163,74,0.12)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${bench.performance === "above_average" ? "rgba(22,163,74,0.25)" : "rgba(239,68,68,0.2)"}`,
          }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: bench.performance === "above_average" ? "#22c55e" : "#ef4444", fontFamily: "monospace" }}>
              {bench.vs_benchmark_pct > 0 ? "+" : ""}{bench.vs_benchmark_pct.toFixed(1)}%
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.5)", marginTop: 2 }}>
              vs {industry} average
            </div>
          </div>
        )}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Radar */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "0.5rem" }}>Category Performance Radar</div>
          <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginBottom: "1rem", display: "flex", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />Your Org</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(134,239,172,0.3)", display: "inline-block" }} />Industry</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(22,163,74,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(134,239,172,0.5)", fontSize: 11 }} />
              <Radar name="Your Org" dataKey="org" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} strokeWidth={2} />
              <Radar name="Industry" dataKey="industry" stroke="rgba(134,239,172,0.35)" fill="rgba(134,239,172,0.07)" strokeWidth={1.5} strokeDasharray="4 3" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Peer bar */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "0.25rem" }}>Peer Comparison</div>
          <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginBottom: "1rem" }}>Tonnes CO₂e per employee</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={peerData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,163,74,0.06)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(134,239,172,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(134,239,172,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)} t CO₂e`, ""]} contentStyle={{ background: "rgba(5,14,5,0.98)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {peerData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regulatory frameworks */}
      <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
        <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1.125rem" }}>Regulatory Framework Alignment</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {FRAMEWORKS.map((fw) => {
            const sty = STATUS_STYLE[fw.status];
            return (
              <div key={fw.name} style={{ padding: "1rem", borderRadius: 14, background: sty.bg, border: `1px solid ${sty.color}30`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{fw.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4" }}>{fw.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.5)", marginTop: 2, marginBottom: 8 }}>{fw.description}</div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: sty.bg, color: sty.color, border: `1px solid ${sty.color}40` }}>
                    {sty.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
