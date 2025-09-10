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
      name: string;
      open: number;
      close: number;
      changePercent?: number;
      volumeUsd: number;
    };
  }) => {
    const response = await apiClient.patch(`/asset-performance/${id}`, data);
    return response.data;
  },

  // create asset platform
  createAssetPlatform: async (
    assetPerformanceId: string,
    data: {
      platforms: {
        name: string;
        asset: string;
        active: boolean;
      }[];
    }
  ) => {
    const response = await apiClient.post(
      `asset-performance/${assetPerformanceId}/platforms`,
      data
    );
    return response.data;
  },

  // update asset platform by platform id
  updateAssetPlatform: async ({
    id,
    data,
  }: {
    id: string;
    data: {
      name: string;
      asset?: string;
      active?: boolean;
    };
  }) => {
    const response = await apiClient.patch(
      `/asset-performance/platforms/${id}`,
      data
    );
    return response.data;
  },

  // delete asset performance by id
  deleteAssetPerformance: async (id: string) => {
    const response = await apiClient.delete(`/asset-performance/${id}`);
    return response.data;
  },

  // delete asset platform by id
  deleteAssetPlatform: async (id: string) => {
    const response = await apiClient.delete(
      `/asset-performance/platforms/${id}`
    );
    return response.data;
  },
};
