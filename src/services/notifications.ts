import { apiClient } from "./api";
import type { Notification } from "@/types";

const NOTIFICATIONS_KEY = "notifications" as const;

export function notificationsKey(unreadOnly?: boolean) {
  return unreadOnly ? [NOTIFICATIONS_KEY, "list", { unreadOnly: true }] as const : [NOTIFICATIONS_KEY, "list"] as const;
}

export function unreadCountKey() {
  return [NOTIFICATIONS_KEY, "unreadCount"] as const;
}

export async function fetchNotifications(options?: {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Notification[]> {
  const params: Record<string, string> = {};
  if (options?.unreadOnly) params.unreadOnly = "true";
  if (options?.limit != null) params.limit = String(options.limit);
  if (options?.offset != null) params.offset = String(options.offset);
  return apiClient.get<Notification[]>("/notifications", Object.keys(params).length ? params : undefined);
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await apiClient.get<{ count: number }>("/notifications/unread-count");
  return res.count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch("/notifications/read-all");
}
