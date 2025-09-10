export type TPerformanceReportCard = {
  id: string;
  date: string;
  description: string;
  startingNAV: string;
  endingNAV: string;
  growthRate: {
    value: number;
    sign: "+" | "-";
    color: "green" | "red";
    formatted: string;
  };
};

export type TPerformanceReportApiResponse = {
  id: string;
  note: string;
  starting: string;
  ending: string;
  growthRate: string;
  createdAt: string;
  updatedAt: string;
};

export type TPerformanceRecord = {
  date: string;
  balance: string;
  dailyChange: string;
  percentChange: string;
  notes: string;
};
