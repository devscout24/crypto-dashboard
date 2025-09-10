// crypto-dashboard/src/services/userApi.ts
import { apiClient } from "@/api";
import type {
  GetUserAllocationsResponse,
  TUser,
  TUserInfoApiResponse,
} from "@/types";

export const userApi = {
  getSingleUser: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async ({ data, id }: { data: Partial<TUser>; id: string }) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  getProfile: async (): Promise<TUserInfoApiResponse> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  updateProfile: async (userData: Partial<TUser>) => {
    const response = await apiClient.put("/users/:id", userData);
    return response.data;
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },

  register: async (userData: TUser) => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  // assign user to allocation
  assignUserToAllocation: async (data: {
    userId: string;
    allocationId: string;
  }) => {
    const response = await apiClient.post("/user-allocation/assign", data);
    return response.data;
  },

  // unassign user from allocation
  unassignUserFromAllocation: async (data: {
    userId: string;
    allocationId: string;
  }) => {
    const response = await apiClient.post("/user-allocation/unassign", data);
    return response.data;
  },

  // get allocations for a user
  getUserAllocations: async (
    userId: string
  ): Promise<GetUserAllocationsResponse> => {
    const response = await apiClient.get(`/user-allocation/user/${userId}`);
    return response.data;
  },
};
