import { apiClient } from "./api";
import type { AuthResponse, User } from "@/types";

const AUTH_ME_KEY = ["auth", "me"] as const;
const AUTH_STORAGE_KEY = "accessToken";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  if (typeof window !== "undefined" && data.accessToken) {
    localStorage.setItem(AUTH_STORAGE_KEY, data.accessToken);
  }
  return data;
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export async function fetchMe(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;
  const data = await apiClient.get<User>("/auth/me");
  return data;
}

export async function refreshToken(): Promise<AuthResponse | null> {
  const token = getStoredToken();
  if (!token) return null;
  const data = await apiClient.post<AuthResponse>("/auth/refresh", { refreshToken: token });
  if (data.accessToken && typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, data.accessToken);
  }
  return data;
}

export { AUTH_ME_KEY };
