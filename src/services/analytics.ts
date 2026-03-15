import { apiClient } from "./api";
import type { FairnessScore, OvertimeWarning } from "@/types";

const ANALYTICS_KEY = "analytics" as const;

export function overtimeProjectionKey(userId: string, weekStart?: string, weekEnd?: string) {
  return [ANALYTICS_KEY, "overtime", userId, weekStart, weekEnd] as const;
}

export function fairnessKey(locationId: string, startDate?: string, endDate?: string) {
  return [ANALYTICS_KEY, "fairness", locationId, startDate, endDate] as const;
}

export function onDutyKey(locationId?: string) {
  return [ANALYTICS_KEY, "on-duty", locationId] as const;
}

export async function fetchOvertimeProjection(
  userId: string,
  weekStart?: string,
  weekEnd?: string
): Promise<{ projectedHours: number; warnings: OvertimeWarning[] }> {
  const params: Record<string, string> = { userId };
  if (weekStart) params.weekStart = weekStart;
  if (weekEnd) params.weekEnd = weekEnd;
  return apiClient.get("/analytics/overtime/projection", params);
}

export async function fetchFairness(
  locationId: string,
  startDate?: string,
  endDate?: string
): Promise<{ distribution: FairnessScore[]; fairnessScore: number }> {
  const params: Record<string, string> = { locationId };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return apiClient.get("/analytics/fairness", params);
}

export async function fetchOnDuty(locationId?: string): Promise<Record<string, unknown[]>> {
  return apiClient.get<Record<string, unknown[]>>(
    "/analytics/on-duty",
    locationId ? { locationId } : undefined
  );
}
