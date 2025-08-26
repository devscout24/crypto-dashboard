export interface SocketError {
  code: ErrorCode;
  message: string;
  data?: unknown;
}

export type ErrorCode =
  | "RATE_LIMIT_EXCEEDED"
  | "INVALID_REQUEST"
  | "MISSING_PARAMETERS"
  | "INVALID_YEAR"
  | "SERVICE_UNAVAILABLE"
  | "INVALID_MONTH"
  | "NO_DATA"
  | "PROCESSING_ERROR"
  | "INTERNAL_ERROR";
