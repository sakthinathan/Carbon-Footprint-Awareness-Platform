"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { user, loading, login, error } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  // Animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p) => {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(34,197,94,${p.opacity})`;
        ctx!.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas!.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.dy *= -1;
      });
      // Draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(34,197,94,${0.06 * (1 - dist / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const stats = [
    { value: "2.5B+", label: "Tonnes CO₂ tracked" },
    { value: "10K+", label: "Organizations" },
    { value: "98%", label: "Accuracy rate" },
    { value: "190+", label: "Countries" },
  ];

  const features = [
    { icon: "📊", title: "Real-time Tracking", desc: "Scope 1, 2 & 3 emissions monitored live" },
    { icon: "🤖", title: "AI-Powered Insights", desc: "Gemini AI recommends reduction strategies" },
    { icon: "📋", title: "Regulatory Ready", desc: "CSRD, TCFD & GHG Protocol compliant" },
    { icon: "🌍", title: "Industry Benchmarks", desc: "Compare against sector averages" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", overflow: "hidden", background: "#030c03" }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Gradient blobs */}
      <div style={{
        position: "fixed", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)",
        zIndex: 0, animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
        zIndex: 0, animation: "float 10s ease-in-out infinite reverse",
      }} />

      {/* ── LEFT PANEL ────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "3rem 4rem", position: "relative", zIndex: 1,
        borderRight: "1px solid rgba(22,163,74,0.08)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "3rem" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #16a34a, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 0 24px rgba(22,163,74,0.4)",
          }}>🌿</div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(135deg, #4ade80, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              EcoSentinel
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.5)", marginTop: 2 }}>Carbon Intelligence Platform</div>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.25rem", color: "#f0fdf4" }}>
          Measure.<br />
          <span style={{ background: "linear-gradient(135deg, #4ade80, #10b981, #84cc16)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Understand.
          </span><br />
          Act.
        </h1>
        <p style={{ fontSize: "1.0625rem", color: "rgba(134,239,172,0.65)", lineHeight: 1.7, maxWidth: 420, marginBottom: "3rem" }}>
          Enterprise carbon footprint tracking powered by AI. Accelerate your organization&apos;s journey to net zero with real-time data and intelligent insights.
        </p>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", maxWidth: 420, marginBottom: "3rem" }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              padding: "1rem 1.25rem", borderRadius: 14,
              background: "rgba(22,163,74,0.06)",
              border: "1px solid rgba(22,163,74,0.14)",
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "#4ade80", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.5)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", maxWidth: 420 }}>
          {features.map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0, fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)",
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f0fdf4" }}>{f.title}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.5)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (Sign-in card) ────────────────────────── */}
      <div style={{
        width: 480, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem", position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "100%", maxWidth: 420,
          background: "rgba(10,22,10,0.85)",
          border: "1px solid rgba(22,163,74,0.2)",
          borderRadius: 24, padding: "2.5rem",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(22,163,74,0.1), inset 0 1px 0 rgba(22,163,74,0.1)",
        }}>
          {/* Card header line */}
          <div style={{ height: 3, borderRadius: 999, background: "linear-gradient(90deg, #16a34a, #10b981, #84cc16)", marginBottom: "2rem" }} />

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, margin: "0 auto 1rem",
              background: "linear-gradient(135deg, #16a34a, #10b981)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, boxShadow: "0 0 32px rgba(22,163,74,0.35)",
            }}>🌿</div>
            <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4", marginBottom: 6 }}>Welcome back</h2>
            <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.55)" }}>Sign in to your sustainability dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: "1.25rem", padding: "0.875rem 1rem", borderRadius: 12,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={login}
            disabled={loading}
            style={{
              width: "100%", padding: "0.9375rem 1.5rem",
              borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)",
              background: loading ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
              color: "#f0fdf4", fontSize: "0.9375rem", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <><div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing in...</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(22,163,74,0.12)" }} />
            <span style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.3)" }}>secured by Firebase</span>
            <div style={{ flex: 1, height: 1, background: "rgba(22,163,74,0.12)" }} />
          </div>

          {/* Trust badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { icon: "🔐", label: "Enterprise Security" },
              { icon: "🌿", label: "GHG Protocol" },
              { icon: "📋", label: "CSRD Compliant" },
              { icon: "🤖", label: "Gemini AI" },
            ].map((b) => (
              <div key={b.label} style={{
                padding: "0.625rem 0.75rem", borderRadius: 10, textAlign: "center",
                background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.1)",
                fontSize: "0.75rem", color: "rgba(134,239,172,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: "0.6875rem", color: "rgba(134,239,172,0.25)", marginTop: "1.5rem", lineHeight: 1.6 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
      `}</style>
    </div>
  );
}
