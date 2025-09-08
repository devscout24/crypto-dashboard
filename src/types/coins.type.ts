export type TCoinData = {
  image: string;
  name: string;
  symbol: string;
  open: number;
  close: number;
  change: number;
  volume: number;
  volumeTrend: "up" | "down";
};

export type TAssetPerformancePayload = {
  symbol: string;
  open: number;
  close: number;
  change_percent: number;
  volume_usd: number;
  datetime: string;
};

export type TAssetPerformanceResponse = {
  symbol: string;
  open: number;
  close: number;
  change_percent: number;
  volume_usd: number;
};
