"use client";

import { NotificationList } from "@/features/notifications/components/NotificationList";
import { useMarkAllNotificationsRead, useUnreadCount } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { BellIcon, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const markAllRead = useMarkAllNotificationsRead();
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <BellIcon className="mt-1 h-5 w-5 shrink-0 text-warning sm:h-6 sm:w-6" aria-hidden />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg tracking-tight text-foreground sm:text-lg leading-6 font-bold">Notifications</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Stay on top of shift updates, swaps, and team activity.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {unreadCount} unread
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending || unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        </div>
      </header>
      <NotificationList />
    </div>
  );
}
