"use client";
import { useState } from "react";
import { useCreateEmission } from "@/hooks/useEmissions";
import { EmissionScope, EmissionCategory, EmissionUnit, CATEGORY_LABELS } from "@/types/emission.types";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

const SCOPE_CATEGORIES: Record<EmissionScope, EmissionCategory[]> = {
  [EmissionScope.SCOPE_1]: [
    EmissionCategory.STATIONARY_COMBUSTION,
    EmissionCategory.MOBILE_COMBUSTION,
    EmissionCategory.FUGITIVE_EMISSIONS,
    EmissionCategory.PROCESS_EMISSIONS,
  ],
  [EmissionScope.SCOPE_2]: [
    EmissionCategory.PURCHASED_ELECTRICITY,
    EmissionCategory.PURCHASED_HEAT,
    EmissionCategory.PURCHASED_STEAM,
  ],
  [EmissionScope.SCOPE_3]: [
    EmissionCategory.BUSINESS_TRAVEL,
    EmissionCategory.EMPLOYEE_COMMUTING,
    EmissionCategory.SUPPLY_CHAIN,
    EmissionCategory.WASTE_DISPOSAL,
    EmissionCategory.PRODUCT_USE,
  ],
};

export default function LogEmissionPage() {
  const router = useRouter();
  const createEmission = useCreateEmission();

  const [form, setForm] = useState({
    title: "",
    description: "",
    scope: EmissionScope.SCOPE_1,
    category: EmissionCategory.STATIONARY_COMBUSTION,
    amount: "",
    unit: EmissionUnit.KG,
    source: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleScopeChange = (scope: EmissionScope) => {
    setForm((prev) => ({
      ...prev,
      scope,
      category: SCOPE_CATEGORIES[scope][0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEmission.mutateAsync({
      ...form,
      amount: parseFloat(form.amount),
      date: new Date(form.date).toISOString(),
    });
    router.push("/emissions");
  };

  const categories = SCOPE_CATEGORIES[form.scope];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3 animate-fade-in-up">
        <Link href="/emissions" className="btn-ghost py-2 px-3">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#f0fdf4" }}>Log New Emission</h1>
          <p className="text-sm" style={{ color: "rgba(134,239,172,0.5)" }}>CO₂e is automatically calculated</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        {/* Basic Info */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold" style={{ color: "#4ade80" }}>Basic Information</h3>

          <div>
            <label htmlFor="emission-title" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
              Title *
            </label>
            <input
              id="emission-title"
              className="eco-input"
              placeholder="e.g. Office electricity — June 2025"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="emission-description" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
              Description
            </label>
            <textarea
              id="emission-description"
              className="eco-input resize-none"
              rows={2}
              placeholder="Additional context..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>

        {/* GHG Scope */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold" style={{ color: "#4ade80" }}>GHG Scope Classification</h3>

          {/* Scope selector */}
          <div className="grid grid-cols-3 gap-2">
            {Object.values(EmissionScope).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleScopeChange(s)}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-center"
                style={{
                  background: form.scope === s ? "rgba(22,163,74,0.2)" : "rgba(22,163,74,0.05)",
                  border: `1px solid ${form.scope === s ? "rgba(22,163,74,0.5)" : "rgba(22,163,74,0.12)"}`,
                  color: form.scope === s ? "#4ade80" : "rgba(134,239,172,0.5)",
                }}
              >
                {s.replace("scope_", "Scope ")}
                <div className="text-xs font-normal opacity-70 mt-0.5">
                  {s === "scope_1" ? "Direct" : s === "scope_2" ? "Energy" : "Value Chain"}
                </div>
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="emission-category" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
              Category *
            </label>
            <select
              id="emission-category"
              className="eco-input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Measurement */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold" style={{ color: "#4ade80" }}>Measurement</h3>
            <div className="group relative">
              <Info className="w-3.5 h-3.5 cursor-help" style={{ color: "rgba(134,239,172,0.4)" }} />
              <div
                className="absolute left-5 top-0 w-56 glass-card p-3 text-xs hidden group-hover:block z-10"
                style={{ color: "rgba(134,239,172,0.7)" }}
              >
                CO₂e will be automatically calculated using IPCC emission factors
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="emission-amount" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
                Amount *
              </label>
              <input
                id="emission-amount"
                className="eco-input font-mono"
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="emission-unit" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
                Unit *
              </label>
              <select
                id="emission-unit"
                className="eco-input"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
              >
                {Object.values(EmissionUnit).map((u) => (
                  <option key={u} value={u}>{u.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="emission-source" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
                Source
              </label>
              <input
                id="emission-source"
                className="eco-input"
                placeholder="e.g. Electricity meter"
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="emission-location" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
                Location
              </label>
              <input
                id="emission-location"
                className="eco-input"
                placeholder="e.g. Mumbai HQ"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="emission-date" className="block text-xs font-medium mb-1.5" style={{ color: "rgba(134,239,172,0.7)" }}>
              Date *
            </label>
            <input
              id="emission-date"
              className="eco-input"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createEmission.isPending}
          className="btn-primary w-full justify-center py-3"
        >
          {createEmission.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculating CO₂e & Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Log Emission Record
            </>
          )}
        </button>
      </form>
    </div>
  );
}
