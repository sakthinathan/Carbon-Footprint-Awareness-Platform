// Mock data service — realistic demo data for all pages
// Used when the backend API is unavailable

import type { EmissionSummary, EmissionListResponse, MonthlyTrend } from "@/types/emission.types";
import { EmissionScope, EmissionCategory, EmissionUnit } from "@/types/emission.types";

// ── Summary ────────────────────────────────────────────────────────────────
export const MOCK_SUMMARY: EmissionSummary = {
  total_emissions_kg: 847_320,
  total_emissions_tonnes: 847.32,
  scope_1_kg: 214_500,
  scope_2_kg: 312_800,
  scope_3_kg: 320_020,
  change_vs_last_month_pct: -8.4,
  this_month_kg: 68_240,
  last_month_kg: 74_460,
  net_zero_progress_pct: 34.2,
  top_category: "Purchased Electricity",
};

// ── Monthly Trends (12 months) ─────────────────────────────────────────────
export const MOCK_TRENDS: MonthlyTrend[] = [
  { month: "Jul'24", scope_1_kg: 19800, scope_2_kg: 28900, scope_3_kg: 31200, total_kg: 79900 },
  { month: "Aug'24", scope_1_kg: 21200, scope_2_kg: 30100, scope_3_kg: 30800, total_kg: 82100 },
  { month: "Sep'24", scope_1_kg: 20100, scope_2_kg: 29400, scope_3_kg: 29900, total_kg: 79400 },
  { month: "Oct'24", scope_1_kg: 18700, scope_2_kg: 28200, scope_3_kg: 28400, total_kg: 75300 },
  { month: "Nov'24", scope_1_kg: 17900, scope_2_kg: 27600, scope_3_kg: 27100, total_kg: 72600 },
  { month: "Dec'24", scope_1_kg: 18400, scope_2_kg: 28800, scope_3_kg: 26800, total_kg: 74000 },
  { month: "Jan'25", scope_1_kg: 19200, scope_2_kg: 27400, scope_3_kg: 27600, total_kg: 74200 },
  { month: "Feb'25", scope_1_kg: 17600, scope_2_kg: 26900, scope_3_kg: 26200, total_kg: 70700 },
  { month: "Mar'25", scope_1_kg: 16800, scope_2_kg: 25800, scope_3_kg: 25400, total_kg: 68000 },
  { month: "Apr'25", scope_1_kg: 16200, scope_2_kg: 25100, scope_3_kg: 24800, total_kg: 66100 },
  { month: "May'25", scope_1_kg: 15700, scope_2_kg: 24600, scope_3_kg: 24200, total_kg: 64500 },
  { month: "Jun'25", scope_1_kg: 14600, scope_2_kg: 23900, scope_3_kg: 29740, total_kg: 68240 },
];

// ── Scope Breakdown ────────────────────────────────────────────────────────
export const MOCK_SCOPE_BREAKDOWN = [
  { scope: "scope_1", label: "Scope 1", value_kg: 214500, value_tonnes: 214.5, color: "#16a34a" },
  { scope: "scope_2", label: "Scope 2", value_kg: 312800, value_tonnes: 312.8, color: "#10b981" },
  { scope: "scope_3", label: "Scope 3", value_kg: 320020, value_tonnes: 320.0, color: "#84cc16" },
];

// ── Category Breakdown ─────────────────────────────────────────────────────
export const MOCK_CATEGORY_BREAKDOWN = [
  { category: "purchased_electricity", label: "Purchased Electricity", total_kg: 312800, pct: 36.9 },
  { category: "supply_chain",          label: "Supply Chain",          total_kg: 198400, pct: 23.4 },
  { category: "business_travel",       label: "Business Travel",       total_kg: 87600,  pct: 10.3 },
  { category: "mobile_combustion",     label: "Mobile Combustion",     total_kg: 72400,  pct: 8.5  },
  { category: "stationary_combustion", label: "Stationary Combustion", total_kg: 68200,  pct: 8.1  },
  { category: "employee_commuting",    label: "Employee Commuting",    total_kg: 56800,  pct: 6.7  },
  { category: "waste_disposal",        label: "Waste Disposal",        total_kg: 34100,  pct: 4.0  },
  { category: "fugitive_emissions",    label: "Fugitive Emissions",    total_kg: 17020,  pct: 2.0  },
];

// ── Benchmarks ─────────────────────────────────────────────────────────────
export const MOCK_BENCHMARKS = {
  org_total_tonnes: 847.32,
  org_per_employee_tonnes: 8.47,
  benchmark_per_employee_tonnes: 12.3,
  vs_benchmark_pct: -31.1,
  performance: "above_average",
  industry: "technology",
  employee_count: 100,
};

