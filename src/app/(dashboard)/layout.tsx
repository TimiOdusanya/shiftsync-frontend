"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useRealtimeSchedule } from "@/hooks/useRealtimeSchedule";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  useSocket();
  useRealtimeSchedule();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-60 border-r border-border bg-surface md:block">
            <div className="flex flex-col gap-2 p-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </aside>
          <main className="flex-1 p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-1">
        <Sidebar />
        <main
          className={cn(
            "min-w-0 flex-1 overflow-auto p-4 md:p-6",
            !open && "md:pl-6"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
