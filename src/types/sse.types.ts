// Base SSE message type
export interface SSEMessage<T = unknown> {
  message?: string;
  data: T;
  timestamp?: string;
}

// SSE Context type
export interface SSEContextType {
  isConnected: boolean;
  error: Error | null;
  addEventListener: <T>(event: string, callback: (data: SSEMessage<T>) => void) => void;
  removeEventListener: <T>(event: string, callback: (data: SSEMessage<T>) => void) => void;
  reconnect: () => void;
}

// SSE Event Types
export const SSEEvents = {
  CRYPTO_DATA_UPDATE: 'crypto_data_update',
  CRYPTO_PORTFOLIO_LATEST: 'crypto_portfolio_latest',
  CRYPTO_NAV_HISTORY: 'crypto_nav_history',
  CRYPTO_CHART_DATA: 'crypto_chart_data',
  CRYPTO_ASSET_PERFORMANCE: 'crypto_asset_performance',
  CRYPTO_SYSTEM_STATUS: 'crypto_system_status',
  CRYPTO_CURRENT_PRICES: 'crypto_current_prices',
  CRYPTO_PORTFOLIO_SUMMARY: 'crypto_portfolio_summary',
  CRYPTO_HEALTH_CHECK: 'crypto_health_check'
} as const;

// Base data types for SSE events
export interface BaseSSEData {
  timestamp: string;
  serverId?: string;
}

// Crypto data types
export interface CryptoData extends BaseSSEData {
  date: string;
  last_updated: string;
  nav: {
    starting_nav: number;
    ending_nav: number;
    growth_percent: number;
    chart_data: Array<{ datetime: string; nav: number }>;
  };
  allocations: Record<string, {
    name: string;
    current_balance: number;
    history: Array<{
      minuteKey: string;
      starting_balance: number;
      minute_gain: number;
      minute_gain_percent: number;
      ending_balance: number;
      notes: string;
      createdAt: string;
    }>;
  }>;
  asset_performance: Record<string, {
    symbol: string;
    open: number;
    close: number;
    change_percent: number;
    volume_usd: number;
  }>;
  system_status: {
    routing_active: boolean;
    hedging_engaged: boolean;
    smart_layer_unlocked: boolean;
    dashboard_beta_mode: boolean;
    last_sync_success: boolean;
  };
  visual_flags: Record<string, string>;
  daily_report_text: string;
  team_notes: Record<string, string>;
}
