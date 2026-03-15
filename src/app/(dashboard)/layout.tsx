"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useRealtimeSchedule } from "@/hooks/useRealtimeSchedule";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardLayoutSkeleton } from "@/app/(dashboard)/DashboardLayoutSkeleton";
import { useSidebar } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";

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
    return <DashboardLayoutSkeleton />;
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
