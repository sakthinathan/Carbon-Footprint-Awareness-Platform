// Utility functions
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format CO₂e value with smart units (kg vs tonnes) */
export function formatCO2e(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t CO₂e`;
  }
  return `${kg.toFixed(1)} kg CO₂e`;
}

/** Format percentage with + or - sign and color */
export function formatChange(pct: number): { text: string; positive: boolean } {
  const positive = pct < 0; // Negative = reduction = good!
  return {
    text: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`,
    positive,
  };
}

/** Format a date string to readable format */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format large numbers with K/M suffix */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(1);
}

/** Scope color lookup */
export const SCOPE_COLORS = {
  scope_1: "#16A34A",
  scope_2: "#10B981",
  scope_3: "#84CC16",
};
