import { useContext } from "react";
import { SSEContext } from "@/contexts/SSEContext";
import type { SSEContextType } from "@/contexts/useSSEContext.types";

export function useSSE(): SSEContextType {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error("useSSE must be used within an SSEProvider");
  }
  return context;
}
