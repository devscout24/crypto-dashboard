import { createContext } from "react";
import type { SSEContextType } from "@/types/sse.types";

export const SSEContext = createContext<SSEContextType | null>(null);
