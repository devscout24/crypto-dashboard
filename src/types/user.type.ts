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

export type TUserInfo = {
  id: string;
  email: string;
  fullName: string;
  img: string;
  role: "USER" | "ADMIN";
  userAllocations: {
    allocation: {
      key: string;
      name: string;
    };
  }[];
};

export type TUserInfoApiResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: TUserInfo;
};

export type GetUserAllocationsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: TAllocation[];
};
