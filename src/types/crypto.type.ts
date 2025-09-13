export interface CryptoData {
  date: string;
  last_updated: string;
  nav: {
    starting_nav: number;
    ending_nav: number;
    growth_percent: number;
    chart_data: Array<{ datetime: string; nav: number }>;
  };
  allocations: Record<
    string,
    {
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
    }
  >;
  asset_performance: Record<
    string,
    {
      symbol: string;
      open: number;
      close: number;
      change_percent: number;
      volume_usd: number;
    }
  >;
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

export type TNavChartData = {
  datetime: string;
  nav: number;
};

export type TNavChartDataFromApi = {
  id: string;
  date: string;
  endingNav: number;
  startingNav: number;
  growthPercent: number;
  lastUpdated: string;
  datetime: string;
  minuteKey: string;
};

export type TAllocationHistory = {
  minuteKey: string;
  starting_balance: number;
  minute_gain: number;
  minute_gain_percent: number;
  ending_balance: number;
  notes: string;
  createdAt: string;
};

export type TCryptoDataUpdatePayload = {
  [key: string]: unknown;
};

export type TDailyReportPayload = {
  date: string;
  headline: string;
  subheadline: string;
  starting_nav: number;
  capital_in: number;
  capital_out: number;
  net_system_growth_percent: number;
  ending_nav: number;
  daily_growth_rate: number;
};
