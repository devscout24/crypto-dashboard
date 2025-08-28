/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocket } from "@/hooks/useSocket";
import { useCallback, useEffect } from "react";

// Enhanced crypto nav history hook
export function useCryptoNavHistory() {
  return useSocket<any[]>({
    event: "crypto_nav_history",
    errorEvent: "crypto_nav_history_error",
  });
}

// Enhanced crypto portfolio hook
export function useCryptoPortfolio() {
  return useSocket({
    event: "crypto_portfolio_latest",
    errorEvent: "crypto_portfolio_latest_error",
  });
}

// Enhanced crypto asset performance hook
export function useCryptoAssetPerformance() {
  return useSocket({
    event: "crypto_asset_performance",
    errorEvent: "crypto_asset_performance_error",
  });
}

// Enhanced crypto chart data hook with month support
export function useCryptoChartData() {
  const hook = useSocket<any[]>({
    event: "crypto_chart_data",
    errorEvent: "crypto_chart_data_error",
  });

  // Auto-request current month data on connection
  useEffect(() => {
    if (hook.isConnected) {
      const currentMonth = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const currentYear = new Date().getFullYear();

      console.log(
        "Auto-requesting chart data for current month:",
        currentMonth
      );
      hook.emit("request_chart_data", {
        month: currentMonth,
        year: currentYear,
      });
    }
  }, [hook.isConnected, hook.emit]);

  // Enhanced emit function for requesting specific month data
  const requestMonthData = useCallback(
    (month: string, year?: number) => {
      const requestYear = year || new Date().getFullYear();
      console.log(`Requesting chart data for ${month} ${requestYear}`);

      hook.emit("request_chart_data", {
        month: month.toLowerCase(),
        year: requestYear,
      });
    },
    [hook.emit]
  );

  return {
    ...hook,
    requestMonthData,
  };
}

// Enhanced crypto system status hook
export function useCryptoSystemStatus() {
  return useSocket({
    event: "crypto_system_status",
    errorEvent: "crypto_system_status_error",
  });
}

// Enhanced crypto current prices hook
export function useCryptoCurrentPrices() {
  return useSocket({
    event: "crypto_current_prices",
    errorEvent: "crypto_current_prices_error",
  });
}

// Enhanced crypto portfolio summary hook
export function useCryptoPortfolioSummary() {
  return useSocket({
    event: "crypto_portfolio_summary",
    errorEvent: "crypto_portfolio_summary_error",
  });
}

// Enhanced crypto health check hook
export function useCryptoHealthCheck() {
  return useSocket({
    event: "crypto_health_check",
    errorEvent: "crypto_health_check_error",
  });
}
