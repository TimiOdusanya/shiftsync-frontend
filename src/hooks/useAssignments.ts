"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignmentsByShiftKey,
  assignmentsByUserKey,
  fetchAssignmentsByShift,
  fetchAssignmentsByUser,
  assignStaff,
  unassignStaff,
  fetchAssignmentAlternatives,
  shiftsKeys,
} from "@/services/shifts";

export function useAssignmentsByShift(shiftId: string | null) {
  return useQuery({
    queryKey: assignmentsByShiftKey(shiftId!),
    queryFn: () => fetchAssignmentsByShift(shiftId!),
    enabled: !!shiftId,
  });
}

export function useAssignmentsByUser(
  userId: string | null,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: assignmentsByUserKey(userId!, startDate, endDate),
    queryFn: () => fetchAssignmentsByUser(userId!, startDate, endDate),
    enabled: !!userId,
  });
}

export function useAssignStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      shiftId,
      userId,
      overrideReason,
    }: {
      shiftId: string;
      userId: string;
      overrideReason?: string;
    }) => assignStaff(shiftId, userId, overrideReason),
    onSuccess: (_, { shiftId }) => {
      queryClient.invalidateQueries({ queryKey: assignmentsByShiftKey(shiftId) });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
    },
  });
}

export function useUnassignStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shiftId, userId }: { shiftId: string; userId: string }) =>
      unassignStaff(shiftId, userId),
    onSuccess: (_, { shiftId }) => {
      queryClient.invalidateQueries({ queryKey: assignmentsByShiftKey(shiftId) });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
    },
  });
}

export function useAssignmentAlternatives(shiftId: string | null) {
  return useQuery({
    queryKey: ["assignments", "alternatives", shiftId],
    queryFn: () => fetchAssignmentAlternatives(shiftId!),
    enabled: !!shiftId,
  });
}
