export type TPerformanceReportCard = {
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
  createdAt: string;
  note: string;
  starting: string;
  ending: string;
  growthRate:
    | number
    | string
    | {
        value: number;
        sign: "+" | "-";
        color: "green" | "red";
        formatted: string;
      };
};

export type TPerformanceRecord = {
  date: string;
  balance: string;
  dailyChange: string;
  percentChange: string;
  notes: string;
};
