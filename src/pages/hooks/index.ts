/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSSE } from "@/hooks/useSSE";
import { useCallback, useEffect, useState } from "react";
import type { SSEMessage } from "@/types/sse.types";

// Custom hook for SSE with error handling
function useSSEWithErrors<T>(event: string) {
  const { addEventListener, isConnected } = useSSE();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) return;

    addEventListener<T>(event, (message: SSEMessage<T>) => {
      setData(message.data);
      setError(null);
      setLoading(false);
    });

    // Error listener
    addEventListener<{ message: string }>(
      "error",
      (message: SSEMessage<{ message: string }>) => {
        setError(new Error(message.data.message));
        setLoading(false);
      }
    );
  }, [addEventListener, isConnected, event]);

  return {
    data,
    error,
    loading,
    isConnected,
  };
}

// Enhanced crypto nav history hook
export function useCryptoNavHistory() {
  return useSSEWithErrors<any[]>("crypto_nav_history");
}

// Enhanced crypto portfolio hook
export function useCryptoPortfolio() {
  return useSSEWithErrors("crypto_portfolio_latest");
}

// Enhanced crypto asset performance hook
export function useCryptoAssetPerformance() {
  return useSSEWithErrors("crypto_asset_performance");
}

// Enhanced crypto chart data hook with month support
export function useCryptoChartData() {
  const { addEventListener, isConnected } = useSSE();
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) return;

    addEventListener<any[]>(
      "crypto_chart_data",
      (message: SSEMessage<any[]>) => {
        setData(message.data);
        setError(null);
        setLoading(false);
      }
    );

    // Error listener
    addEventListener<{ message: string }>(
      "crypto_chart_data_error",
      (message: SSEMessage<{ message: string }>) => {
        setError(new Error(message.data.message));
        setLoading(false);
      }
    );
  }, [addEventListener, isConnected]);

  // Enhanced function for requesting specific month data
  const requestMonthData = useCallback((month: string, year?: number) => {
    const requestYear = year || new Date().getFullYear();
    console.log(`Requesting chart data for ${month} ${requestYear}`);

    // In SSE, we would typically make a separate HTTP request for this
    // or have the server push data based on some other mechanism
    fetch(`/api/chart-data?month=${month.toLowerCase()}&year=${requestYear}`)
      .then((response) => response.json())
      .then((chartData) => {
        setData(chartData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return {
    data,
    error,
    loading,
    isConnected,
    requestMonthData,
  };
}

// Enhanced crypto system status hook
export function useCryptoSystemStatus() {
  return useSSEWithErrors("crypto_system_status");
}

// Enhanced crypto current prices hook
export function useCryptoCurrentPrices() {
  return useSSEWithErrors("crypto_current_prices");
}

// Enhanced crypto portfolio summary hook
export function useCryptoPortfolioSummary() {
  return useSSEWithErrors("crypto_portfolio_summary");
}

// Enhanced crypto health check hook
export function useCryptoHealthCheck() {
  return useSSEWithErrors("crypto_health_check");
}
