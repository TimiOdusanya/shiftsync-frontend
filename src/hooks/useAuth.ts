"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  fetchMe,
  login as loginService,
  logout as logoutService,
  AUTH_ME_KEY,
} from "@/services/auth";
import type { User } from "@/types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginService(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_ME_KEY, data.user ?? null);
      router.push("/schedule");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_ME_KEY, null);
      router.push("/login");
    },
  });

  function login(email: string, password: string) {
    return loginMutation.mutateAsync({ email, password });
  }

  function logout() {
    return logoutMutation.mutateAsync();
  }

  const isAuthenticated = !!user && !isError;

  return {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated,
    login,
    logout,
    refetch,
    loginMutation,
    logoutMutation,
  };
}
