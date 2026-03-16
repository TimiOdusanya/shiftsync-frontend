import { apiClient } from "./api";
import type { SwapRequest, DropRequest } from "@/types";

const SWAPS_KEY = "swaps" as const;
const DROPS_KEY = "drops" as const;

export function swapRequestsKey(userId?: string | null) {
  return [SWAPS_KEY, "my", userId ?? ""] as const;
}

export function dropRequestsKey() {
  return [DROPS_KEY, "open"] as const;
}

export function myDropsKey() {
  return [DROPS_KEY, "my"] as const;
}

export function pendingApprovalDropsKey(locationId?: string) {
  return [DROPS_KEY, "pending-approval", locationId ?? ""] as const;
}

export async function fetchMySwapRequests(): Promise<{
  initiated: SwapRequest[];
  received: SwapRequest[];
  pendingApproval?: SwapRequest[];
  approvedByMe?: SwapRequest[];
  history?: SwapRequest[];
}> {
  return apiClient.get("/swaps/my");
}

export async function createSwap(shiftId: string, receiverId: string): Promise<{ success: boolean; swap?: SwapRequest; error?: string }> {
  return apiClient.post("/swaps", { shiftId, receiverId });
}

export async function acceptSwap(id: string): Promise<SwapRequest> {
  return apiClient.post(`/swaps/${id}/accept`);
}

export async function rejectSwap(id: string, reason?: string): Promise<SwapRequest> {
  return apiClient.post(`/swaps/${id}/reject`, { reason });
}

export async function approveSwap(id: string): Promise<SwapRequest> {
  return apiClient.post(`/swaps/${id}/approve`);
}

export async function rejectSwapByManager(id: string, reason?: string): Promise<SwapRequest> {
  return apiClient.post(`/swaps/${id}/reject-manager`, { reason });
}

export async function cancelSwap(id: string): Promise<SwapRequest> {
  return apiClient.post(`/swaps/${id}/cancel`);
}

export async function fetchOpenDrops(locationId?: string): Promise<DropRequest[]> {
  const params = locationId ? { locationId } : undefined;
  return apiClient.get<DropRequest[]>("/drops/open", params);
}

export async function fetchMyDrops(): Promise<DropRequest[]> {
  return apiClient.get<DropRequest[]>("/drops/my");
}

export async function fetchPendingApprovalDrops(locationId?: string): Promise<DropRequest[]> {
  const params = locationId ? { locationId } : undefined;
  return apiClient.get<DropRequest[]>("/drops/pending-approval", params);
}

export async function createDrop(shiftId: string): Promise<{ success: boolean; drop?: DropRequest; error?: string }> {
  return apiClient.post("/drops", { shiftId });
}

export async function claimDrop(dropRequestId: string): Promise<{ success: boolean; drop?: DropRequest; error?: string }> {
  return apiClient.post("/drops/claim", { dropRequestId });
}

export async function approveDrop(id: string): Promise<DropRequest> {
  return apiClient.post(`/drops/${id}/approve`);
}

export async function rejectDrop(id: string): Promise<DropRequest> {
  return apiClient.post(`/drops/${id}/reject`);
}

export async function cancelDropByOwner(
  id: string
): Promise<{ success: boolean; drop?: DropRequest; error?: string }> {
  return apiClient.post(`/drops/${id}/cancel`);
}
