"use client";

import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationList() {
  const { data: notifications = [], isLoading } = useNotifications({ limit: 50 });
  const markRead = useMarkNotificationRead();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-1.5 px-5 py-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3.5 w-72" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="h-6 w-6" />}
        title="You're all caught up"
        description="New notifications will appear here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={cn(
            "flex items-start gap-3 px-5 py-4 transition-colors cursor-pointer hover:bg-muted/30",
            !n.readAt && "bg-primary/[0.03]"
          )}
          onClick={() => { if (!n.readAt) markRead.mutate(n.id); }}
        >
          {!n.readAt && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
          )}
          <div className={cn("min-w-0", n.readAt && "ml-5")}>
            <p className={cn("text-sm text-foreground", !n.readAt && "font-medium")}>
              {n.title}
            </p>
            {n.body && (
              <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground/70">{formatDate(n.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
