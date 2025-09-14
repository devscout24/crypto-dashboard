import { systemStatusApi } from "@/services/systemStatusApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

// update system status
export const useUpdateSystemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: systemStatusApi.updateSystemStatus,
    onSuccess: (data) => {
      toast.success(data.message || "System status updated successfully!");
      queryClient.invalidateQueries({ queryKey: systemQueryKeys.system });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
};
