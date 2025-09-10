import { apiClient } from "@/api";
import type { TAllocationPayload } from "@/types";
import type {
  TCryptoDataUpdatePayload,
  TDailyReportPayload,
} from "@/types/crypto.type";

export const cryptoApi = {
  //  Gets the chart data for the given period.
  getNavChartData: async (params?: { month?: number; limit?: number }) => {
    const response = await apiClient.get("/crypto/chart-data", {
      params,
    });
    return response.data;
  },

  // Gets the nav history data for the given days.
  getNavHistoryData: async (params?: { days?: string }) => {
    const response = await apiClient.get("/crypto/portfolio/nav-history", {
      params,
    });
    return response.data;
  },

  // Update crypto data
  updateCryptoData: async (data: TCryptoDataUpdatePayload) => {
    const response = await apiClient.post("/crypto/data/update", data);
    return response.data;
  },

  // Gets allocations data
  getAllocations: async () => {
    const response = await apiClient.get("/allocation");
    return response.data;
  },

  // Create a new allocation
  createAllocation: async (data: TAllocationPayload) => {
    const response = await apiClient.post("/allocation", data);
    return response.data;
  },

  // Update an allocation
  updateAllocation: async ({
    key,
    data,
  }: {
    key: string;
    data: TAllocationPayload;
  }) => {
    const response = await apiClient.put(`/allocation/${key}`, data);
    return response.data;
  },

  // Delete an allocation
  deleteAllocation: async (key: string) => {
    const response = await apiClient.delete(`/allocation/${key}`);
    return response.data;
  },

  // Gets the allocation data for the given key
  getAllocationByKey: async (key: string) => {
    const response = await apiClient.get(`/allocation/${key}`);
    return response.data;
  },

  // Get the allocation data for the given limit
  getAllocationByLimit: async (key: string, limit: number) => {
    const response = await apiClient.get(`/allocation/${key}/history`, {
      params: { limit },
    });
    return response.data;
  },

  // Get the portfolio latest data
  getPortfolioLatestData: async () => {
    const response = await apiClient.get("/crypto/portfolio/latest");
    return response.data;
  },

  // Get the system status data
  getSystemStatus: async () => {
    const response = await apiClient.get("/crypto/system/status");
    return response.data;
  },

  // Get all daily report data
  getDailyReports: async () => {
    const response = await apiClient.get("/daily-report");
    return response.data;
  },

  // Get daily report by date
  getReportById: async (id: string) => {
    const response = await apiClient.get(`/daily-report/${id}`);
    return response.data;
  },

  // Create a new daily report
  createDailyReport: async (data: TDailyReportPayload) => {
    const response = await apiClient.post("/daily-report", data);
    return response.data;
  },

  // Update a daily report
  updateDailyReport: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<TDailyReportPayload>;
  }) => {
    const response = await apiClient.put(`/daily-report/${id}`, data);
    return response.data;
  },
};
