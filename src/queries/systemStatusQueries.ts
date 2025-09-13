import { systemStatusApi } from "@/services/systemStatusApi";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const systemQueryKeys = {
  system: ["system"] as const,
} as const;

/// Fetches the system status data
export const useSystemStatus = () => {
  return useQuery({
    queryKey: systemQueryKeys.system,
    queryFn: () => systemStatusApi.getSystemStatus(),
  });
};
