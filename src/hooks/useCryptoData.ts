import { useState, useCallback, useEffect } from "react";
import type { CryptoData } from "@/types/crypto.type";
import type { SSEMessage } from "@/types/sse.types";
import { useSSE } from "./useSSE";

interface UseCryptoDataOptions {
  enableRealtime?: boolean;
}

interface UseCryptoDataReturn {
  data: CryptoData | null;
  isLoading: boolean;
  error: Error | null;
}

export const useCryptoData = (
  options: UseCryptoDataOptions = {}
): UseCryptoDataReturn => {
  const { isConnected, error: sseError, addEventListener } = useSSE();
  const [data, setData] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Reset error when SSE connection is established
  useEffect(() => {
    if (isConnected) {
      setError(null);
    }
  }, [isConnected]);

  // Set SSE error when it occurs
  useEffect(() => {
    if (sseError) {
      setError(new Error(sseError.message));
    }
  }, [sseError]);

  const handleDataUpdate = useCallback((event: SSEMessage<CryptoData>) => {
    console.log("📡 Received crypto data update:", event);
    setData(event.data);
    setIsLoading(false);
    setError(null);
  }, []);

  // Subscribe to crypto data updates using SSE
  useEffect(() => {
    if (!isConnected || !options.enableRealtime) {
      console.log("⚠️ SSE not connected or realtime disabled");
      return;
    }

    console.log("🎧 Subscribing to crypto data updates...");
    
    // Add event listeners for different crypto events
    addEventListener("crypto_data_update", handleDataUpdate);
    addEventListener("crypto_portfolio_latest", handleDataUpdate);
    addEventListener("crypto_asset_performance", handleDataUpdate);
    addEventListener("crypto_system_status", handleDataUpdate);
    addEventListener("crypto_current_prices", handleDataUpdate);
    addEventListener("crypto_portfolio_summary", handleDataUpdate);

    // Note: The SSE context handles cleanup automatically when the component unmounts
  }, [isConnected, options.enableRealtime, addEventListener, handleDataUpdate]);

  return { data, isLoading, error };
};
