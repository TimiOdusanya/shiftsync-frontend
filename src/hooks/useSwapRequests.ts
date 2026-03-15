"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  swapRequestsKey,
  fetchMySwapRequests,
  createSwap,
  acceptSwap,
  rejectSwap,
  approveSwap,
  rejectSwapByManager,
  cancelSwap,
} from "@/services/swaps";
import { shiftsKeys } from "@/services/shifts";
import { t } from "@/lib/toast";

export function useSwapRequests() {
  return useQuery({
    queryKey: swapRequestsKey(),
    queryFn: fetchMySwapRequests,
  });
}

export function useCreateSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shiftId, receiverId }: { shiftId: string; receiverId: string }) =>
      createSwap(shiftId, receiverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: swapRequestsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Swap request sent");
    },
    onError: (err: Error) => t.error("Failed to send swap request", err.message),
  });
}

export function useAcceptSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptSwap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: swapRequestsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Swap accepted");
    },
    onError: (err: Error) => t.error("Failed to accept swap", err.message),
  });
}

export function useRejectSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectSwap(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: swapRequestsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Swap rejected");
    },
    onError: (err: Error) => t.error("Failed to reject swap", err.message),
  });
}

export function useApproveSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveSwap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: swapRequestsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Swap approved");
    },
    onError: (err: Error) => t.error("Failed to approve swap", err.message),
  });
}

export function useRejectSwapByManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectSwapByManager(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: swapRequestsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Swap rejected");
    },
    onError: (err: Error) => t.error("Failed to reject swap", err.message),
  });
}

export function useCancelSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSwap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: swapRequestsKey() });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
      t.success("Swap cancelled");
    },
    onError: (err: Error) => t.error("Failed to cancel swap", err.message),
  });
}
