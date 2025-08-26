export interface NavChartData {
  datetime: string;
  nav: number;
  timestamp: string;
}

export interface ChartDataResponse {
  data: NavChartData[];
  month: string;
  year: number;
}
