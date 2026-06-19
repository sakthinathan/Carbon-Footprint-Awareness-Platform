"use client";
import { useState } from "react";
import { useEmissionsList, useDeleteEmission, useExportCsv } from "@/hooks/useEmissions";
import { formatCO2e } from "@/lib/utils";
import { EmissionScope } from "@/types/emission.types";
import Link from "next/link";

const SCOPE_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  scope_1: { color: "#4ade80",  bg: "rgba(22,163,74,0.12)",  label: "Scope 1" },
  scope_2: { color: "#34d399",  bg: "rgba(16,185,129,0.12)", label: "Scope 2" },
  scope_3: { color: "#a3e635",  bg: "rgba(132,204,22,0.12)", label: "Scope 3" },
};

const SCOPE_FILTERS = [
  { key: "",        label: "All Scopes" },
  { key: "scope_1", label: "Scope 1 — Direct" },
  { key: "scope_2", label: "Scope 2 — Energy" },
  { key: "scope_3", label: "Scope 3 — Value Chain" },
];

export default function EmissionsPage() {
  const [page, setPage]     = useState(1);
  const [scope, setScope]   = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useEmissionsList({ page, page_size: 10, scope: scope || undefined, search: search || undefined });
  const deleteEmission      = useDeleteEmission();
  const exportCsv           = useExportCsv();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>Emission Records</h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
            {data?.total ?? 0} records · {data ? formatCO2e(data.total_co2e_kg) : "—"} total CO₂e
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => exportCsv.mutate()} disabled={exportCsv.isPending} style={{ padding: "0.5rem 0.875rem", borderRadius: 10, background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.15)", color: "rgba(134,239,172,0.7)", fontSize: "0.8125rem", cursor: "pointer" }}>
            📥 Export CSV
          </button>
          <Link href="/emissions/log" style={{ padding: "0.5rem 1rem", borderRadius: 10, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#f0fdf4", fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 0 12px rgba(22,163,74,0.3)" }}>
            + Log Emission
          </Link>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { scope: "scope_1", value: data?.items.filter((i) => i.scope === EmissionScope.SCOPE_1).reduce((a,i) => a + i.co2_equivalent_kg, 0) ?? 0 },
          { scope: "scope_2", value: data?.items.filter((i) => i.scope === EmissionScope.SCOPE_2).reduce((a,i) => a + i.co2_equivalent_kg, 0) ?? 0 },
          { scope: "scope_3", value: data?.items.filter((i) => i.scope === EmissionScope.SCOPE_3).reduce((a,i) => a + i.co2_equivalent_kg, 0) ?? 0 },
        ].map((s) => {
          const sty = SCOPE_STYLES[s.scope];
          return (
            <div key={s.scope} onClick={() => setScope(scope === s.scope ? "" : s.scope)} style={{ cursor: "pointer", padding: "0.875rem 1rem", borderRadius: 12, background: scope === s.scope ? sty.bg : "rgba(8,18,8,0.8)", border: `1px solid ${scope === s.scope ? sty.color + "44" : "rgba(22,163,74,0.1)"}`, transition: "all 0.2s" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: sty.color, marginBottom: 4 }}>{sty.label}</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f0fdf4", fontFamily: "monospace" }}>{formatCO2e(s.value)}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(134,239,172,0.35)" }}>🔍</span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            placeholder="Search records..."
            className="eco-input" style={{ paddingLeft: "2rem", fontSize: "0.8125rem" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {SCOPE_FILTERS.map((f) => (
            <button key={f.key} onClick={() => { setScope(f.key); setPage(1); }} style={{
              padding: "0.4rem 0.75rem", borderRadius: 8, fontSize: "0.75rem", cursor: "pointer",
              background: scope === f.key ? "rgba(22,163,74,0.15)" : "rgba(22,163,74,0.04)",
              border: scope === f.key ? "1px solid rgba(22,163,74,0.35)" : "1px solid rgba(22,163,74,0.1)",
              color: scope === f.key ? "#4ade80" : "rgba(134,239,172,0.5)", fontWeight: scope === f.key ? 600 : 400,
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(134,239,172,0.4)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>Loading emissions data…
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(22,163,74,0.05)" }}>
                {["Title", "Scope", "Category", "Amount", "CO₂e", "Date", "Verified", ""].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(134,239,172,0.45)", borderBottom: "1px solid rgba(22,163,74,0.08)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.items ?? []).map((em) => {
                const sty = SCOPE_STYLES[em.scope] ?? SCOPE_STYLES.scope_1;
                return (
                  <tr key={em.id} style={{ borderBottom: "1px solid rgba(22,163,74,0.05)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.03)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#f0fdf4" }}>{em.title}</div>
                      {em.location && <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.35)", marginTop: 2 }}>📍 {em.location}</div>}
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: sty.bg, color: sty.color }}>{sty.label}</span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", color: "rgba(134,239,172,0.55)" }}>
                      {em.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#f0fdf4", fontFamily: "monospace" }}>
                      {em.amount.toLocaleString()} {em.unit}
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 700, fontSize: "0.875rem", color: sty.color, fontFamily: "monospace" }}>
                      {formatCO2e(em.co2_equivalent_kg)}
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", color: "rgba(134,239,172,0.45)", whiteSpace: "nowrap" }}>
                      {new Date(em.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                        background: em.is_verified ? "rgba(22,163,74,0.12)" : "rgba(245,158,11,0.1)",
                        color: em.is_verified ? "#4ade80" : "#fbbf24",
                      }}>
                        {em.is_verified ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "0.875rem 0.75rem" }}>
                      <button onClick={() => { if (confirm("Delete this record?")) deleteEmission.mutate(em.id); }} style={{ padding: "3px 8px", borderRadius: 7, fontSize: "0.7rem", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div style={{ padding: "0.875rem 1rem", borderTop: "1px solid rgba(22,163,74,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.4)" }}>
              Page {data.page} of {data.total_pages} · {data.total} records
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "4px 12px", borderRadius: 7, border: "1px solid rgba(22,163,74,0.15)", background: "rgba(22,163,74,0.05)", color: "rgba(134,239,172,0.6)", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: "0.75rem" }}>← Prev</button>
              <button onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages} style={{ padding: "4px 12px", borderRadius: 7, border: "1px solid rgba(22,163,74,0.15)", background: "rgba(22,163,74,0.05)", color: "rgba(134,239,172,0.6)", cursor: page === data.total_pages ? "not-allowed" : "pointer", opacity: page === data.total_pages ? 0.4 : 1, fontSize: "0.75rem" }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
