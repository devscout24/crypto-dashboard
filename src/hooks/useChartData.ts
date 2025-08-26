import { useEffect, useState, useCallback } from "react";
import type { ChartDataResponse } from "@/types/chart";
import type { SocketError } from "@/types/error";
import { useChartDataService } from "@/services/chartDataService";
import { useSSE } from "@/hooks";

export function useChartData(
  selectedMonth: string,
  currentMonth: string = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase()
) {
  const chartService = useChartDataService();
  const { isConnected } = useSSE();
  const [data, setData] = useState<ChartDataResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SocketError | null>(null);

  const handleError = useCallback((error: Error) => {
    setError({
      code: "SERVICE_UNAVAILABLE",
      message: error.message,
    });
    setIsLoading(false);
  }, []);

  const handleData = useCallback((message: { data: ChartDataResponse }) => {
    setData(message.data.data);
    setError(null);
    setIsLoading(false);
  }, []);

  const requestChartData = useCallback(
    (month: string, year: number) => {
      setIsLoading(true);
      setError(null);
      chartService.requestChartData(month, year);
    },
    [chartService]
  );

  useEffect(() => {
    if (!isConnected) return;

    setIsLoading(true);
    setError(null);

    // Subscribe to data updates
    const dataCleanup = chartService.subscribeToUpdates(handleData);

    // Subscribe to errors
    chartService.subscribeToErrors(handleError);

    requestChartData(selectedMonth || currentMonth, new Date().getFullYear());

    return () => {
      // Cleanup data subscription only
      if (typeof dataCleanup === "function") {
        dataCleanup();
      }
    };
  }, [
    selectedMonth,
    currentMonth,
    chartService,
    handleData,
    handleError,
    requestChartData,
    isConnected,
  ]);

  return {
    data,
    isLoading,
    error,
    isConnected,
    requestChartData,
  };
}
