"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import { getNotificationHref } from "@/lib/notificationLink";
import { Button } from "@/components/ui/button";
import { NotificationCenterListSkeleton } from "./NotificationCenterSkeleton";
import { formatDate } from "@/lib/utils";
import { Bell, BellDot } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: notifications = [], isLoading } = useNotifications({ limit: 20 });
  const { data: unreadCount = 0 } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const handleNotificationClick = (n: (typeof notifications)[0]) => {
    if (!n.readAt) markRead.mutate(n.id);
    const href = getNotificationHref(n);
    setOpen(false);
    if (href) router.push(href);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {unreadCount > 0 ? (
          <BellDot className="h-5 w-5 text-primary" />
        ) : (
          <Bell className="h-5 w-5 text-warning/80" />
        )}
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-semibold text-white"
            aria-hidden
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full z-50 mt-2 flex max-h-[420px] w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="font-semibold text-foreground text-md">Notifications</p>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <NotificationCenterListSkeleton />
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <Bell className="h-6 w-6 text-warning/50" />
                  <p className="text-sm text-muted-foreground">You're all caught up</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "cursor-pointer px-4 py-3 text-sm transition-colors hover:bg-muted/40",
                        !n.readAt && "bg-primary/[0.03]"
                      )}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="flex items-start gap-2">
                        {!n.readAt && (
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        )}
                        <div className={cn(!n.readAt && "ml-0", "min-w-0")}>
                          <p className={cn("font-medium text-foreground", n.readAt && "font-normal")}>
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground/70">
                            {formatDate(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
