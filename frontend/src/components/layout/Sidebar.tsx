"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard",    icon: "⊞",  label: "Dashboard",    badge: null    },
  { href: "/emissions",    icon: "🔥",  label: "Emissions",    badge: null    },
  { href: "/analytics",   icon: "📈",  label: "Analytics",    badge: null    },
  { href: "/environment", icon: "🌍",  label: "Environment",  badge: "LIVE"  },
  { href: "/ai-advisor",  icon: "🤖",  label: "AI Advisor",   badge: "NEW"   },
  { href: "/suppliers",   icon: "🏭",  label: "Suppliers",    badge: null    },
  { href: "/benchmarks",  icon: "🎯",  label: "Benchmarks",   badge: null    },
  { href: "/alerts",      icon: "🔔",  label: "Alerts",       badge: "3"     },
  { href: "/users",       icon: "👥",  label: "Users",        badge: null    },
  { href: "/settings",    icon: "⚙️",  label: "Settings",    badge: null    },
];

const BADGE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  NEW:  { bg: "rgba(22,163,74,0.25)",   color: "#4ade80",  border: "1px solid rgba(22,163,74,0.3)"  },
  LIVE: { bg: "rgba(16,185,129,0.20)",  color: "#34d399",  border: "1px solid rgba(16,185,129,0.35)" },
  "3":  { bg: "rgba(239,68,68,0.22)",   color: "#fca5a5",  border: "1px solid rgba(239,68,68,0.3)"  },
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Main navigation"
      style={{
        width: 232, flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh",
        background: "rgba(3,10,3,0.98)", borderRight: "1px solid rgba(22,163,74,0.10)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(22,163,74,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "linear-gradient(135deg, #16a34a, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 0 16px rgba(22,163,74,0.4)",
          }} aria-hidden="true">🌿</div>
          <div>
            <div style={{
              fontSize: "1rem", fontWeight: 800, lineHeight: 1.1,
              background: "linear-gradient(135deg, #4ade80, #10b981)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>EcoSentinel</div>
            <div style={{ fontSize: "0.65rem", color: "rgba(134,239,172,0.4)", letterSpacing: "0.05em" }}>CARBON PLATFORM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Dashboard navigation" style={{ flex: 1, padding: "0.875rem 0.75rem", overflowY: "auto" }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(134,239,172,0.25)", padding: "0 0.625rem", marginBottom: "0.5rem" }}>
          Navigation
        </div>
        {NAV.map(({ href, icon, label, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          const bs     = badge ? (BADGE_STYLE[badge] ?? BADGE_STYLE["3"]) : null;
          return (
            <Link
              key={href} href={href}
              aria-current={active ? "page" : undefined}
              aria-label={`${label}${badge ? ` — ${badge} alert` : ""}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5625rem 0.75rem", borderRadius: 10, marginBottom: "0.125rem",
                background: active ? "rgba(22,163,74,0.12)" : "transparent",
                border: active ? "1px solid rgba(22,163,74,0.2)" : "1px solid transparent",
                color: active ? "#4ade80" : "rgba(134,239,172,0.45)",
                fontSize: "0.8125rem", fontWeight: active ? 600 : 400,
                transition: "all 0.15s ease", cursor: "pointer",
              }}
              onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(22,163,74,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.8)"; } }}
              onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.45)"; } }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: "center", flexShrink: 0 }} aria-hidden="true">{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {bs && (
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: bs.bg, color: bs.color, border: bs.border }}>
                    {badge}
                  </span>
                )}
                {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} aria-hidden="true" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Net Zero progress */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(22,163,74,0.08)" }}>
        <div style={{
          padding: "0.875rem", borderRadius: 12,
          background: "linear-gradient(135deg, rgba(22,163,74,0.1), rgba(16,185,129,0.05))",
          border: "1px solid rgba(22,163,74,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4ade80" }}>🌱 Net Zero Goal</span>
            <span style={{ fontSize: "0.65rem", color: "rgba(134,239,172,0.5)" }}>2030</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={34}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Net Zero 2030 progress: 34% complete"
            style={{ height: 4, background: "rgba(22,163,74,0.15)", borderRadius: 999, overflow: "hidden" }}
          >
            <div style={{ height: "100%", width: "34%", background: "linear-gradient(90deg, #16a34a, #22c55e)", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: "0.65rem", color: "rgba(134,239,172,0.4)", marginTop: 4 }}>34% reduction achieved · 847 t CO₂e / yr</div>
        </div>
      </div>
    </aside>
  );
}
