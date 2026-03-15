"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLayoutSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="hidden h-8 w-44 rounded-lg md:block" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-1">
        <aside className="hidden w-60 border-r border-border bg-surface md:block">
          <div className="flex flex-col gap-0.5 p-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-1 h-4 w-72" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