// ── Emissions List ─────────────────────────────────────────────────────────
export const MOCK_EMISSIONS_LIST: EmissionListResponse = {
  total: 48,
  page: 1,
  page_size: 15,
  total_pages: 4,
  total_co2e_kg: 847320,
  total_co2e_tonnes: 847.32,
  items: [
    {
      id: "em-001", user_id: "usr-001", title: "Office Electricity — Jun 2025",
      description: "Monthly electricity consumption at Chennai HQ",
      scope: EmissionScope.SCOPE_2, category: EmissionCategory.PURCHASED_ELECTRICITY,
      amount: 42000, unit: EmissionUnit.KWH, co2_equivalent_kg: 18480, co2_equivalent_tonnes: 18.48,
      emission_factor: 0.44, source: "TNEB Smart Meter", location: "Chennai, TN",
      date: "2025-06-01T00:00:00Z", is_verified: true,
      created_at: "2025-06-02T08:30:00Z", updated_at: "2025-06-02T08:30:00Z",
    },
    {
      id: "em-002", user_id: "usr-001", title: "Fleet Diesel — May 2025",
      description: "Delivery fleet fuel consumption",
      scope: EmissionScope.SCOPE_1, category: EmissionCategory.MOBILE_COMBUSTION,
      amount: 8500, unit: EmissionUnit.LITERS, co2_equivalent_kg: 22610, co2_equivalent_tonnes: 22.61,
      emission_factor: 2.66, source: "Fuel Card System", location: "Bangalore, KA",
      date: "2025-05-31T00:00:00Z", is_verified: true,
      created_at: "2025-06-01T09:00:00Z", updated_at: "2025-06-01T09:00:00Z",
    },
    {
      id: "em-003", user_id: "usr-001", title: "Business Travel — Q2 2025",
      description: "Flights for client meetings and conferences",
      scope: EmissionScope.SCOPE_3, category: EmissionCategory.BUSINESS_TRAVEL,
      amount: 48200, unit: EmissionUnit.KM, co2_equivalent_kg: 9158, co2_equivalent_tonnes: 9.16,
      emission_factor: 0.19, source: "Travel Management System", location: "Multiple",
      date: "2025-06-15T00:00:00Z", is_verified: false,
      created_at: "2025-06-16T07:00:00Z", updated_at: "2025-06-16T07:00:00Z",
    },
    {
      id: "em-004", user_id: "usr-001", title: "Natural Gas Heating — May 2025",
      description: "Office HVAC system gas consumption",
      scope: EmissionScope.SCOPE_1, category: EmissionCategory.STATIONARY_COMBUSTION,
      amount: 3200, unit: EmissionUnit.KG, co2_equivalent_kg: 8832, co2_equivalent_tonnes: 8.83,
      emission_factor: 2.76, source: "Gas Meter Reading", location: "Mumbai, MH",
      date: "2025-05-31T00:00:00Z", is_verified: true,
      created_at: "2025-06-01T10:00:00Z", updated_at: "2025-06-01T10:00:00Z",
    },
    {
      id: "em-005", user_id: "usr-001", title: "Supply Chain — Tier 1 Suppliers",
      description: "Upstream emissions from primary material suppliers",
      scope: EmissionScope.SCOPE_3, category: EmissionCategory.SUPPLY_CHAIN,
      amount: 198400, unit: EmissionUnit.KG, co2_equivalent_kg: 198400, co2_equivalent_tonnes: 198.4,
      emission_factor: 1.0, source: "Supplier ESG Reports", location: "Pan India",
      date: "2025-06-01T00:00:00Z", is_verified: false,
      created_at: "2025-06-10T12:00:00Z", updated_at: "2025-06-10T12:00:00Z",
    },
    {
      id: "em-006", user_id: "usr-001", title: "Server Room Electricity — Jun 2025",
      description: "Data centre and server room power consumption",
      scope: EmissionScope.SCOPE_2, category: EmissionCategory.PURCHASED_ELECTRICITY,
      amount: 28000, unit: EmissionUnit.KWH, co2_equivalent_kg: 12320, co2_equivalent_tonnes: 12.32,
      emission_factor: 0.44, source: "Smart PDU Monitoring", location: "Hyderabad, TS",
      date: "2025-06-14T00:00:00Z", is_verified: true,
      created_at: "2025-06-15T09:00:00Z", updated_at: "2025-06-15T09:00:00Z",
    },
    {
      id: "em-007", user_id: "usr-001", title: "Employee Commute — Jun 2025",
      description: "Estimated employee commuting emissions",
      scope: EmissionScope.SCOPE_3, category: EmissionCategory.EMPLOYEE_COMMUTING,
      amount: 125000, unit: EmissionUnit.KM, co2_equivalent_kg: 18750, co2_equivalent_tonnes: 18.75,
      emission_factor: 0.15, source: "Employee Survey", location: "Chennai, TN",
      date: "2025-06-01T00:00:00Z", is_verified: false,
      created_at: "2025-06-05T11:00:00Z", updated_at: "2025-06-05T11:00:00Z",
    },
    {
      id: "em-008", user_id: "usr-001", title: "Refrigerant Leakage — Q1 2025",
      description: "AC system refrigerant (R-410A) leakage",
      scope: EmissionScope.SCOPE_1, category: EmissionCategory.FUGITIVE_EMISSIONS,
      amount: 8, unit: EmissionUnit.KG, co2_equivalent_kg: 17068, co2_equivalent_tonnes: 17.07,
      emission_factor: 2088, source: "HVAC Maintenance Log", location: "Pune, MH",
      date: "2025-03-31T00:00:00Z", is_verified: true,
      created_at: "2025-04-02T10:00:00Z", updated_at: "2025-04-02T10:00:00Z",
    },
    {
      id: "em-009", user_id: "usr-001", title: "Waste Disposal — May 2025",
      description: "Office waste sent to landfill",
      scope: EmissionScope.SCOPE_3, category: EmissionCategory.WASTE_DISPOSAL,
      amount: 2400, unit: EmissionUnit.KG, co2_equivalent_kg: 3360, co2_equivalent_tonnes: 3.36,
      emission_factor: 1.4, source: "Waste Management Vendor", location: "Chennai, TN",
      date: "2025-05-31T00:00:00Z", is_verified: true,
      created_at: "2025-06-02T09:00:00Z", updated_at: "2025-06-02T09:00:00Z",
    },
    {
      id: "em-010", user_id: "usr-001", title: "Purchased Heat — May 2025",
      description: "District heating from utility",
      scope: EmissionScope.SCOPE_2, category: EmissionCategory.PURCHASED_HEAT,
      amount: 15000, unit: EmissionUnit.MWH, co2_equivalent_kg: 3150, co2_equivalent_tonnes: 3.15,
      emission_factor: 0.21, source: "Utility Bill", location: "Delhi, DL",
      date: "2025-05-31T00:00:00Z", is_verified: true,
      created_at: "2025-06-01T08:00:00Z", updated_at: "2025-06-01T08:00:00Z",
    },
  ],
};

