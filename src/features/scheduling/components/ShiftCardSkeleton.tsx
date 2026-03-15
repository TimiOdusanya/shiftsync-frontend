"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ShiftCardSkeleton() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2 pt-4">
        <div>
          <Skeleton className="h-4 w-28" />
          <div className="mt-1.5 flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-7 w-7 rounded-lg" />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4 pt-1">
        <Skeleton className="h-4 w-48" />
        <ul className="mt-2 space-y-1.5 border-t border-border pt-2">
          {[1, 2].map((i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
