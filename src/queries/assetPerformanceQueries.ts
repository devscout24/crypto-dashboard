import { assetPerformanceApi } from "@/services/assetPerformanceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const assetPerformanceQueryKeys = {
  assetPerformance: ["assetPerformance"] as const,
} as const;

// Fetches the assetPerformance data for the given minutes.
export const useAssetPerformanceData = (minutes: number) => {
  return useQuery({
    queryKey: assetPerformanceQueryKeys.assetPerformance,
    queryFn: () => assetPerformanceApi.getAssetPerformance(minutes),
  });
};

// Creates a new assetPerformance.
export const useCreateAssetPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assetPerformanceApi.createAssetPerformance,
    onSuccess: (data) => {
      toast.success(data?.message || "Asset Performance created successfully!");
      queryClient.invalidateQueries({
        queryKey: assetPerformanceQueryKeys.assetPerformance,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Asset Performance Creation failed"
      );
    },
  });
};

// update asset performance
export const useUpdateAssetPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assetPerformanceApi.updateAssetPerformance,
    onSuccess: (data) => {
      toast.success(data?.message || "Asset Performance updated successfully!");
      queryClient.invalidateQueries({
        queryKey: assetPerformanceQueryKeys.assetPerformance,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Asset Performance Update failed"
      );
    },
  });
};
