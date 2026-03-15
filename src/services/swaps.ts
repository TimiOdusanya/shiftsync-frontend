import { apiClient } from "./api";
import type { SwapRequest, DropRequest } from "@/types";

const SWAPS_KEY = "swaps" as const;
const DROPS_KEY = "drops" as const;

export function swapRequestsKey() {
  return [SWAPS_KEY, "my"] as const;
}

export function dropRequestsKey() {
  return [DROPS_KEY, "open"] as const;
}

export function myDropsKey() {
  return [DROPS_KEY, "my"] as const;
}

export async function fetchMySwapRequests(): Promise<{
  initiated: SwapRequest[];
  received: SwapRequest[];
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
