"use client";

import { NotificationList } from "@/features/notifications/components/NotificationList";
import { useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <Button variant="outline" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
          Mark all read
        </Button>
      </div>
      <NotificationList />
    </div>
  );
}
