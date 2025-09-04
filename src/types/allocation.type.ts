export type Allocation = {
  name: string;
  value: number;
  fill: string;
};

export type TAllocation = {
  id: string;
  name: string;
  key: string;
  date: string;
  currentBalance: number;
  createdAt: string;
  updatedAt?: string;
};

export type TAllocationKeyData = {
  minuteKey: string;
  starting_balance: number;
  minute_gain: number;
  minute_gain_percent: number;
  ending_balance: number;
  notes: string;
  createdAt: string;
};

export type TAllocationData = {
  name: string;
  current_balance: number;
  history: TAllocationKeyData[];
};

export type TAllocationPayload = {
  key: string;
  name: string;
  initialBalance: number;
};
