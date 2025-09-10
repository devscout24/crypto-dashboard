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
