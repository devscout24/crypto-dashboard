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

export type TAssetPerformance = {
  id: string;
  symbol: string;
  name: string;
  open: number;
  close: number;
  change_percent: number;
  volume_usd: number;
  yield_daily_percent?: number;
  platforms: { name: string; asset: string }[];
};

export type TAssetPerformanceResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: TAssetPerformance[];
};

export type TPlatform = {
  id: string;
  name: string;
  symbol: string;
  close: number;
  open: number;
  changePercent: number;
  volumeUsd: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
