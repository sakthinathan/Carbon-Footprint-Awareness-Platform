"use client";
import { useState } from "react";
import { useAQI, useWeather, useGridCarbon, useGeolocation } from "@/hooks/useEnvironment";

// ── AQI Gauge ──────────────────────────────────────────────────────────────
function AQIGauge({ aqi, color }: { aqi: number; color: string }) {
  const pct = Math.min(100, (aqi / 300) * 100);
  const r   = 56;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(22,163,74,0.1)" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90 70 70)" style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x="70" y="65" textAnchor="middle" fill="#f0fdf4" fontSize="28" fontWeight="800" fontFamily="JetBrains Mono,monospace">{aqi}</text>
      <text x="70" y="85" textAnchor="middle" fill="rgba(134,239,172,0.5)" fontSize="10">AQI</text>
    </svg>
  );
}

// ── Pollutant row ──────────────────────────────────────────────────────────
function PollutantBar({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct < 40 ? "#22c55e" : pct < 70 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.55)", width: 36, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: "rgba(22,163,74,0.1)", borderRadius: 999 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color, minWidth: 50, textAlign: "right" }}>{value} {unit}</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function EnvironmentPage() {
  const geo       = useGeolocation();
  const lat       = geo.coords?.lat ?? 13.0827;
  const lon       = geo.coords?.lon ?? 80.2707;

  const { data: aqi,    isLoading: aqiLoading    } = useAQI(lat, lon);
  const { data: weather, isLoading: wxLoading    } = useWeather(lat, lon);
  const { data: grid,   isLoading: gridLoading   } = useGridCarbon("IN-SO");

  const gridColors: Record<string, string> = {
    very_low: "#22c55e", low: "#4ade80", medium: "#f59e0b", high: "#ef4444", very_high: "#9333ea"
  };
  const gridColor = grid ? gridColors[grid.level] : "#f59e0b";

  const weatherIcons: Record<number, string> = { 0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️", 51: "🌦️", 61: "🌧️", 63: "🌧️", 65: "⛈️", 80: "🌦️", 95: "⛈️" };
  const wxIcon = weather ? (weatherIcons[weather.weathercode] ?? "🌡️") : "🌡️";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#f0fdf4" }}>
            🌍 Environmental Intelligence
          </h1>
          <p style={{ fontSize: "0.875rem", color: "rgba(134,239,172,0.45)", marginTop: 3 }}>
            Live air quality, weather context & grid carbon intensity
          </p>
        </div>
        {!geo.requested ? (
          <button
            onClick={geo.request}
            aria-label="Use my current location for accurate AQI data"
            style={{ padding: "0.5rem 1rem", borderRadius: 10, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#f0fdf4", fontSize: "0.8125rem", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            📍 Use My Location
          </button>
        ) : (
          <span style={{ fontSize: "0.75rem", padding: "5px 12px", borderRadius: 999, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", color: "#4ade80" }}>
            📍 {geo.coords ? `${geo.coords.lat.toFixed(2)}, ${geo.coords.lon.toFixed(2)}` : "Locating…"}
          </span>
        )}
      </div>

      {/* Top 3 KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {/* AQI KPI */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: `1px solid ${aqi ? aqi.color + "33" : "rgba(22,163,74,0.12)"}`, borderRadius: 18, padding: "1.375rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${aqi?.color ?? "#16a34a"},transparent)` }} />
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(134,239,172,0.45)", marginBottom: 6 }}>Air Quality Index</div>
          {aqiLoading ? (
            <div style={{ height: 80, background: "rgba(22,163,74,0.05)", borderRadius: 10, animation: "pulse 2s infinite" }} />
          ) : (
            <>
              <div style={{ fontSize: "3rem", fontWeight: 800, color: aqi?.color ?? "#f0fdf4", fontFamily: "JetBrains Mono,monospace", lineHeight: 1 }}>{aqi?.aqi ?? "—"}</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: aqi?.color ?? "#f0fdf4", marginTop: 4 }}>{aqi?.emoji} {aqi?.level}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginTop: 4 }}>Dominant: {aqi?.dominantPollutant?.toUpperCase() ?? "PM2.5"} · {aqi?.city}</div>
            </>
          )}
        </div>

        {/* Weather KPI */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#60a5fa,transparent)" }} />
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(134,239,172,0.45)", marginBottom: 6 }}>Weather Conditions</div>
          {wxLoading ? (
            <div style={{ height: 80, background: "rgba(22,163,74,0.05)", borderRadius: 10, animation: "pulse 2s infinite" }} />
          ) : (
            <>
              <div style={{ fontSize: "3rem", fontWeight: 800, color: "#f0fdf4", fontFamily: "JetBrains Mono,monospace", lineHeight: 1 }}>{weather?.temperature ?? "—"}°C</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#93c5fd", marginTop: 4 }}>{wxIcon} {weather?.description}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginTop: 4 }}>Feels like {weather?.feelsLike}°C · Humidity {weather?.humidity}% · Wind {weather?.windspeed} km/h</div>
            </>
          )}
        </div>

        {/* Grid Carbon KPI */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: `1px solid ${gridColor}33`, borderRadius: 18, padding: "1.375rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${gridColor},transparent)` }} />
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(134,239,172,0.45)", marginBottom: 6 }}>Grid Carbon Intensity</div>
          {gridLoading ? (
            <div style={{ height: 80, background: "rgba(22,163,74,0.05)", borderRadius: 10, animation: "pulse 2s infinite" }} />
          ) : (
            <>
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: gridColor, fontFamily: "JetBrains Mono,monospace", lineHeight: 1 }}>{grid?.carbonIntensity ?? "—"}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.5)", marginTop: 2 }}>gCO₂eq / kWh</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: gridColor, marginTop: 4 }}>
                ⚡ {grid?.zone ?? "IN-SO"} — {grid?.level?.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())} Carbon
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.4)", marginTop: 4 }}>
                🌿 {grid?.renewablePercentage}% renewable · 🔥 {grid?.fossilFuelPercentage}% fossil
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* AQI Detail Card */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
          <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1.125rem" }}>Pollutant Breakdown</div>
          {aqi ? (
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <div style={{ flexShrink: 0 }} aria-label={`AQI ${aqi.aqi} — ${aqi.level}`}>
                <AQIGauge aqi={aqi.aqi} color={aqi.color} />
                <div style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: aqi.color, marginTop: 4 }}>{aqi.level}</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <PollutantBar label="PM2.5" value={aqi.pollutants.pm25}  max={150} unit="μg/m³" />
                <PollutantBar label="PM10"  value={aqi.pollutants.pm10}  max={250} unit="μg/m³" />
                <PollutantBar label="O₃"    value={aqi.pollutants.o3}    max={200} unit="μg/m³" />
                <PollutantBar label="NO₂"   value={aqi.pollutants.no2}   max={200} unit="μg/m³" />
                <PollutantBar label="SO₂"   value={aqi.pollutants.so2}   max={350} unit="μg/m³" />
                <PollutantBar label="CO"    value={aqi.pollutants.co}    max={30}  unit="mg/m³" />
              </div>
            </div>
          ) : (
            <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(134,239,172,0.3)" }}>Loading AQI data…</div>
          )}
          <p style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.25)", marginTop: "1rem" }}>
            Source: World Air Quality Index (WAQI) · Updated every 15 min
          </p>
        </div>

        {/* Emission Advice based on conditions */}
        <div style={{ background: "rgba(8,18,8,0.8)", border: "1px solid rgba(22,163,74,0.12)", borderRadius: 18, padding: "1.375rem" }}>
          <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "1.125rem" }}>🤖 Environmental Advisories</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                show: aqi && aqi.aqi > 100,
                icon: "😷", color: "#f59e0b",
                title: "High AQI Alert",
                msg: `Current AQI ${aqi?.aqi} indicates ${aqi?.level}. Reduce outdoor activities and consider remote work to avoid unnecessary transport emissions.`,
              },
              {
                show: grid && grid.carbonIntensity > 400,
                icon: "⚡", color: "#ef4444",
                title: "High Grid Carbon — Delay EV Charging",
                msg: `Grid carbon intensity is ${grid?.carbonIntensity} gCO₂/kWh. Schedule EV charging and heavy equipment use for off-peak hours.`,
              },
              {
                show: grid && grid.carbonIntensity < 200,
                icon: "🌿", color: "#22c55e",
                title: "Low Carbon Grid — Good Time to Charge",
                msg: "Grid is running on cleaner energy. Great time to charge EVs, run high-energy processes, or sync energy-intensive server tasks.",
              },
              {
                show: weather && weather.temperature > 35,
                icon: "🌡️", color: "#f97316",
                title: "Extreme Heat Advisory",
                msg: `Temperature ${weather?.temperature}°C is causing increased cooling load. This raises Scope 2 emissions. Check HVAC efficiency.`,
              },
              {
                show: aqi && aqi.aqi <= 50,
                icon: "🌱", color: "#22c55e",
                title: "Excellent Air Quality",
                msg: "Air quality is good today. A great day to encourage cycling and walking for short trips — reduces Scope 3 commuting emissions.",
              },
            ]
              .filter((a) => a.show)
              .slice(0, 4)
              .map((advice) => (
                <div key={advice.title} role="note" style={{ display: "flex", gap: 10, padding: "0.875rem", borderRadius: 12, background: `${advice.color}0a`, border: `1px solid ${advice.color}25` }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{advice.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: advice.color, marginBottom: 3 }}>{advice.title}</div>
                    <p style={{ fontSize: "0.75rem", color: "rgba(134,239,172,0.55)", lineHeight: 1.5 }}>{advice.msg}</p>
                  </div>
                </div>
              ))}
            {(!aqi || !grid) && (
              <div style={{ textAlign: "center", padding: "2rem", color: "rgba(134,239,172,0.3)", fontSize: "0.8125rem" }}>
                Loading environmental data…
              </div>
            )}
          </div>
          <p style={{ fontSize: "0.7rem", color: "rgba(134,239,172,0.25)", marginTop: "1rem" }}>
            Sources: WAQI · Open-Meteo · ElectricityMaps · Data refreshed every 15 min
          </p>
        </div>
      </div>
    </div>
  );
}
