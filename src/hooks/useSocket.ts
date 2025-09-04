/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import type { Socket } from "socket.io-client";
import sharedSocket from "@/lib/socket";

// Types
export interface SocketConfig {
  options?: {
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
  };
}

export interface SocketEventConfig {
  event: string;
  errorEvent?: string; // Optional custom error event name
  onData?: (data: any) => void; // Optional custom data handler
  onError?: (error: any) => void; // Optional custom error handler
}

export interface UseSocketReturn<T = any> {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: "disconnected" | "connected" | "error" | "connecting";
  error: string | null;
  data: T | null;
  loading: boolean;
  emit: (event: string, data?: any) => void;
  disconnect: () => void;
  reconnect: () => void;
  clearError: () => void;
  clearData: () => void;
}

export function useSocket<T = any>(
  // config: SocketConfig,
  eventConfig: SocketEventConfig
): UseSocketReturn<T> {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connected" | "error" | "connecting"
  >("disconnected");

  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Use ref to store the socket instance to avoid stale closures
  const socketRef = useRef<Socket | null>(sharedSocket);

  // const socketOptions = useRef({
  //   autoConnect: true,
  //   reconnection: true,
  //   reconnectionAttempts: 5,
  //   reconnectionDelay: 1000,
  //   transports: ["websocket", "polling"],
  //   ...config.options,
  // });

  // Memoized connection event handlers
  const handleConnect = useCallback(() => {
    console.log("Connected to socket server");
    setConnectionStatus("connected");
    setError(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log("Disconnected from socket server");
    setConnectionStatus("disconnected");
    setLoading(false);
  }, []);

  const handleConnectError = useCallback((err: Error) => {
    console.error("Connection error:", err);
    setError("Failed to connect to socket server");
    setConnectionStatus("error");
    setLoading(false);
  }, []);

  // Data event handler - memoized with stable reference
  const handleDataEvent = useCallback(
    (responseData: any) => {
      console.log(`${eventConfig.event}:`, responseData);
      setLoading(false);

      if (eventConfig.onData) {
        eventConfig.onData(responseData);
      } else {
        // Default behavior: extract data from response
        setData(responseData?.data || responseData);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventConfig.event, eventConfig.onData]
  );

  // Error event handler - memoized with stable reference
  const handleErrorEvent = useCallback(
    (errorData: any) => {
      const errorMessage = `Error in ${eventConfig.event}: ${
        errorData?.message || "Unknown error"
      }`;
      console.error(errorMessage, errorData);
      setLoading(false);

      if (eventConfig.onError) {
        eventConfig.onError(errorData);
      } else {
        setError(errorMessage);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventConfig.event, eventConfig.onError]
  );

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = sharedSocket;

    setConnectionStatus(socketInstance.connected ? "connected" : "connecting");

    // Keep local state in sync
    setSocket(socketInstance);
    socketRef.current = socketInstance;

    // Connection events (attach this hook’s specific listeners)
    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("connect_error", handleConnectError);

    // Data event listener
    socketInstance.on(eventConfig.event, handleDataEvent);

    // Error event listener (auto-generate error event name if not provided)
    const errorEventName =
      eventConfig.errorEvent || `${eventConfig.event}_error`;
    socketInstance.on(errorEventName, handleErrorEvent);

    // Cleanup: remove only this hook’s listeners, do NOT disconnect shared socket
    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.off(eventConfig.event, handleDataEvent);
      socketInstance.off(errorEventName, handleErrorEvent);

      setConnectionStatus(socketInstance.connected ? "connected" : "disconnected");
      setLoading(false);
    };
  }, [
    eventConfig.event,
    eventConfig.errorEvent,
    handleConnect,
    handleDisconnect,
    handleConnectError,
    handleDataEvent,
    handleErrorEvent,
  ]);

  // Utility functions
  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current && socketRef.current.connected) {
      setLoading(true);
      setError(null);
      socketRef.current.emit(event, data);
    } else {
      console.warn("Socket not connected. Cannot emit event:", event);
      setError("Socket not connected");
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) socketRef.current.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      setError(null);
      socketRef.current.connect();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return {
    socket,
    isConnected: connectionStatus === "connected",
    connectionStatus,
    error,
    data,
    loading,
    emit,
    disconnect,
    reconnect,
    clearError,
    clearData,
  };
}
