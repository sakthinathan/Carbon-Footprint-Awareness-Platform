"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const TABS = ["Profile", "Organization", "Notifications", "API Keys", "Integrations"];

const NOTIFICATION_SETTINGS = [
  { key: "threshold",  label: "Threshold Alerts",     desc: "When emissions exceed set limits",          default: true  },
  { key: "weekly",     label: "Weekly Digest",        desc: "Summary email every Monday",                default: true  },
  { key: "anomaly",    label: "Anomaly Detection",    desc: "Unusual emission spikes",                   default: true  },
  { key: "supplier",   label: "Supplier Updates",     desc: "Supplier ESG report submissions",           default: false },
  { key: "milestone",  label: "Net Zero Milestones",  desc: "Progress towards sustainability goals",     default: true  },
  { key: "report",     label: "Report Ready",         desc: "When regulatory reports are generated",     default: true  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]           = useState("Profile");
  const [orgName, setOrgName]               = useState("TechCorp India Pvt Ltd");
  const [industry, setIndustry]             = useState("technology");
  const [baselineYear, setBaselineYear]     = useState("2022");
  const [netZeroTarget, setNetZeroTarget]   = useState("2030");
  const [notifications, setNotifications]   = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((n) => [n.key, n.default]))
  );
  const [saved, setSaved]                   = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>Settings</h1>
        <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
          Manage your account, organization & preferences
        </p>
      </div>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        {/* Sidebar tabs */}
        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              textAlign: "left", padding: "0.625rem 0.875rem", borderRadius: 10,
              background: activeTab === tab ? "rgba(22,163,74,0.12)" : "transparent",
              border: activeTab === tab ? "1px solid rgba(22,163,74,0.22)" : "1px solid transparent",
              color: activeTab === tab ? "#4ade80" : "rgba(134,239,172,0.5)",
              fontSize: "0.8125rem", fontWeight: activeTab === tab ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeTab === "Profile" && (
            <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4" }}>Profile Information</div>
              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {user?.photoURL ? (
                  <Image src={user.photoURL} alt="" width={64} height={64} style={{ borderRadius: 16, border: "2px solid rgba(22,163,74,0.3)" }} unoptimized />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#16a34a,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
                    {user?.displayName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#f0fdf4" }}>{user?.displayName || "User"}</div>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(134,239,172,0.5)", marginTop: 2 }}>{user?.email}</div>
                  <div style={{ fontSize: "0.75rem", marginTop: 4, padding: "2px 8px", borderRadius: 999, background: "rgba(192,132,252,0.12)", color: "#c084fc", display: "inline-block" }}>Admin</div>
                </div>
              </div>
              {/* Fields */}
              {[
                { label: "Display Name",    value: user?.displayName || "", readonly: true },
                { label: "Email Address",   value: user?.email || "",       readonly: true },
                { label: "Authentication",  value: "Google OAuth (Firebase)", readonly: true },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(134,239,172,0.45)", display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input className="eco-input" value={f.value} readOnly={f.readonly} onChange={() => {}} style={{ width: "100%", fontSize: "0.875rem", opacity: f.readonly ? 0.7 : 1 }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "Organization" && (
            <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4" }}>Organization Settings</div>
              {[
                { label: "Organization Name", value: orgName, set: setOrgName, type: "text" },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(134,239,172,0.45)", display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input className="eco-input" type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} style={{ width: "100%", fontSize: "0.875rem" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Industry",         value: industry,     set: setIndustry,     options: ["technology","manufacturing","retail","finance","healthcare","logistics"] },
                  { label: "Baseline Year",    value: baselineYear, set: setBaselineYear, options: ["2019","2020","2021","2022","2023"] },
                  { label: "Net Zero Target",  value: netZeroTarget, set: setNetZeroTarget, options: ["2030","2035","2040","2045","2050"] },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(134,239,172,0.45)", display: "block", marginBottom: 5 }}>{f.label}</label>
                    <select className="eco-input" value={f.value} onChange={(e) => f.set(e.target.value)} style={{ width: "100%", fontSize: "0.875rem" }}>
                      {f.options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} style={{
                alignSelf: "flex-start", padding: "0.5rem 1.25rem", borderRadius: 10, border: "none", cursor: "pointer",
                background: saved ? "rgba(22,163,74,0.2)" : "linear-gradient(135deg,#16a34a,#15803d)",
                color: saved ? "#4ade80" : "#f0fdf4", fontWeight: 600, fontSize: "0.875rem",
              }}>{saved ? "✓ Saved!" : "Save Changes"}</button>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.5rem" }}>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1.125rem" }}>Notification Preferences</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {NOTIFICATION_SETTINGS.map((n, idx) => (
                  <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 0", borderBottom: idx < NOTIFICATION_SETTINGS.length - 1 ? "1px solid rgba(22,163,74,0.07)" : "none" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f0fdf4" }}>{n.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.45)", marginTop: 2 }}>{n.desc}</div>
                    </div>
                    {/* Toggle */}
                    <button onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))} style={{
                      width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
                      background: notifications[n.key] ? "linear-gradient(135deg,#16a34a,#22c55e)" : "rgba(22,163,74,0.12)",
                      transition: "all 0.2s",
                    }}>
                      <div style={{
                        position: "absolute", top: 3, left: notifications[n.key] ? 20 : 3, width: 18, height: 18, borderRadius: "50%",
                        background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "API Keys" && (
            <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4" }}>API Keys</div>
              {[
                { name: "Production API Key",   key: "eco_prod_a1b2c3d4e5f6...a8b9", created: "2025-01-15", status: "active" },
                { name: "Development API Key",  key: "eco_dev_x9y8z7w6v5u4...m3n2",  created: "2025-03-01", status: "active" },
              ].map((k) => (
                <div key={k.name} style={{ padding: "1rem", borderRadius: 12, background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.12)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#f0fdf4" }}>{k.name}</span>
                    <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 999, background: "rgba(22,163,74,0.12)", color: "#4ade80" }}>● Active</span>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8125rem", color: "rgba(134,239,172,0.5)", padding: "0.375rem 0.625rem", background: "rgba(22,163,74,0.04)", borderRadius: 7, marginBottom: 6 }}>{k.key}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.35)" }}>Created: {k.created}</div>
                </div>
              ))}
              <button style={{ alignSelf: "flex-start", padding: "0.5rem 1.125rem", borderRadius: 10, border: "1px solid rgba(22,163,74,0.25)", background: "rgba(22,163,74,0.06)", color: "rgba(134,239,172,0.7)", fontSize: "0.8125rem", cursor: "pointer" }}>
                + Generate New Key
              </button>
            </div>
          )}

          {activeTab === "Integrations" && (
            <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.5rem" }}>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1.125rem" }}>Integrations</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { name: "Google Workspace",  desc: "SSO & Calendar",       icon: "🔵", connected: true  },
                  { name: "Slack",             desc: "Alert notifications",  icon: "💬", connected: true  },
                  { name: "SAP ERP",           desc: "Financial data sync",  icon: "🏢", connected: false },
                  { name: "Salesforce",        desc: "CRM integration",      icon: "☁️", connected: false },
                  { name: "Power BI",          desc: "Advanced dashboards",  icon: "📊", connected: false },
                  { name: "Jira",              desc: "Action tracking",      icon: "🎯", connected: true  },
                ].map((int) => (
                  <div key={int.name} style={{ padding: "1rem", borderRadius: 12, background: int.connected ? "rgba(22,163,74,0.05)" : "rgba(22,163,74,0.02)", border: `1px solid rgba(22,163,74,${int.connected ? "0.18" : "0.08"})`, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{int.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#f0fdf4" }}>{int.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginTop: 1 }}>{int.desc}</div>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: int.connected ? "rgba(22,163,74,0.12)" : "rgba(22,163,74,0.04)", color: int.connected ? "#4ade80" : "rgba(134,239,172,0.35)", border: `1px solid rgba(22,163,74,${int.connected ? "0.25" : "0.08"})` }}>
                      {int.connected ? "Connected" : "Connect"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
