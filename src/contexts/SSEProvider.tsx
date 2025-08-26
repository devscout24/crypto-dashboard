import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { SSEContext } from "./SSEContext";
import type { SSEContextType, SSEMessage } from "@/types/sse.types";

interface SSEProviderProps {
  children: ReactNode;
  url?: string;
}

export function SSEProvider({ children, url = "/api/v1/sse/connect" }: SSEProviderProps) {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEventSource = useCallback(() => {
    // Get the base URL from environment or use the same default as the API
    const baseURL = import.meta.env.VITE_APP_API_URL || "http://172.16.100.26:5050";
    const fullUrl = `${baseURL}${url}`;
    
    console.info("🔄 Creating SSE connection to:", fullUrl);
    console.info("🔧 Environment:", {
      VITE_APP_API_URL: import.meta.env.VITE_APP_API_URL,
      windowOrigin: window.location.origin,
      baseURL,
      fullUrl
    });
    
    // Remove withCredentials for SSE as it can cause CORS issues
    const source = new EventSource(fullUrl);

    source.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.info("✅ SSE connection established");
    };

    source.onerror = (event) => {
      setIsConnected(false);
      setError(new Error("SSE connection error"));
      console.warn("⚠️ SSE connection error:", event);
      console.warn("⚠️ SSE connection details:", {
        readyState: source.readyState,
        url: source.url,
        withCredentials: source.withCredentials
      });
      source.close();
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.info("🔄 Attempting SSE reconnection...");
        createEventSource();
      }, 5000);
    };

    // Listen for the initial connection message
    source.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") {
          console.info("✅ SSE client registered:", data.clientId);
        }
      } catch (err) {
        console.error("❌ Error parsing SSE connection message:", err);
      }
    });

    setEventSource(source);
    return source;
  }, [url]);

  useEffect(() => {
    console.info("🔄 Initializing SSE connection...");
    const source = createEventSource();
    
    return () => {
      console.info("🔚 Closing SSE connection...");
      source.close();
    };
  }, [createEventSource]);

  const addEventListener = useCallback(
    <T,>(event: string, callback: (data: SSEMessage<T>) => void) => {
      if (!eventSource) {
        console.warn("⚠️ Cannot add event listener: SSE not connected");
        return;
      }

      const listener = (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          console.debug(`📡 Received SSE event: ${event}`, data);
          callback(data);
        } catch (err) {
          console.error("❌ Error parsing SSE data:", err);
        }
      };

      eventSource.addEventListener(event, listener);
      console.debug(`✨ Added listener for ${event} event`);
      
      return () => {
        eventSource.removeEventListener(event, listener);
        console.debug(`🗑️ Removed listener for ${event} event`);
      };
    },
    [eventSource]
  );

  const removeEventListener = useCallback(
    <T,>(event: string, callback: (data: SSEMessage<T>) => void) => {
      if (!eventSource) return;
      eventSource.removeEventListener(
        event,
        callback as unknown as EventListener
      );
      console.debug(`🗑️ Removed listener for ${event} event`);
    },
    [eventSource]
  );

  const reconnect = useCallback(() => {
    if (eventSource) {
      console.info("🔄 Reconnecting SSE...");
      eventSource.close();
    }
    createEventSource();
  }, [eventSource, createEventSource]);

  const value: SSEContextType = {
    isConnected,
    error,
    addEventListener,
    removeEventListener,
    reconnect,
  };

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
}
