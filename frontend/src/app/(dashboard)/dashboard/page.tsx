"use client";
import { useEmissionSummary, useAnalyticsTrends, useAnalyticsScopeBreakdown } from "@/hooks/useEmissions";
import { formatCO2e, formatChange } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

// ── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({
  emoji, title, value, sub, change, changePositive, accentColor, delay,
}: {
  emoji: string; title: string; value: string; sub?: string;
  change?: string; changePositive?: boolean; accentColor: string; delay: number;
}) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: "rgba(8,18,8,0.8)", border: `1px solid ${accentColor}22`,
        borderRadius: 18, padding: "1.375rem", position: "relative", overflow: "hidden",
        animationDelay: `${delay}ms`, transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = `1px solid ${accentColor}44`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = `1px solid ${accentColor}22`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      {/* Glow blob */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${accentColor}10`, pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(134,239,172,0.45)", marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: "1.875rem", fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "#f0fdf4", lineHeight: 1.1 }}>{value}</div>
          {sub && <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.35)", marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 13, fontSize: 22,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${accentColor}15`, border: `1px solid ${accentColor}25`, flexShrink: 0,
        }}>{emoji}</div>
      </div>

      {change && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 12 }}>
          <span style={{ fontSize: 14 }}>{changePositive ? "📉" : "📈"}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: changePositive ? "#22c55e" : "#ef4444" }}>{change}</span>
          <span style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.35)" }}>vs last month</span>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useEmissionSummary();
  const { data: trends } = useAnalyticsTrends(6);
  const { data: scopeBreakdown } = useAnalyticsScopeBreakdown();

  const change = summary ? formatChange(summary.change_vs_last_month_pct) : null;
  const SCOPE_COLORS = ["#16a34a", "#10b981", "#a3e635"];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 140, borderRadius: 18, background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.08)", animation: "pulse 2s infinite" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className="animate-fade-in-up">
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>
            {greeting()}, {user?.displayName?.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
            Here's your carbon intelligence overview — {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/analytics" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "0.5rem 1rem",
            borderRadius: 10, background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.15)",
            color: "rgba(134,239,172,0.7)", fontSize: "0.8125rem", textDecoration: "none",
          }}>📊 Analytics</Link>
          <Link href="/emissions/log" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "0.5rem 1.125rem",
            borderRadius: 10, background: "linear-gradient(135deg,#16a34a,#15803d)",
            color: "#f0fdf4", fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
            boxShadow: "0 0 16px rgba(22,163,74,0.3)",
          }}>+ Log Emission</Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }} className="stagger">
        <KpiCard emoji="🌍" title="Total Emissions" value={summary ? formatCO2e(summary.total_emissions_kg) : "—"} sub="All scopes combined" change={change?.text} changePositive={change?.positive} accentColor="#16a34a" delay={0} />
        <KpiCard emoji="🔥" title="Scope 1 Direct" value={summary ? formatCO2e(summary.scope_1_kg) : "—"} sub="Fuel & combustion" accentColor="#f59e0b" delay={80} />
        <KpiCard emoji="⚡" title="Scope 2 Energy" value={summary ? formatCO2e(summary.scope_2_kg) : "—"} sub="Purchased electricity" accentColor="#10b981" delay={160} />
        <KpiCard emoji="🔗" title="Scope 3 Chain" value={summary ? formatCO2e(summary.scope_3_kg) : "—"} sub="Supply chain & travel" accentColor="#84cc16" delay={240} />
      </div>

      {/* ── Net Zero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(16,185,129,0.04))",
        border: "1px solid rgba(22,163,74,0.15)", borderRadius: 18, padding: "1.25rem 1.5rem",
        display: "flex", alignItems: "center", gap: "2rem",
      }} className="animate-fade-in-up">
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🎯</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4" }}>Net Zero 2030 Progress</span>
            </div>
            <span style={{
              fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999,
              background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80",
            }}>{summary?.net_zero_progress_pct?.toFixed(1) || 0}% complete</span>
          </div>
          <div style={{ height: 8, background: "rgba(22,163,74,0.1)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${summary?.net_zero_progress_pct || 0}%`, borderRadius: 999,
              background: "linear-gradient(90deg, #16a34a, #22c55e, #84cc16)",
              boxShadow: "0 0 12px rgba(22,163,74,0.5)", transition: "width 1.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.7rem", color: "rgba(134,239,172,0.35)" }}>
            <span>Current: {summary ? formatCO2e(summary.total_emissions_kg) : "—"}</span>
            <span>Target: Net Zero 2030</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexShrink: 0 }}>
          {[
            { icon: "📉", label: "Reduction", value: `${change?.text || "—"}` },
            { icon: "📅", label: "This Month", value: summary ? formatCO2e(summary.this_month_kg) : "—" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{stat.icon}</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginTop: 2 }}>{stat.value}</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(134,239,172,0.4)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14 }}>
        {/* Area Chart */}
        <div style={{
          background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)",
          borderRadius: 18, padding: "1.375rem",
        }} className="animate-fade-in-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4" }}>Emission Trends</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginTop: 2 }}>Last 6 months · kg CO₂e</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ color: "#16a34a", label: "Scope 1" }, { color: "#10b981", label: "Scope 2" }, { color: "#84cc16", label: "Scope 3" }].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: "rgba(134,239,172,0.5)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          {trends && trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trends} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  {[["s1", "#16a34a"], ["s2", "#10b981"], ["s3", "#84cc16"]].map(([id, color]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,163,74,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(134,239,172,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(134,239,172,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(5,14,5,0.98)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="scope_1_kg" stroke="#16a34a" fill="url(#s1)" strokeWidth={2} name="Scope 1" />
                <Area type="monotone" dataKey="scope_2_kg" stroke="#10b981" fill="url(#s2)" strokeWidth={2} name="Scope 2" />
                <Area type="monotone" dataKey="scope_3_kg" stroke="#84cc16" fill="url(#s3)" strokeWidth={2} name="Scope 3" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 36, opacity: 0.3 }}>📊</span>
              <p style={{ fontSize: "0.8125rem", color: "rgba(134,239,172,0.3)" }}>No trend data yet — start logging emissions</p>
              <Link href="/emissions/log" style={{ fontSize: "0.75rem", color: "#4ade80", textDecoration: "none" }}>+ Log your first emission →</Link>
            </div>
          )}
        </div>

        {/* Donut + Quick actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Scope donut */}
          <div style={{
            background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)",
            borderRadius: 18, padding: "1.25rem", flex: 1,
          }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "0.75rem" }}>Scope Breakdown</div>
            {scopeBreakdown && scopeBreakdown.some((s: any) => s.value_kg > 0) ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={scopeBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value_kg" nameKey="label" paddingAngle={3}>
                    {scopeBreakdown.map((_: any, i: number) => <Cell key={i} fill={SCOPE_COLORS[i % 3]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [formatCO2e(Number(v)), ""]} contentStyle={{ background: "rgba(5,14,5,0.98)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 12, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.5)" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 28, opacity: 0.25 }}>🌐</span>
                <p style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.3)" }}>No data yet</p>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div style={{
            background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)",
            borderRadius: 18, padding: "1rem",
          }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "0.625rem" }}>⚡ Quick Actions</div>
            {[
              { icon: "🔥", label: "Log Emission", href: "/emissions/log", color: "#f59e0b" },
              { icon: "🤖", label: "Ask AI Advisor", href: "/ai-advisor", color: "#10b981" },
              { icon: "📊", label: "View Analytics", href: "/analytics", color: "#84cc16" },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "0.5rem 0.625rem",
                  borderRadius: 9, marginBottom: 4, fontSize: "0.8125rem",
                  color: "rgba(134,239,172,0.65)", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.08)"; (e.currentTarget as HTMLElement).style.color = "#f0fdf4"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.65)"; }}
                >
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                  <span style={{ marginLeft: "auto", opacity: 0.4 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
