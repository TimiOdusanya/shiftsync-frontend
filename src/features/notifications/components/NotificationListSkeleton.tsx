"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NotificationListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 max-w-xs" />
            <Skeleton className="h-3.5 w-full max-w-sm" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
