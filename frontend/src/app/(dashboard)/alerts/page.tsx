"use client";
import { useState } from "react";
import { MOCK_ALERTS } from "@/lib/mockData";

const SEVERITY_STYLES: Record<string, { bg: string; border: string; badge: string; color: string; icon: string }> = {
  high:   { bg: "rgba(239,68,68,0.05)",   border: "rgba(239,68,68,0.15)",   badge: "rgba(239,68,68,0.15)",   color: "#f87171", icon: "🔴" },
  medium: { bg: "rgba(245,158,11,0.05)",  border: "rgba(245,158,11,0.15)",  badge: "rgba(245,158,11,0.15)",  color: "#fbbf24", icon: "🟡" },
  low:    { bg: "rgba(22,163,74,0.04)",   border: "rgba(22,163,74,0.12)",   badge: "rgba(22,163,74,0.12)",   color: "#4ade80", icon: "🟢" },
};

const TYPE_ICONS: Record<string, string> = {
  threshold: "📊", anomaly: "⚡", report: "📋", supplier: "🏭", milestone: "🏆",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");

  const markRead = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));

  const filtered = alerts.filter((a) => {
    if (filter === "unread") return !a.read;
    if (filter === "high") return a.severity === "high";
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>
            Alerts & Notifications
            {unreadCount > 0 && (
              <span style={{ marginLeft: 10, fontSize: "0.875rem", padding: "2px 10px", borderRadius: 999, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontWeight: 700 }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
            Threshold breaches, anomalies & milestones
          </p>
        </div>
        <button onClick={markAllRead} style={{ padding: "0.5rem 1rem", borderRadius: 10, background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", color: "rgba(134,239,172,0.7)", fontSize: "0.8125rem", cursor: "pointer" }}>
          ✓ Mark all read
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { key: "all",    label: "All",         count: alerts.length },
          { key: "unread", label: "Unread",      count: unreadCount },
          { key: "high",   label: "High Priority", count: alerts.filter((a) => a.severity === "high").length },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key as any)} style={{
            padding: "0.4375rem 0.875rem", borderRadius: 9, fontSize: "0.8125rem", cursor: "pointer",
            background: filter === f.key ? "rgba(22,163,74,0.15)" : "rgba(22,163,74,0.05)",
            border: filter === f.key ? "1px solid rgba(22,163,74,0.35)" : "1px solid rgba(22,163,74,0.1)",
            color: filter === f.key ? "#4ade80" : "rgba(134,239,172,0.55)",
            fontWeight: filter === f.key ? 600 : 400,
          }}>
            {f.label} <span style={{ opacity: 0.6 }}>({f.count})</span>
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((alert) => {
          const sty = SEVERITY_STYLES[alert.severity];
          return (
            <div key={alert.id} style={{
              display: "flex", alignItems: "flex-start", gap: 14, padding: "1.125rem 1.25rem",
              borderRadius: 16, background: alert.read ? "rgba(8,18,8,0.7)" : sty.bg,
              border: `1px solid ${alert.read ? "rgba(22,163,74,0.08)" : sty.border}`,
              transition: "all 0.2s", position: "relative", overflow: "hidden",
            }}>
              {!alert.read && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: sty.color, borderRadius: "3px 0 0 3px" }} />}

              <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.12)", flexShrink: 0 }}>
                {TYPE_ICONS[alert.type] || "🔔"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4" }}>{alert.title}</span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: sty.badge, color: sty.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {alert.severity}
                  </span>
                  {!alert.read && <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "rgba(22,163,74,0.12)", color: "#4ade80" }}>NEW</span>}
                </div>
                <p style={{ fontSize: "0.8125rem", color: "rgba(134,239,172,0.55)", lineHeight: 1.5 }}>{alert.message}</p>
                <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.3)", marginTop: 6 }}>
                  {new Date(alert.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {!alert.read && (
                <button onClick={() => markRead(alert.id)} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.15)", color: "rgba(134,239,172,0.6)", fontSize: "0.75rem", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
                  Mark read
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
