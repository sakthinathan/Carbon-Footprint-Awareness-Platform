// useEnvironment — real-time AQI, weather & grid carbon intensity
// APIs used:
//   • WAQI (World Air Quality Index) — https://waqi.info — free token from waqi.info/api
//   • Open-Meteo — https://api.open-meteo.com — completely free, no key
//   • ElectricityMaps — https://api.electricitymap.org — free observer key
"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const WAQI_TOKEN = process.env.NEXT_PUBLIC_WAQI_TOKEN || "demo";
const ELECTRICITY_MAPS_TOKEN = process.env.NEXT_PUBLIC_ELECTRICITY_MAPS_TOKEN || "";

// ── Types ─────────────────────────────────────────────────────────────────
export interface AQIData {
  aqi: number;
  city: string;
  dominantPollutant: string;
  pollutants: { pm25: number; pm10: number; o3: number; no2: number; so2: number; co: number };
  time: string;
  level: "Good" | "Moderate" | "Unhealthy for Sensitive" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  color: string;
  emoji: string;
}

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  description: string;
  humidity: number;
  feelsLike: number;
}

export interface GridCarbonData {
  carbonIntensity: number; // gCO2eq/kWh
  zone: string;
  fossilFuelPercentage: number;
  renewablePercentage: number;
  level: "very_low" | "low" | "medium" | "high" | "very_high";
}

// ── AQI Level ──────────────────────────────────────────────────────────────
function classifyAQI(aqi: number): Pick<AQIData, "level" | "color" | "emoji"> {
  if (aqi <= 50)  return { level: "Good",                    color: "#22c55e", emoji: "😊" };
  if (aqi <= 100) return { level: "Moderate",                color: "#f59e0b", emoji: "😐" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive", color: "#f97316", emoji: "😷" };
  if (aqi <= 200) return { level: "Unhealthy",               color: "#ef4444", emoji: "🤒" };
  if (aqi <= 300) return { level: "Very Unhealthy",          color: "#9333ea", emoji: "😰" };
  return              { level: "Hazardous",                  color: "#7f1d1d", emoji: "☠️" };
}

// ── Weather code → description ─────────────────────────────────────────────
function weatherDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 61: "Light rain",
    63: "Moderate rain", 65: "Heavy rain", 71: "Light snow", 80: "Rain showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail",
  };
  return map[code] ?? "Unknown";
}

// ── Grid carbon level ──────────────────────────────────────────────────────
function classifyGrid(intensity: number): GridCarbonData["level"] {
  if (intensity < 100) return "very_low";
  if (intensity < 200) return "low";
  if (intensity < 350) return "medium";
  if (intensity < 500) return "high";
  return "very_high";
}

// ── Hook: Geolocation ──────────────────────────────────────────────────────
export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  const request = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setRequested(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => { setError(err.message); setCoords({ lat: 13.0827, lon: 80.2707 }); }, // Default: Chennai
      { timeout: 8000 }
    );
  };

  return { coords, error, requested, request };
}

// ── Hook: AQI via WAQI API ─────────────────────────────────────────────────
export function useAQI(lat?: number, lon?: number) {
  return useQuery<AQIData>({
    queryKey: ["aqi", lat, lon],
    enabled: lat !== undefined && lon !== undefined,
    staleTime: 15 * 60 * 1000, // 15 min — AQI doesn't update faster
    queryFn: async () => {
      try {
        const url = lat && lon
          ? `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_TOKEN}`
          : `https://api.waqi.info/feed/chennai/?token=${WAQI_TOKEN}`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error("WAQI API error");
        const json = await res.json();
        if (json.status !== "ok") throw new Error("WAQI data unavailable");
        const d   = json.data;
        const aqi = typeof d.aqi === "number" ? d.aqi : 85;
        return {
          aqi,
          city: d.city?.name ?? "Chennai",
          dominantPollutant: d.dominentpol ?? "pm25",
          pollutants: {
            pm25: d.iaqi?.pm25?.v ?? 0,
            pm10: d.iaqi?.pm10?.v ?? 0,
            o3:   d.iaqi?.o3?.v ?? 0,
            no2:  d.iaqi?.no2?.v ?? 0,
            so2:  d.iaqi?.so2?.v ?? 0,
            co:   d.iaqi?.co?.v ?? 0,
          },
          time: d.time?.s ?? new Date().toISOString(),
          ...classifyAQI(aqi),
        };
      } catch {
        // Fallback mock AQI for Chennai
        const aqi = 87;
        return { aqi, city: "Chennai, TN", dominantPollutant: "pm25", pollutants: { pm25: 47, pm10: 62, o3: 28, no2: 19, so2: 8, co: 4 }, time: new Date().toISOString(), ...classifyAQI(aqi) };
      }
    },
  });
}

// ── Hook: Weather via Open-Meteo (FREE — no API key) ─────────────────────
export function useWeather(lat = 13.0827, lon = 80.2707) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lon],
    staleTime: 30 * 60 * 1000,
    queryFn: async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature&timezone=Asia%2FKolkata&forecast_days=1`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error("Open-Meteo error");
        const json = await res.json();
        const cw   = json.current_weather;
        return {
          temperature:   Math.round(cw.temperature),
          windspeed:     Math.round(cw.windspeed),
          weathercode:   cw.weathercode,
          description:   weatherDescription(cw.weathercode),
          humidity:      json.hourly?.relativehumidity_2m?.[new Date().getHours()] ?? 65,
          feelsLike:     Math.round(json.hourly?.apparent_temperature?.[new Date().getHours()] ?? cw.temperature),
        };
      } catch {
        return { temperature: 34, windspeed: 12, weathercode: 2, description: "Partly cloudy", humidity: 68, feelsLike: 38 };
      }
    },
  });
}

// ── Hook: Grid Carbon Intensity via ElectricityMaps ───────────────────────
export function useGridCarbon(zone = "IN-SO") {
  return useQuery<GridCarbonData>({
    queryKey: ["grid-carbon", zone],
    staleTime: 15 * 60 * 1000,
    queryFn: async () => {
      try {
        if (!ELECTRICITY_MAPS_TOKEN) throw new Error("No token");
        const res = await fetch(`https://api.electricitymap.org/v3/carbon-intensity/latest?zone=${zone}`, {
          headers: { "auth-token": ELECTRICITY_MAPS_TOKEN },
        });
        if (!res.ok) throw new Error("ElectricityMaps error");
        const json = await res.json();
        const ci   = json.carbonIntensity ?? 620;
        return {
          carbonIntensity: ci,
          zone,
          fossilFuelPercentage: 68,
          renewablePercentage: 32,
          level: classifyGrid(ci),
        };
      } catch {
        // Fallback: India Southern grid typical values
        return { carbonIntensity: 620, zone: "IN-SO (India South)", fossilFuelPercentage: 68, renewablePercentage: 32, level: classifyGrid(620) };
      }
    },
  });
}
