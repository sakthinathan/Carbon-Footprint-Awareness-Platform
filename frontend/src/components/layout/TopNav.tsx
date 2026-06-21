"use client";
import { useAuth } from "@/hooks/useAuth";
import { useExportCsv } from "@/hooks/useEmissions";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function TopNav() {
  const { user, logout } = useAuth();
  const exportCsv = useExportCsv();
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header style={{
      height: 60, flexShrink: 0, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 1.5rem",
      background: "rgba(3,10,3,0.92)", borderBottom: "1px solid rgba(22,163,74,0.08)",
      backdropFilter: "blur(20px)", position: "relative", zIndex: 50,
    }}>
      {/* Search */}
      <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(134,239,172,0.35)" }}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emissions, categories, suppliers..."
          style={{
            width: "100%", padding: "0.5rem 0.875rem 0.5rem 2.25rem",
            background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.12)",
            borderRadius: 10, color: "#f0fdf4", fontSize: "0.8125rem", outline: "none",
            transition: "all 0.2s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(22,163,74,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.08)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(22,163,74,0.12)"; e.target.style.boxShadow = "none"; }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(134,239,172,0.4)", cursor: "pointer", fontSize: 16 }}>×</button>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Quick log emission */}
        <Link href="/emissions/log" style={{
          display: "flex", alignItems: "center", gap: 6, padding: "0.4375rem 0.875rem",
          borderRadius: 9, background: "linear-gradient(135deg, #16a34a, #15803d)",
          color: "#f0fdf4", fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
          boxShadow: "0 0 12px rgba(22,163,74,0.3)",
        }}>
          <span>+</span> Log Emission
        </Link>

        {/* Export */}
        <button
          onClick={() => exportCsv.mutate()}
          disabled={exportCsv.isPending}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "0.4375rem 0.75rem",
            borderRadius: 9, background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)",
            color: "rgba(134,239,172,0.7)", fontSize: "0.8125rem", cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.12)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.06)"; }}
        >
          📥 Export
        </button>

        {/* Notifications */}
        <button style={{
          width: 36, height: 36, borderRadius: 9, position: "relative",
          background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.12)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>
          🔔
          <span style={{
            position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%",
            background: "#22c55e", boxShadow: "0 0 6px #22c55e",
          }} />
        </button>

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "0.3rem 0.625rem 0.3rem 0.3rem",
              borderRadius: 10, background: showMenu ? "rgba(22,163,74,0.1)" : "transparent",
              border: "1px solid rgba(22,163,74,0.12)", cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.08)"; }}
            onMouseLeave={(e) => { if (!showMenu) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            {user?.photoURL ? (
              <Image src={user.photoURL} alt="" width={28} height={28} style={{ borderRadius: 8, border: "1.5px solid rgba(22,163,74,0.4)" }} unoptimized />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#16a34a,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8125rem", color: "#fff" }}>
                {user?.displayName?.[0] || "U"}
              </div>
            )}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f0fdf4", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.displayName?.split(" ")[0] || "User"}
              </div>
              <div style={{ fontSize: "0.6rem", color: "rgba(134,239,172,0.4)" }}>Admin</div>
            </div>
            <span style={{ fontSize: "0.6rem", color: "rgba(134,239,172,0.4)" }}>▼</span>
          </button>

          {showMenu && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowMenu(false)} />
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)", width: 220, zIndex: 50,
                background: "rgba(5,15,5,0.98)", border: "1px solid rgba(22,163,74,0.18)",
                borderRadius: 14, overflow: "hidden", backdropFilter: "blur(20px)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}>
                <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid rgba(22,163,74,0.08)" }}>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f0fdf4" }}>{user?.displayName}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.45)", marginTop: 2 }}>{user?.email}</div>
                </div>
                {[
                  { icon: "👤", label: "My Profile", href: "/settings" },
                  { icon: "⚙️", label: "Settings", href: "/settings" },
                  { icon: "📋", label: "Export Data", href: "#" },
                ].map((item) => (
                  <Link key={item.label} href={item.href} style={{ textDecoration: "none" }} onClick={() => setShowMenu(false)}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "0.625rem 1rem",
                      fontSize: "0.8125rem", color: "rgba(134,239,172,0.7)", transition: "all 0.1s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.08)"; (e.currentTarget as HTMLElement).style.color = "#4ade80"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.7)"; }}
                    >
                      <span>{item.icon}</span> {item.label}
                    </div>
                  </Link>
                ))}
                <div style={{ borderTop: "1px solid rgba(22,163,74,0.08)" }}>
                  <button
                    onClick={() => { setShowMenu(false); logout(); }}
                    style={{
                      width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                      padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "rgba(239,68,68,0.7)",
                      background: "none", border: "none", cursor: "pointer", transition: "all 0.1s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)"; (e.currentTarget as HTMLElement).style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.7)"; }}
                  >
                    🚪 Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
