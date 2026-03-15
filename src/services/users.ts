import { apiClient } from "./api";
import type { User } from "@/types";

const USERS_KEY = "users" as const;

export function usersKey(filters?: { role?: string; locationId?: string }) {
  return filters ? [USERS_KEY, filters] as const : [USERS_KEY] as const;
}

export async function fetchUsers(filters?: {
  role?: string;
  locationId?: string;
}): Promise<User[]> {
  const params: Record<string, string> = {};
  if (filters?.role) params.role = filters.role;
  if (filters?.locationId) params.locationId = filters.locationId;
  return apiClient.get<User[]>(
    "/users",
    Object.keys(params).length ? params : undefined
  );
}
