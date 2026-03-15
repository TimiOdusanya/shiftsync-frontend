"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { login as loginApi, logout as logoutApi } from "@/services/auth";

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logoutStore = useAuthStore((s) => s.logout);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      if (data.accessToken && data.user) {
        setAuth(data.accessToken, data.user);
        router.push("/schedule");
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logoutStore();
      router.push("/login");
    },
  });

  function login(email: string, password: string) {
    return loginMutation.mutateAsync({ email, password });
  }

  function logout() {
    return logoutMutation.mutateAsync();
  }

  const isAuthenticated = !!(token && user);
  const isLoading = !_hasHydrated || loginMutation.isPending;

  return {
    user: user ?? null,
    isLoading,
    isError: loginMutation.isError,
    isAuthenticated,
    login,
    logout,
    refetch: () => {},
    loginMutation,
    logoutMutation,
  };
}
