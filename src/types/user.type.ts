import type { TAllocation } from "@/types";

export type TUserData = {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  role: "ADMIN" | "USER";
  img: string;
  isStatus: boolean;
};

export type UserProfile = {
  email: string;
  id: string;
  fullName: string;
  img: string;
  role: "ADMIN" | "USER";
  userAllocations: {
    allocation: {
      name: string;
      key: string;
    };
  }[];
};

export type GetUserAllocationsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: TAllocation[];
};
