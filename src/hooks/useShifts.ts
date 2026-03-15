"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  shiftsKeys,
  shiftKey,
  fetchShifts,
  fetchShift,
  createShift,
  updateShift,
  publishShift,
  unpublishShift,
  deleteShift,
} from "@/services/shifts";
import { t } from "@/lib/toast";
import type { ShiftFilters } from "@/types";

export function useShifts(filters?: ShiftFilters) {
  return useQuery({
    queryKey: shiftsKeys(filters),
    queryFn: () => fetchShifts(filters),
  });
}

export function useShift(id: string | null) {
  return useQuery({
    queryKey: shiftKey(id!),
    queryFn: () => fetchShift(id!),
    enabled: !!id,
  });
}

export function useCreateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift created");
    },
    onError: (err: Error) => t.error("Failed to create shift", err.message),
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateShift>[1] }) =>
      updateShift(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: shiftKey(id) });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift updated");
    },
    onError: (err: Error) => t.error("Failed to update shift", err.message),
  });
}

export function usePublishShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishShift,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: shiftKey(id) });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift published");
    },
    onError: (err: Error) => t.error("Failed to publish shift", err.message),
  });
}

export function useUnpublishShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unpublishShift,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: shiftKey(id) });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift unpublished");
    },
    onError: (err: Error) => t.error("Failed to unpublish shift", err.message),
  });
}

export function useDeleteShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift deleted");
    },
    onError: (err: Error) => t.error("Failed to delete shift", err.message),
  });
}
