"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function OvertimeCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-4 w-44" />
      </div>
      <Skeleton className="h-6 w-24 rounded-md" />
    </div>
  );
}
