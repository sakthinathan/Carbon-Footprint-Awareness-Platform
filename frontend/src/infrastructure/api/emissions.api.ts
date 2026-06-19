// Emissions API calls
import { apiClient } from "./client";
import type {
  EmissionCreateRequest,
  EmissionListResponse,
  EmissionResponse,
  EmissionSummary,
} from "@/types/emission.types";

export const emissionsApi = {
  getSummary: async (): Promise<EmissionSummary> => {
    const { data } = await apiClient.get("/emissions/summary");
    return data;
  },

  list: async (params?: {
    page?: number;
    page_size?: number;
    scope?: string;
    search?: string;
  }): Promise<EmissionListResponse> => {
    const { data } = await apiClient.get("/emissions", { params });
    return data;
  },

  create: async (payload: EmissionCreateRequest): Promise<EmissionResponse> => {
    const { data } = await apiClient.post("/emissions", payload);
    return data;
  },

  getById: async (id: string): Promise<EmissionResponse> => {
    const { data } = await apiClient.get(`/emissions/${id}`);
    return data;
  },

  update: async (id: string, payload: Partial<EmissionCreateRequest>): Promise<EmissionResponse> => {
    const { data } = await apiClient.patch(`/emissions/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/emissions/${id}`);
  },

  exportCsv: async (): Promise<Blob> => {
    const { data } = await apiClient.get("/reports/export/csv", {
      responseType: "blob",
    });
    return data;
  },
};

export const analyticsApi = {
  getTrends: async (months = 12) => {
    const { data } = await apiClient.get("/analytics/trends", { params: { months } });
    return data.data.trends;
  },

  getScopeBreakdown: async () => {
    const { data } = await apiClient.get("/analytics/scope-breakdown");
    return data.data.breakdown;
  },

  getCategoryBreakdown: async () => {
    const { data } = await apiClient.get("/analytics/category-breakdown");
    return data.data.categories;
  },

  getBenchmarks: async (industry = "technology", employee_count = 100) => {
    const { data } = await apiClient.get("/analytics/benchmarks", {
      params: { industry, employee_count },
    });
    return data.data;
  },
};
