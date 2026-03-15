"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ShiftCardSkeleton } from "./ShiftCardSkeleton";

export function ShiftListSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ShiftCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
