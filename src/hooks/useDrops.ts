"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dropRequestsKey,
  myDropsKey,
  pendingApprovalDropsKey,
  fetchOpenDrops,
  fetchMyDrops,
  fetchPendingApprovalDrops,
  createDrop,
  claimDrop,
  approveDrop,
  rejectDrop,
  cancelDropByOwner,
} from "@/services/swaps";
import { shiftsKeys } from "@/services/shifts";
import { t } from "@/lib/toast";

export function useOpenDrops(locationId?: string) {
  return useQuery({
    queryKey: [...dropRequestsKey(), locationId],
    queryFn: () => fetchOpenDrops(locationId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useMyDrops() {
  return useQuery({
    queryKey: myDropsKey(),
    queryFn: fetchMyDrops,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function usePendingApprovalDrops(locationId?: string, enabled?: boolean) {
  return useQuery({
    queryKey: pendingApprovalDropsKey(locationId),
    queryFn: () => fetchPendingApprovalDrops(locationId),
    enabled: enabled ?? true,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCreateDrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shiftId: string) => createDrop(shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drops"] });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Shift dropped", "It's now open for others to claim.");
    },
    onError: (err: Error) => t.error("Failed to drop shift", err.message),
  });
}

export function useCancelDrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelDropByOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drops"] });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Drop withdrawn", "You’ve kept the shift.");
    },
    onError: (err: Error) => t.error("Failed to withdraw drop", err.message),
  });
}

export function useClaimDrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dropRequestId: string) => claimDrop(dropRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drops"] });
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
      queryClient.invalidateQueries({ queryKey: ["drops"] });
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
      queryClient.invalidateQueries({ queryKey: ["drops"] });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Drop rejected");
    },
    onError: (err: Error) => t.error("Failed to reject drop", err.message),
  });
}
