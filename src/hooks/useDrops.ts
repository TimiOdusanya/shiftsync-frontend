"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dropRequestsKey,
  myDropsKey,
  fetchOpenDrops,
  fetchMyDrops,
  createDrop,
  claimDrop,
  approveDrop,
  rejectDrop,
} from "@/services/swaps";
import { shiftsKeys } from "@/services/shifts";
import { t } from "@/lib/toast";

export function useOpenDrops(locationId?: string) {
  return useQuery({
    queryKey: [...dropRequestsKey(), locationId],
    queryFn: () => fetchOpenDrops(locationId),
  });
}

export function useMyDrops() {
  return useQuery({
    queryKey: myDropsKey(),
    queryFn: fetchMyDrops,
  });
}

export function useCreateDrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shiftId: string) => createDrop(shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myDropsKey() });
      queryClient.invalidateQueries({ queryKey: dropRequestsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift dropped", "It's now open for others to claim.");
    },
    onError: (err: Error) => t.error("Failed to drop shift", err.message),
  });
}

export function useClaimDrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dropRequestId: string) => claimDrop(dropRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dropRequestsKey() });
      queryClient.invalidateQueries({ queryKey: myDropsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift claimed", "Awaiting manager approval.");
    },
    onError: (err: Error) => t.error("Failed to claim shift", err.message),
  });
}

export function useApproveDrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveDrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dropRequestsKey() });
      queryClient.invalidateQueries({ queryKey: myDropsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Drop approved");
    },
    onError: (err: Error) => t.error("Failed to approve drop", err.message),
  });
}

export function useRejectDrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectDrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dropRequestsKey() });
      queryClient.invalidateQueries({ queryKey: myDropsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Drop rejected");
    },
    onError: (err: Error) => t.error("Failed to reject drop", err.message),
  });
}
