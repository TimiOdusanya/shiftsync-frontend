import { create } from "zustand";
import type { User } from "@/types";

const AUTH_STORAGE_KEY = "auth-storage";

interface AuthState {
  user: User | null;
  token: string | null;
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  rehydrate: () => void;
}

function writeStorage(token: string | null, user: User | null) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ state: { token, user } });
  localStorage.setItem(AUTH_STORAGE_KEY, payload);
}

const authStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  _hasHydrated: false,
  setAuth: (token, user) => {
    writeStorage(token, user);
    set({ token, user });
  },
  logout: () => {
    writeStorage(null, null);
    set({ token: null, user: null });
  },
  rehydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        set({ _hasHydrated: true });
        return;
      }
      const data = JSON.parse(raw) as { state?: { token?: string | null; user?: User | null } };
      const token = data.state?.token ?? null;
      const user = data.state?.user ?? null;
      set({ token, user, _hasHydrated: true });
    } catch {
      set({ _hasHydrated: true });
    }
  },
}));

export const useAuthStore = authStore;

export function useUser() {
  return useAuthStore((s) => s.user);
}

export function useToken() {
  return useAuthStore((s) => s.token);
}

export function useIsAuthenticated() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  return !!(token && user);
}

export function useAuthHasHydrated() {
  return useAuthStore((s) => s._hasHydrated);
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { state?: { token?: string | null } };
    return data.state?.token ?? null;
  } catch {
    return null;
  }
}
