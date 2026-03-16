import { apiClient } from "./api";
import type { User } from "@/types";

const USERS_KEY = "users" as const;
export const availabilityKey = (userId: string) => [USERS_KEY, userId, "availability"] as const;
export const desiredHoursKey = (userId: string) => [USERS_KEY, userId, "desired-hours"] as const;

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

export interface RecurringWindow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface AvailabilityResponse {
  recurring: Array<{ id?: string; dayOfWeek: number; startTime: string; endTime: string; timezone: string }>;
  exceptions: Array<{ date: string; isAvailable: boolean; startTime?: string; endTime?: string; timezone: string }>;
}

export async function fetchAvailability(userId: string): Promise<AvailabilityResponse> {
  return apiClient.get<AvailabilityResponse>(`/users/${userId}/availability`);
}

export async function setRecurringAvailability(
  userId: string,
  windows: RecurringWindow[]
): Promise<AvailabilityResponse["recurring"]> {
  return apiClient.put(`/users/${userId}/availability/recurring`, { windows });
}

export async function setException(
  userId: string,
  data: { date: string; isAvailable: boolean; startTime?: string; endTime?: string; timezone: string }
): Promise<unknown> {
  return apiClient.put(`/users/${userId}/availability/exception`, data);
}

export async function fetchDesiredHours(userId: string): Promise<{ minHours?: number | null; maxHours?: number | null }> {
  return apiClient.get(`/users/${userId}/desired-hours`);
}

export async function setDesiredHours(
  userId: string,
  data: { minHours?: number | null; maxHours?: number | null }
): Promise<unknown> {
  return apiClient.put(`/users/${userId}/desired-hours`, data);
}
