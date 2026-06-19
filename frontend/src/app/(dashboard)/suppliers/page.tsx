"use client";
import { MOCK_SUPPLIERS } from "@/lib/mockData";
import { useState } from "react";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  verified: { bg: "rgba(22,163,74,0.12)",   color: "#4ade80",  label: "✓ Verified"  },
  pending:  { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24",  label: "⏳ Pending"  },
  at_risk:  { bg: "rgba(239,68,68,0.10)",   color: "#f87171",  label: "⚠️ At Risk"  },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "rgba(22,163,74,0.1)", borderRadius: 999 }}>
        <div style={{ height: "100%", width: `${score}%`, borderRadius: 999, background: color, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color, fontFamily: "monospace", minWidth: 28 }}>{score}</span>
    </div>
  );
}

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_SUPPLIERS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalEmissions = MOCK_SUPPLIERS.reduce((a, s) => a + s.emissions_kg, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>Supplier Portal</h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
            Scope 3 supply chain emission tracking · {MOCK_SUPPLIERS.length} suppliers
          </p>
        </div>
        <button style={{
          padding: "0.5rem 1rem", borderRadius: 10,
          background: "linear-gradient(135deg,#16a34a,#15803d)",
          color: "#f0fdf4", fontSize: "0.8125rem", fontWeight: 600, border: "none", cursor: "pointer",
        }}>+ Invite Supplier</button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Total Suppliers", value: MOCK_SUPPLIERS.length, icon: "🏭", color: "#16a34a" },
          { label: "Verified",        value: MOCK_SUPPLIERS.filter((s) => s.status === "verified").length, icon: "✅", color: "#10b981" },
          { label: "At Risk",         value: MOCK_SUPPLIERS.filter((s) => s.status === "at_risk").length, icon: "⚠️", color: "#ef4444" },
          { label: "Supply Chain CO₂e", value: `${(totalEmissions/1000).toFixed(1)} t`, icon: "🔗", color: "#f59e0b" },
        ].map((k) => (
          <div key={k.label} style={{ background: "rgba(8,18,8,0.8)", border: `1px solid ${k.color}22`, borderRadius: 14, padding: "1rem 1.125rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${k.color},transparent)` }} />
            <div style={{ fontSize: "0.65rem", color: "rgba(134,239,172,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4", fontFamily: "JetBrains Mono,monospace" }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, overflow: "hidden" }}>
        {/* Search */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(22,163,74,0.08)" }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search suppliers..."
            style={{ width: "100%", maxWidth: 360, padding: "0.5rem 0.875rem", background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: 9, color: "#f0fdf4", fontSize: "0.8125rem", outline: "none" }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(22,163,74,0.05)" }}>
              {["Supplier", "Category", "Tier", "CO₂e Emissions", "ESG Score", "Status", "Last Report"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(134,239,172,0.45)", borderBottom: "1px solid rgba(22,163,74,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const st = STATUS_STYLES[s.status];
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(22,163,74,0.05)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#f0fdf4" }}>{s.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.35)", marginTop: 2 }}>{s.country}</div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "rgba(134,239,172,0.6)" }}>{s.category}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", color: "#4ade80" }}>Tier {s.tier}</span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "#f0fdf4", fontFamily: "monospace" }}>{(s.emissions_kg/1000).toFixed(1)} t CO₂e</td>
                  <td style={{ padding: "0.875rem 1rem", minWidth: 120 }}><ScoreBar score={s.score} /></td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: st.bg, color: st.color }}>{st.label}</span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", color: "rgba(134,239,172,0.4)" }}>{s.last_report}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
