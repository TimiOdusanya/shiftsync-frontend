"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function FairnessCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
