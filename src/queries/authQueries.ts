/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { authApi } from "@/services/authApi";
import { authStore } from "@/stores/authStore";

// Query Keys
export const queryKeys = {
  auth: ["auth"] as const,
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    list: (params?: any) => [...queryKeys.user.all, "list", params] as const,
  },
} as const;

// Auth Hooks
export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = authStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (token: string) => {
      login(token);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      toast.success("Login successful");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Login failed"
      );
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      toast.success(data.message || "User created successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registartion failed");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = authStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      authStore.persist.clearStorage();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    },
    onError: () => {
      // Still logout on error
      logout();
      queryClient.clear();
      toast.error("Logout failed");
    },
  });
};
