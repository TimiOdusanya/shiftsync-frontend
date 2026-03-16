"use client";

import { useQuery } from "@tanstack/react-query";
import {
  overtimeProjectionKey,
  fairnessKey,
  onDutyKey,
  fetchOvertimeProjection,
  fetchFairness,
  fetchOnDuty,
  fetchAllowedOnDutyLocationIds,
} from "@/services/analytics";

export function useOvertimeProjection(
  userId: string | null,
  weekStart?: string,
  weekEnd?: string
) {
  return useQuery({
    queryKey: overtimeProjectionKey(userId ?? "", weekStart, weekEnd),
    queryFn: () => fetchOvertimeProjection(userId!, weekStart, weekEnd),
    enabled: !!userId,
  });
}

export function useFairness(
  locationId: string | null,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: fairnessKey(locationId ?? "", startDate, endDate),
    queryFn: () => fetchFairness(locationId!, startDate, endDate),
    enabled: !!locationId,
  });
}

export function useOnDuty(locationId?: string) {
  return useQuery({
    queryKey: onDutyKey(locationId),
    queryFn: () => fetchOnDuty(locationId),
  });
}

const ALLOWED_ON_DUTY_LOCATIONS_KEY = ["analytics", "on-duty", "allowed-locations"] as const;

export function useAllowedOnDutyLocationIds() {
  return useQuery({
    queryKey: ALLOWED_ON_DUTY_LOCATIONS_KEY,
    queryFn: fetchAllowedOnDutyLocationIds,
  });
}
