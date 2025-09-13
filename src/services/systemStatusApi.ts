import { apiClient } from "@/api";

export const systemStatusApi = {
  // Get the system status data
  getSystemStatus: async () => {
    const response = await apiClient.get("/crypto/system/status");
    return response.data;
  },
};
