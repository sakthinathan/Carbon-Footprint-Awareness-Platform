// TypeScript types — Emissions domain
export enum EmissionScope {
  SCOPE_1 = "scope_1",
  SCOPE_2 = "scope_2",
  SCOPE_3 = "scope_3",
}

export enum EmissionCategory {
  STATIONARY_COMBUSTION = "stationary_combustion",
  MOBILE_COMBUSTION = "mobile_combustion",
  FUGITIVE_EMISSIONS = "fugitive_emissions",
  PROCESS_EMISSIONS = "process_emissions",
  PURCHASED_ELECTRICITY = "purchased_electricity",
  PURCHASED_HEAT = "purchased_heat",
  PURCHASED_STEAM = "purchased_steam",
  BUSINESS_TRAVEL = "business_travel",
  EMPLOYEE_COMMUTING = "employee_commuting",
  SUPPLY_CHAIN = "supply_chain",
  WASTE_DISPOSAL = "waste_disposal",
  PRODUCT_USE = "product_use",
}

export enum EmissionUnit {
  KG = "kg",
  TONNES = "tonnes",
  KWH = "kwh",
  MWH = "mwh",
  LITERS = "liters",
  KM = "km",
}

export interface EmissionResponse {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  scope: EmissionScope;
  category: EmissionCategory;
  amount: number;
  unit: EmissionUnit;
  co2_equivalent_kg: number;
  co2_equivalent_tonnes: number;
  emission_factor: number;
  source?: string;
  location?: string;
  date: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmissionCreateRequest {
  title: string;
  description?: string;
  scope: EmissionScope;
  category: EmissionCategory;
  amount: number;
  unit: EmissionUnit;
  emission_factor?: number;
  source?: string;
  location?: string;
  date: string;
}

export interface EmissionListResponse {
  items: EmissionResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  total_co2e_kg: number;
  total_co2e_tonnes: number;
}

export interface EmissionSummary {
  total_emissions_kg: number;
  total_emissions_tonnes: number;
  scope_1_kg: number;
  scope_2_kg: number;
  scope_3_kg: number;
  change_vs_last_month_pct: number;
  this_month_kg: number;
  last_month_kg: number;
  net_zero_progress_pct: number;
  top_category: string;
}

export interface MonthlyTrend {
  month: string;
  scope_1_kg: number;
  scope_2_kg: number;
  scope_3_kg: number;
  total_kg: number;
}

export interface ScopeBreakdown {
  scope: string;
  label: string;
  value_kg: number;
  value_tonnes: number;
  color: string;
}

// Scope display labels
export const SCOPE_LABELS: Record<EmissionScope, string> = {
  [EmissionScope.SCOPE_1]: "Scope 1 — Direct",
  [EmissionScope.SCOPE_2]: "Scope 2 — Energy",
  [EmissionScope.SCOPE_3]: "Scope 3 — Value Chain",
};

export const SCOPE_COLORS: Record<EmissionScope, string> = {
  [EmissionScope.SCOPE_1]: "#16A34A",
  [EmissionScope.SCOPE_2]: "#10B981",
  [EmissionScope.SCOPE_3]: "#84CC16",
};

export const CATEGORY_LABELS: Record<EmissionCategory, string> = {
  [EmissionCategory.STATIONARY_COMBUSTION]: "Stationary Combustion",
  [EmissionCategory.MOBILE_COMBUSTION]: "Mobile Combustion",
  [EmissionCategory.FUGITIVE_EMISSIONS]: "Fugitive Emissions",
  [EmissionCategory.PROCESS_EMISSIONS]: "Process Emissions",
  [EmissionCategory.PURCHASED_ELECTRICITY]: "Purchased Electricity",
  [EmissionCategory.PURCHASED_HEAT]: "Purchased Heat",
  [EmissionCategory.PURCHASED_STEAM]: "Purchased Steam",
  [EmissionCategory.BUSINESS_TRAVEL]: "Business Travel",
  [EmissionCategory.EMPLOYEE_COMMUTING]: "Employee Commuting",
  [EmissionCategory.SUPPLY_CHAIN]: "Supply Chain",
  [EmissionCategory.WASTE_DISPOSAL]: "Waste Disposal",
  [EmissionCategory.PRODUCT_USE]: "Product Use",
};
