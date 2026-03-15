import { apiClient } from "./api";
import type { Shift, ShiftAssignment, ShiftFilters, AssignmentResult } from "@/types";

const SHIFTS_KEY = "shifts" as const;
const ASSIGNMENTS_KEY = "assignments" as const;

export function shiftsKeys(filters?: ShiftFilters) {
  return filters ? [SHIFTS_KEY, filters] as const : [SHIFTS_KEY] as const;
}

export function shiftKey(id: string) {
  return [SHIFTS_KEY, id] as const;
}

export function assignmentsByShiftKey(shiftId: string) {
  return [ASSIGNMENTS_KEY, "shift", shiftId] as const;
}

export function assignmentsByUserKey(userId: string, startDate?: string, endDate?: string) {
  return [ASSIGNMENTS_KEY, "user", userId, startDate, endDate] as const;
}

export async function fetchShifts(filters?: ShiftFilters): Promise<Shift[]> {
  const params: Record<string, string> = {};
  if (filters?.locationId) params.locationId = filters.locationId;
  if (filters?.startDate) params.startDate = filters.startDate;
  if (filters?.endDate) params.endDate = filters.endDate;
  if (filters?.state) params.state = filters.state;
  return apiClient.get<Shift[]>("/shifts", Object.keys(params).length ? params : undefined);
}

export async function fetchShift(id: string): Promise<Shift | null> {
  return apiClient.get<Shift>(`/shifts/${id}`);
}

export async function createShift(data: {
  locationId: string;
  skillId: string;
  startAt: string;
  endAt: string;
  headcountRequired: number;
}): Promise<Shift> {
  return apiClient.post<Shift>("/shifts", data);
}

export async function updateShift(id: string, data: Partial<Parameters<typeof createShift>[0]>): Promise<Shift> {
  return apiClient.patch<Shift>(`/shifts/${id}`, data);
}

export async function publishShift(id: string): Promise<Shift> {
  return apiClient.post<Shift>(`/shifts/${id}/publish`);
}

export async function unpublishShift(id: string): Promise<Shift> {
  return apiClient.post<Shift>(`/shifts/${id}/unpublish`);
}

export async function deleteShift(id: string): Promise<void> {
  await apiClient.delete(`/shifts/${id}`);
}

export async function fetchAssignmentsByShift(shiftId: string): Promise<ShiftAssignment[]> {
  return apiClient.get<ShiftAssignment[]>(`/assignments/shifts/${shiftId}/assignments`);
}

export async function fetchAssignmentsByUser(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<ShiftAssignment[]> {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return apiClient.get<ShiftAssignment[]>(`/assignments/users/${userId}/assignments`, params);
}

export async function assignStaff(
  shiftId: string,
  userId: string,
  overrideReason?: string
): Promise<AssignmentResult> {
  return apiClient.post<AssignmentResult>(`/assignments/shifts/${shiftId}/assignments`, {
    userId,
    ...(overrideReason?.trim() && { overrideReason: overrideReason.trim() }),
  });
}

export async function unassignStaff(shiftId: string, userId: string): Promise<void> {
  await apiClient.delete(`/assignments/shifts/${shiftId}/assignments/${userId}`);
}

export async function fetchAssignmentAlternatives(shiftId: string): Promise<Array<{ userId: string; name: string }>> {
  return apiClient.get<Array<{ userId: string; name: string }>>(
    `/assignments/shifts/${shiftId}/assignments/alternatives`
  );
}
