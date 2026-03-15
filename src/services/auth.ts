import { apiClient } from "./api";
import { getStoredToken } from "@/store/authStore";
import type { AuthResponse, User } from "@/types";

const AUTH_ME_KEY = ["auth", "me"] as const;

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", { email, password });
}

export async function logout(): Promise<void> {}

export async function fetchMe(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;
  return apiClient.get<User>("/auth/me");
}

export async function refreshToken(): Promise<AuthResponse | null> {
  const token = getStoredToken();
  if (!token) return null;
  const data = await apiClient.post<AuthResponse>("/auth/refresh", { refreshToken: token });
  if (data.accessToken) {
    const { useAuthStore } = await import("@/store/authStore");
    useAuthStore.getState().setAuth(data.accessToken, data.user);
  }
  return data;
}

export { AUTH_ME_KEY };
