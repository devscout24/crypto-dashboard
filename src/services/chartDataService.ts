import type { ChartDataResponse } from "@/types/chart";
import { useSSE } from "@/hooks";
import type { SSEMessage } from "@/types/sse.types";

export interface ChartDataService {
  isConnected: boolean;
  requestChartData: (month: string, year: number) => Promise<ChartDataResponse>;
  subscribeToUpdates: (
    callback: (data: SSEMessage<ChartDataResponse>) => void
  ) => () => void;
  subscribeToErrors: (callback: (error: Error) => void) => void;
}

export function createChartDataService(
  addEventListener: <T>(
    event: string,
    callback: (data: SSEMessage<T>) => void
  ) => void,
  removeEventListener: <T>(
    event: string,
    callback: (data: SSEMessage<T>) => void
  ) => void,
  isConnected: boolean
): ChartDataService {
  return {
    isConnected,

    async requestChartData(month: string, year: number) {
      try {
        const response = await fetch(
          `/api/chart-data?month=${month.toLowerCase()}&year=${year}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching chart data:", error);
        throw error;
      }
    },

    subscribeToUpdates(
      callback: (data: SSEMessage<ChartDataResponse>) => void
    ) {
      if (!isConnected) {
        console.error("SSE connection not available");
        return () => {};
      }

      // Subscribe to chart data updates
      addEventListener("crypto_chart_data", callback);

      // Return cleanup function
      return () => {
        removeEventListener("crypto_chart_data", callback);
      };
    },

    subscribeToErrors(callback: (error: Error) => void) {
      // Since SSE has built-in error handling in the Provider,
      // we can just pass the callback directly
      addEventListener("error", (event: SSEMessage<{ message: string }>) => {
        callback(new Error(event.data.message));
      });
    },
  };
}

// Custom hook to use the chart data service
export function useChartDataService() {
  const { addEventListener, removeEventListener, isConnected } = useSSE();
  return createChartDataService(
    addEventListener,
    removeEventListener,
    isConnected
  );
}
