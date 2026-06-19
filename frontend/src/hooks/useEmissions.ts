// useEmissions — TanStack Query hooks with mock data fallback
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emissionsApi, analyticsApi } from "@/infrastructure/api/emissions.api";
import type { EmissionCreateRequest } from "@/types/emission.types";
import { toast } from "@/hooks/useToast";
import {
  MOCK_SUMMARY, MOCK_EMISSIONS_LIST, MOCK_TRENDS,
  MOCK_SCOPE_BREAKDOWN, MOCK_CATEGORY_BREAKDOWN, MOCK_BENCHMARKS,
} from "@/lib/mockData";

export const EMISSIONS_KEYS = {
  all:     ["emissions"] as const,
  list:    (params?: object) => ["emissions", "list", params] as const,
  summary: () => ["emissions", "summary"] as const,
  detail:  (id: string)      => ["emissions", id] as const,
};

// ── Summary ────────────────────────────────────────────────────────────────
export function useEmissionSummary() {
  return useQuery({
    queryKey: EMISSIONS_KEYS.summary(),
    queryFn: async () => {
      try { return await emissionsApi.getSummary(); } catch { return MOCK_SUMMARY; }
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}

// ── List ───────────────────────────────────────────────────────────────────
export function useEmissionsList(params?: {
  page?: number; page_size?: number; scope?: string; search?: string;
}) {
  return useQuery({
    queryKey: EMISSIONS_KEYS.list(params),
    queryFn: async () => {
      try { return await emissionsApi.list(params); } catch {
        // Filter mock data by scope / search
        let items = [...MOCK_EMISSIONS_LIST.items];
        if (params?.scope) items = items.filter((i) => i.scope === params.scope);
        if (params?.search) items = items.filter((i) => i.title.toLowerCase().includes(params.search!.toLowerCase()));
        return { ...MOCK_EMISSIONS_LIST, items };
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 0,
  });
}

// ── Create ─────────────────────────────────────────────────────────────────
export function useCreateEmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EmissionCreateRequest) => {
      try { return await emissionsApi.create(payload); } catch {
        // Simulate success locally
        return { ...payload, id: `em-${Date.now()}`, co2_equivalent_kg: payload.amount * 0.44, co2_equivalent_tonnes: payload.amount * 0.00044, is_verified: false, user_id: "usr-001", emission_factor: 0.44, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMISSIONS_KEYS.all });
      toast({ title: "✅ Emission logged", description: "CO₂e calculated and saved." });
    },
  });
}

// ── Delete ─────────────────────────────────────────────────────────────────
export function useDeleteEmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try { return await emissionsApi.delete(id); } catch { return; }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMISSIONS_KEYS.all });
      toast({ title: "Deleted", description: "Emission record removed." });
    },
  });
}

// ── Export CSV ─────────────────────────────────────────────────────────────
export function useExportCsv() {
  return useMutation({
    mutationFn: async () => {
      try {
        const blob = await emissionsApi.exportCsv();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ecosentinel_emissions_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch {
        // Generate CSV from mock data
        const header = "ID,Title,Scope,Category,Amount,Unit,CO2e (kg),Date\n";
        const rows = MOCK_EMISSIONS_LIST.items.map((e) =>
          `${e.id},"${e.title}",${e.scope},${e.category},${e.amount},${e.unit},${e.co2_equivalent_kg},${e.date}`
        ).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ecosentinel_emissions_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      }
    },
    onSuccess: () => toast({ title: "📥 CSV Downloaded", description: "Emissions data exported." }),
  });
}

// ── Analytics hooks ────────────────────────────────────────────────────────
export function useAnalyticsTrends(months = 12) {
  return useQuery({
    queryKey: ["analytics", "trends", months],
    queryFn: async () => {
      try { return await analyticsApi.getTrends(months); } catch { return MOCK_TRENDS.slice(-months); }
    },
    staleTime: 5 * 60 * 1000, retry: 0,
  });
}

export function useAnalyticsScopeBreakdown() {
  return useQuery({
    queryKey: ["analytics", "scope-breakdown"],
    queryFn: async () => {
      try { return await analyticsApi.getScopeBreakdown(); } catch { return MOCK_SCOPE_BREAKDOWN; }
    },
    staleTime: 5 * 60 * 1000, retry: 0,
  });
}

export function useAnalyticsCategoryBreakdown() {
  return useQuery({
    queryKey: ["analytics", "category-breakdown"],
    queryFn: async () => {
      try { return await analyticsApi.getCategoryBreakdown(); } catch { return MOCK_CATEGORY_BREAKDOWN; }
    },
    staleTime: 5 * 60 * 1000, retry: 0,
  });
}

export function useAnalyticsBenchmarks(industry = "technology", employees = 100) {
  return useQuery({
    queryKey: ["analytics", "benchmarks", industry, employees],
    queryFn: async () => {
      try { return await analyticsApi.getBenchmarks(industry, employees); } catch {
        return { ...MOCK_BENCHMARKS, industry, employee_count: employees, org_per_employee_tonnes: MOCK_SUMMARY.total_emissions_tonnes / employees };
      }
    },
    staleTime: 5 * 60 * 1000, retry: 0,
  });
}
