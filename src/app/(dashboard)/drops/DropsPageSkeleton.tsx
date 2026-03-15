"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MyDropsCardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border p-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-56" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function OpenDropsCardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border p-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3.5 w-64" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
