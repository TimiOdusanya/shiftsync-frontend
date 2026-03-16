"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  availabilityKey,
  desiredHoursKey,
  fetchAvailability,
  fetchDesiredHours,
  setRecurringAvailability,
  setDesiredHours,
  type RecurringWindow,
} from "@/services/users";
import { t } from "@/lib/toast";

export function useAvailability(userId: string | null) {
  return useQuery({
    queryKey: availabilityKey(userId ?? ""),
    queryFn: () => fetchAvailability(userId!),
    enabled: !!userId,
  });
}

export function useSetRecurringAvailability(userId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (windows: RecurringWindow[]) => setRecurringAvailability(userId!, windows),
    onSuccess: (_, __, context) => {
      if (userId) queryClient.invalidateQueries({ queryKey: availabilityKey(userId) });
      t.success("Availability updated");
    },
    onError: (err: Error) => t.error("Failed to update availability", err.message),
  });
}

export function useDesiredHours(userId: string | null) {
  return useQuery({
    queryKey: desiredHoursKey(userId ?? ""),
    queryFn: () => fetchDesiredHours(userId!),
    enabled: !!userId,
  });
}

export function useSetDesiredHours(userId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { minHours?: number | null; maxHours?: number | null }) =>
      setDesiredHours(userId!, data),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: desiredHoursKey(userId) });
      t.success("Desired hours updated");
    },
    onError: (err: Error) => t.error("Failed to update desired hours", err.message),
  });
}
