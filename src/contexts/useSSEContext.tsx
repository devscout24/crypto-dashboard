import { createContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { SSEContextType, SSEMessage } from "./useSSEContext.types";

const SSEContext = createContext<SSEContextType | null>(null);

interface SSEProviderProps {
  children: ReactNode;
  url?: string;
}

export function SSEProvider({ children, url = "/api/sse" }: SSEProviderProps) {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEventSource = useCallback(() => {
    const source = new EventSource(url);

    source.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    source.onerror = () => {
      setIsConnected(false);
      setError(new Error("SSE connection error"));
      source.close();
      // Attempt to reconnect after 5 seconds
      setTimeout(createEventSource, 5000);
    };

    setEventSource(source);
    return source;
  }, [url]);

  useEffect(() => {
    const source = createEventSource();
    return () => {
      source.close();
    };
  }, [createEventSource]);

  const addEventListener = useCallback(
    function <T>(event: string, callback: (data: SSEMessage<T>) => void) {
      if (!eventSource) return;

      const listener = (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          callback(data);
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };

      eventSource.addEventListener(event, listener);
      return () => eventSource.removeEventListener(event, listener);
    },
    [eventSource]
  );

  const removeEventListener = useCallback(
    function <T>(event: string, callback: (data: SSEMessage<T>) => void) {
      if (!eventSource) return;
      // Note: This will only work if the same listener reference is passed
      eventSource.removeEventListener(
        event,
        callback as unknown as EventListener
      );
    },
    [eventSource]
  );
  const reconnect = useCallback(() => {
    if (eventSource) {
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
