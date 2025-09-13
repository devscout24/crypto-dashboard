import { useCryptoChartData } from "@/pages/hooks";
import { useNavChartData } from "@/queries/cryptoQueries";
import type { TNavChartDataFromApi } from "@/types";
import { useEffect, useMemo, useState } from "react";

export function useChartData(activeMonth: string, currentMonth: string) {
  const [lastSocketUpdate, setLastSocketUpdate] = useState<number>(0);
  const [socketError, setSocketError] = useState<boolean>(false);

  const {
    data: navChartDataFromSocket,
    loading: socketLoading,
    emit,
    isConnected,
    error: socketConnectionError,
  } = useCryptoChartData();

  const {
    data: navChartDataFromApi,
    isLoading: apiLoading,
    error: apiError,
    refetch: refetchApiData,
  } = useNavChartData();
  console.log({ navChartDataFromApi });

  // Request initial data when month changes or component mounts
  useEffect(() => {
    if (isConnected && !socketError) {
      const requestData = {
        month: activeMonth,
        year: new Date().getFullYear(),
      };

      console.log("Requesting chart data for:", requestData);
      emit("request_chart_data", requestData);
    }
  }, [activeMonth, isConnected, emit, socketError]);

  // Monitor socket data updates
  useEffect(() => {
    if (
      navChartDataFromSocket &&
      Array.isArray(navChartDataFromSocket) &&
      navChartDataFromSocket.length > 0
    ) {
      setLastSocketUpdate(Date.now());
      setSocketError(false);
    }
  }, [navChartDataFromSocket]);

  // Monitor socket connection errors
  useEffect(() => {
    if (socketConnectionError || (!isConnected && lastSocketUpdate > 0)) {
      setSocketError(true);
      // Trigger API fallback
      refetchApiData();
    }
  }, [socketConnectionError, isConnected, lastSocketUpdate, refetchApiData]);

  // Data priority logic: Socket first, API as fallback
  const finalData = useMemo(() => {
    // Priority 1: Use socket data if available and recent (within 5 minutes)
    if (
      navChartDataFromSocket &&
      Array.isArray(navChartDataFromSocket) &&
      navChartDataFromSocket.length > 0 &&
      !socketError &&
      Date.now() - lastSocketUpdate < 300000 // 5 minutes
    ) {
      console.log("Using socket data");
      return navChartDataFromSocket;
    }

    // Priority 2: Use API data as fallback
    if (
      navChartDataFromApi?.data &&
      Array.isArray(navChartDataFromApi.data) &&
      navChartDataFromApi.data.length > 0 &&
      activeMonth === currentMonth
    ) {
      console.log("Using API data as fallback");
      return navChartDataFromApi.data.map((item: TNavChartDataFromApi) => ({
        datetime: item.datetime,
        nav: item.endingNav,
      }));
    }

    return [];
  }, [
    navChartDataFromSocket,
    navChartDataFromApi,
    socketError,
    lastSocketUpdate,
    activeMonth,
    currentMonth,
  ]);

  // Loading state logic
  const isLoading = useMemo(() => {
    // Show loading if both socket and API are loading
    if (socketLoading && apiLoading) return true;

    // Show loading if socket is primary but no data yet and API is loading
    if (!socketError && !navChartDataFromSocket && apiLoading) return true;

    // Show loading if socket has error, no API data, and API is loading
    if (socketError && !navChartDataFromApi?.data && apiLoading) return true;

    return false;
  }, [
    socketLoading,
    apiLoading,
    socketError,
    navChartDataFromSocket,
    navChartDataFromApi,
  ]);

  return {
    data: finalData,
    isLoading,
    isSocketActive: !socketError && isConnected,
    socketError,
    apiError,
    emit,
    refetchApiData,
  };
}
