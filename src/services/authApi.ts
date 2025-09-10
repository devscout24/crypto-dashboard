import { apiClient } from "@/api";
import type { TUser } from "@/types";

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    console.log({ credentials });
    const response = await apiClient.post("/auth/login", credentials);
    console.log({ response });
    return response.data;
  },

  register: async (userData: TUser) => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};
