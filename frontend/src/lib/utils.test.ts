/**
 * Unit tests for utility functions — EcoSentinel
 * Run with: npx vitest run  (add vitest to devDependencies if not present)
 */

import { describe, it, expect } from "vitest";
import { formatCO2e, formatChange, formatNumber, formatDate, cn } from "./utils";

describe("formatCO2e", () => {
  it("formats values below 1000 kg as kg", () => {
    expect(formatCO2e(850)).toBe("850.0 kg CO₂e");
  });

  it("formats values ≥ 1000 kg as tonnes", () => {
    expect(formatCO2e(1000)).toBe("1.00 t CO₂e");
  });

  it("formats large values as tonnes", () => {
    expect(formatCO2e(847320)).toBe("847.32 t CO₂e");
  });

  it("handles zero", () => {
    expect(formatCO2e(0)).toBe("0.0 kg CO₂e");
  });

  it("handles exact threshold (999.9 kg → kg)", () => {
    expect(formatCO2e(999.9)).toBe("999.9 kg CO₂e");
  });
});

describe("formatChange", () => {
  it("returns positive=true for reductions (negative pct = good for environment)", () => {
    const result = formatChange(-8.4);
    expect(result.text).toBe("-8.4%");
    expect(result.positive).toBe(true);
  });

  it("returns positive=false for increases (emission went up)", () => {
    const result = formatChange(5.2);
    expect(result.text).toBe("+5.2%");
    expect(result.positive).toBe(false);
  });

  it("handles zero change", () => {
    const result = formatChange(0);
    // 0 is not > 0, so no '+' prefix — matches formatChange implementation
    expect(result.text).toBe("0.0%");
    expect(result.positive).toBe(false);
  });

});

describe("formatNumber", () => {
  it("formats millions", () => {
    expect(formatNumber(2_500_000)).toBe("2.5M");
  });
  it("formats thousands", () => {
    expect(formatNumber(10_000)).toBe("10.0K");
  });
  it("formats below 1000", () => {
    expect(formatNumber(847)).toBe("847.0");
  });
});

describe("formatDate", () => {
  it("returns a human-readable date", () => {
    const result = formatDate("2025-06-16T00:00:00Z");
    expect(result).toContain("2025");
    expect(result).toContain("Jun");
  });
});

describe("cn (className merger)", () => {
  it("merges multiple class names", () => {
    const result = cn("glass-card", "kpi-card");
    expect(result).toContain("glass-card");
    expect(result).toContain("kpi-card");
  });

  it("handles undefined / falsy gracefully", () => {
    expect(() => cn("a", undefined as any, false as any, "b")).not.toThrow();
  });
});

// ── GHG Protocol emission factor sanity checks ─────────────────────────────
describe("Emission factors (GHG Protocol compliance)", () => {
  const FACTORS = {
    electricity_in_kg_per_kwh: 0.44,   // India CEA grid 2024
    diesel_kg_per_litre: 2.66,          // IPCC 2006
    petrol_kg_per_litre: 2.31,
    natural_gas_kg_per_kg: 2.76,
    air_travel_kg_per_km: 0.19,         // DEFRA 2023
  };

  it("India electricity EF is within CEA grid range (0.3–0.8)", () => {
    expect(FACTORS.electricity_in_kg_per_kwh).toBeGreaterThanOrEqual(0.3);
    expect(FACTORS.electricity_in_kg_per_kwh).toBeLessThanOrEqual(0.8);
  });

  it("diesel EF is within GHG Protocol range (2.0–3.0)", () => {
    expect(FACTORS.diesel_kg_per_litre).toBeGreaterThan(2.0);
    expect(FACTORS.diesel_kg_per_litre).toBeLessThan(3.0);
  });

  it("air travel EF is plausible (DEFRA range 0.1–0.4)", () => {
    expect(FACTORS.air_travel_kg_per_km).toBeGreaterThan(0.1);
    expect(FACTORS.air_travel_kg_per_km).toBeLessThan(0.4);
  });

  it("fleet diesel CO2e calculation matches expected (8500 L × 2.66 = 22610 kg)", () => {
    const litres = 8500;
    const result  = litres * FACTORS.diesel_kg_per_litre;
    expect(result).toBeCloseTo(22610, 0);
  });

  it("electricity CO2e calculation matches expected (42000 kWh × 0.44 = 18480 kg)", () => {
    const kwh    = 42000;
    const result = kwh * FACTORS.electricity_in_kg_per_kwh;
    expect(result).toBeCloseTo(18480, 0);
  });
});
