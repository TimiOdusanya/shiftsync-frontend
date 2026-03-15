"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NotificationCenterListSkeleton() {
  return (
    <div className="space-y-px">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-1.5 px-4 py-3">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
