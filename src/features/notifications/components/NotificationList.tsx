"use client";

import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { NotificationListSkeleton } from "./NotificationListSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bell, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationList() {
  const { data: notifications = [], isLoading } = useNotifications({ limit: 50 });
  const markRead = useMarkNotificationRead();

  if (isLoading) {
    return <NotificationListSkeleton />;
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="h-6 w-6 text-warning" />}
        title="You're all caught up"
        description="New notifications will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => {
        const isUnread = !n.readAt;
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              if (isUnread) markRead.mutate(n.id);
            }}
            className={cn(
              "group relative w-full rounded-xl border text-left transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isUnread
                ? "border-primary/20 bg-primary/[0.04] shadow-sm hover:border-primary/30 hover:bg-primary/[0.06]"
                : "border-border bg-card hover:border-border-strong "
            )}
          >
            {isUnread && (
              <span
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-primary"
                aria-hidden
              />
            )}
            <div className={cn("flex items-start gap-4 px-5 py-4", isUnread && "pl-6")}>
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isUnread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <BellRing className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm leading-snug",
                    isUnread ? "font-semibold text-foreground" : "font-medium text-foreground"
                  )}
                >
                  {n.title}
                </p>
                {n.body && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {n.body}
                  </p>
                )}
                <p
                  className="mt-2 text-xs text-muted-foreground/80"
                  title={formatDate(n.createdAt)}
                >
                  {formatRelativeTime(n.createdAt)}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
