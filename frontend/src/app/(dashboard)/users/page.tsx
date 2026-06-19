"use client";
import { useState } from "react";

const MOCK_USERS = [
  { id: "usr-001", name: "Sakthi Nathan",      email: "sakthiathaneee@gmail.com",  role: "admin",   avatar: "SN", status: "active",   last_active: "2025-06-16T14:00:00Z", emissions_logged: 24 },
  { id: "usr-002", name: "Priya Krishnamurthy", email: "priya.k@techcorp.in",       role: "manager", avatar: "PK", status: "active",   last_active: "2025-06-15T18:30:00Z", emissions_logged: 18 },
  { id: "usr-003", name: "Arjun Sharma",        email: "arjun.s@techcorp.in",       role: "analyst", avatar: "AS", status: "active",   last_active: "2025-06-15T16:00:00Z", emissions_logged: 31 },
  { id: "usr-004", name: "Deepa Menon",         email: "deepa.m@techcorp.in",       role: "viewer",  avatar: "DM", status: "inactive", last_active: "2025-06-10T10:00:00Z", emissions_logged: 5  },
  { id: "usr-005", name: "Rajesh Kumar",        email: "rajesh.k@techcorp.in",      role: "analyst", avatar: "RK", status: "active",   last_active: "2025-06-16T09:00:00Z", emissions_logged: 42 },
  { id: "usr-006", name: "Ananya Patel",        email: "ananya.p@techcorp.in",      role: "viewer",  avatar: "AP", status: "active",   last_active: "2025-06-14T11:00:00Z", emissions_logged: 8  },
];

const ROLE_STYLES: Record<string, { color: string; bg: string }> = {
  admin:   { color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  manager: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  analyst: { color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
  viewer:  { color: "rgba(134,239,172,0.5)", bg: "rgba(22,163,74,0.06)" },
};

export default function UsersPage() {
  const [invite, setInvite] = useState("");
  const [role, setRole]     = useState("viewer");
  const [sent, setSent]     = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;
    setSent(true);
    setTimeout(() => { setInvite(""); setSent(false); }, 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>Team Members</h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
            {MOCK_USERS.length} members · Manage roles and access
          </p>
        </div>
      </div>

      {/* Invite card */}
      <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: 18, padding: "1.375rem" }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1rem" }}>📧 Invite New Member</div>
        <form onSubmit={handleInvite} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="email" value={invite} onChange={(e) => setInvite(e.target.value)}
            placeholder="colleague@company.com"
            className="eco-input" style={{ flex: 1, minWidth: 220, fontSize: "0.875rem" }}
            required
          />
          <select className="eco-input" value={role} onChange={(e) => setRole(e.target.value)} style={{ fontSize: "0.875rem" }}>
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={{
            padding: "0.5rem 1.25rem", borderRadius: 10, border: "none", cursor: "pointer",
            background: sent ? "rgba(22,163,74,0.25)" : "linear-gradient(135deg,#16a34a,#15803d)",
            color: sent ? "#4ade80" : "#f0fdf4", fontWeight: 600, fontSize: "0.875rem",
            transition: "all 0.2s",
          }}>
            {sent ? "✓ Invite Sent!" : "Send Invite"}
          </button>
        </form>
      </div>

      {/* Role legend */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {Object.entries(ROLE_STYLES).map(([r, s]) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: s.bg, border: `1px solid ${s.color}30` }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize", color: s.color }}>{r}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "0.75rem", color: "rgba(134,239,172,0.4)", alignSelf: "center" }}>
          Admin → Manager → Analyst → Viewer
        </div>
      </div>

      {/* Users table */}
      <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(22,163,74,0.05)" }}>
              {["Member", "Role", "Status", "Emissions Logged", "Last Active", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(134,239,172,0.45)", borderBottom: "1px solid rgba(22,163,74,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u) => {
              const rs = ROLE_STYLES[u.role];
              const isActive = u.status === "active";
              return (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(22,163,74,0.05)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Avatar + name */}
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "linear-gradient(135deg,#16a34a,#10b981)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.8125rem", color: "#fff",
                      }}>{u.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#f0fdf4" }}>{u.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: rs.bg, color: rs.color, textTransform: "capitalize" }}>{u.role}</span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? "#22c55e" : "rgba(134,239,172,0.2)", boxShadow: isActive ? "0 0 6px #22c55e" : "none" }} />
                      <span style={{ fontSize: "0.75rem", color: isActive ? "#4ade80" : "rgba(134,239,172,0.4)", textTransform: "capitalize" }}>{u.status}</span>
                    </div>
                  </td>
                  {/* Emissions logged */}
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 4, background: "rgba(22,163,74,0.1)", borderRadius: 999 }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (u.emissions_logged / 50) * 100)}%`, background: "#16a34a", borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f0fdf4", fontFamily: "monospace" }}>{u.emissions_logged}</span>
                    </div>
                  </td>
                  {/* Last active */}
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", color: "rgba(134,239,172,0.45)" }}>
                    {new Date(u.last_active).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "4px 10px", borderRadius: 7, fontSize: "0.7rem", border: "1px solid rgba(22,163,74,0.2)", background: "rgba(22,163,74,0.06)", color: "rgba(134,239,172,0.7)", cursor: "pointer" }}>Edit</button>
                      {u.role !== "admin" && (
                        <button style={{ padding: "4px 10px", borderRadius: 7, fontSize: "0.7rem", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>Remove</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
