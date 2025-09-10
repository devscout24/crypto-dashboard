import { apiClient } from "@/api";
import type { TAssetPerformancePayload } from "@/types";

export const assetPerformanceApi = {
  //  Get latest asset performance data
  getAssetPerformance: async () => {
    const response = await apiClient.get("/asset-performance/latest");
    return response.data;
  },

  // get asset performance platforms by id
  getAssetPlatformsById: async (id: string) => {
    const response = await apiClient.get(`/asset-performance/${id}/platforms`);
    return response.data;
  },

  //  Create a New asset performance
  createAssetPerformance: async (data: TAssetPerformancePayload) => {
    const response = await apiClient.post("/asset-performance", data);
    return response.data;
  },

  //  Update asset performance by id
  updateAssetPerformance: async ({
    id,
    data,
  }: {
    id: string;
    data: {
      close: number;
      changePercent?: number;
    };
  }) => {
    const response = await apiClient.put(`/asset-performance/${id}`, data);
    return response.data;
  },
};