// ── Suppliers ──────────────────────────────────────────────────────────────
export const MOCK_SUPPLIERS = [
  { id: "sup-001", name: "TechComponents Pvt Ltd", category: "Electronics", tier: 1, emissions_kg: 78400, score: 82, status: "verified", country: "India", last_report: "2025-05-15" },
  { id: "sup-002", name: "GreenLogistics Co",      category: "Logistics",   tier: 1, emissions_kg: 45200, score: 91, status: "verified", country: "India", last_report: "2025-06-01" },
  { id: "sup-003", name: "PackagingPlus Ltd",       category: "Packaging",   tier: 2, emissions_kg: 32100, score: 67, status: "pending",  country: "India", last_report: "2025-03-20" },
  { id: "sup-004", name: "RawMaterials Corp",       category: "Materials",   tier: 1, emissions_kg: 89600, score: 58, status: "at_risk",  country: "China", last_report: "2025-04-10" },
  { id: "sup-005", name: "CloudServe Inc",          category: "Technology",  tier: 2, emissions_kg: 12800, score: 95, status: "verified", country: "USA",   last_report: "2025-06-10" },
  { id: "sup-006", name: "FacilityMgmt Solutions",  category: "Facilities",  tier: 2, emissions_kg: 18900, score: 74, status: "verified", country: "India", last_report: "2025-05-28" },
];

// ── Alerts ─────────────────────────────────────────────────────────────────
export const MOCK_ALERTS = [
  { id: "alt-001", type: "threshold",  severity: "high",   title: "Scope 2 Threshold Exceeded",       message: "Monthly electricity emissions exceeded 30,000 kg CO₂e limit by 18%",         created_at: "2025-06-15T09:00:00Z", read: false },
  { id: "alt-002", type: "anomaly",   severity: "medium", title: "Unusual Spike — Business Travel",   message: "Business travel emissions 43% higher than last month",                       created_at: "2025-06-14T14:30:00Z", read: false },
  { id: "alt-003", type: "report",    severity: "low",    title: "Q2 Report Ready",                   message: "Your Q2 2025 GHG emissions report is ready for download",                   created_at: "2025-06-13T08:00:00Z", read: false },
  { id: "alt-004", type: "supplier",  severity: "high",   title: "Supplier ESG Risk — RawMaterials",  message: "RawMaterials Corp has not submitted ESG data for 60+ days",                  created_at: "2025-06-10T10:00:00Z", read: true  },
  { id: "alt-005", type: "milestone", severity: "low",    title: "Net Zero Milestone: 30% Reduction", message: "Congratulations! Your org has achieved a 30% emissions reduction vs baseline", created_at: "2025-06-08T16:00:00Z", read: true  },
];
