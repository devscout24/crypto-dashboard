import { apiClient } from "@/api";

export type TSystemStatusPayload = {
  allocations: string;
  overrideLayer: string;
  surplusRedistribution: string;
  passiveCarryStack: string;
  syndicateTiering: string;
  trustLayer: string;
  complianceLayer: string;
};

export const systemStatusApi = {
  // Get the system status data
  getSystemStatus: async () => {
    const response = await apiClient.get("/system/status");
    return response.data;
  },

  // update system status
  updateSystemStatus: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<TSystemStatusPayload>;
  }) => {
    const response = await apiClient.put(`system/update/${id}`, data);
    return response.data;
  },
};
