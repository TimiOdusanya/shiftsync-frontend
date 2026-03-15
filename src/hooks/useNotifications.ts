"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  notificationsKey,
  unreadCountKey,
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notifications";
import { t } from "@/lib/toast";

export function useNotifications(options?: { unreadOnly?: boolean; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: notificationsKey(options?.unreadOnly),
    queryFn: () => fetchNotifications(options),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: unreadCountKey(),
    queryFn: fetchUnreadCount,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKey() });
      queryClient.invalidateQueries({ queryKey: unreadCountKey() });
    },
    onError: (err: Error) => t.error("Failed to mark as read", err.message),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKey() });
      queryClient.invalidateQueries({ queryKey: unreadCountKey() });
      t.success("All notifications marked as read");
    },
    onError: (err: Error) => t.error("Failed to mark all as read", err.message),
  });
}
