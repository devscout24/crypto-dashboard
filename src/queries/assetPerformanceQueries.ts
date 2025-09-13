import { assetPerformanceApi } from "@/services/assetPerformanceApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateAssetPlatformData = {
  assetPerformanceId: string;
  platform: {
    name: string;
    asset: string;
    active: boolean;
  };
};

// Query Keys
export const assetPerformanceQueryKeys = {
  assetPerformance: ["assetPerformance"] as const,
  assetPlatforms: ["assetPlatforms"] as const,
} as const;

// Fetches latest the assetPerformance data
export const useAssetPerformanceData = () => {
  return useQuery({
    queryKey: assetPerformanceQueryKeys.assetPerformance,
    queryFn: () => assetPerformanceApi.getAssetPerformance(),
  });
};

// fetches asset performance platforms data by id
export const useAssetPlatformsById = (id: string) => {
  return useQuery({
    queryKey: assetPerformanceQueryKeys.assetPlatforms,
    queryFn: () => assetPerformanceApi.getAssetPlatformsById(id),
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

// create asset platform
export const useCreateAssetPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetPlatformData) =>
      assetPerformanceApi.createAssetPlatform(data.assetPerformanceId, {
        platforms: [data.platform],
      }),
    onSuccess: (data) => {
      toast.success(data?.message || "Asset Platform created successfully!");
      queryClient.invalidateQueries({
        queryKey: assetPerformanceQueryKeys.assetPlatforms,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Asset Platform Creation failed"
      );
    },
  });
};

// update asset platform
export const useUpdateAssetPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assetPerformanceApi.updateAssetPlatform,
    onSuccess: (data) => {
      toast.success(data?.message || "Asset Platform updated successfully!");
      queryClient.invalidateQueries({
        queryKey: assetPerformanceQueryKeys.assetPlatforms,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Asset Platform Update failed"
      );
    },
  });
};

// delete asset performance
export const useDeleteAssetPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assetPerformanceApi.deleteAssetPerformance,
    onSuccess: (data) => {
      toast.success(data?.message || "Asset Performance deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: assetPerformanceQueryKeys.assetPerformance,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Asset Performance Delete failed"
      );
    },
  });
};

// delete asset platform
export const useDeleteAssetPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assetPerformanceApi.deleteAssetPlatform,
    onSuccess: (data) => {
      toast.success(data?.message || "Asset Platform deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: assetPerformanceQueryKeys.assetPlatforms,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Asset Platform Delete failed"
      );
    },
  });
};
