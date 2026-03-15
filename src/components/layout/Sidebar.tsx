"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useSidebar } from "@/store/sidebar-store";
import { Logo } from "@/components/brand/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Calendar,
  RefreshCw,
  Bell,
  BarChart3,
  Clock,
  Settings,
  Users,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const baseNavItems: Array<{
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  analyticsOnly?: boolean;
}> = [
  { href: "/schedule", label: "Schedule", icon: Calendar, iconClass: "text-primary/80" },
  { href: "/swaps", label: "Swaps", icon: RefreshCw, iconClass: "text-info/80" },
  { href: "/notifications", label: "Notifications", icon: Bell, iconClass: "text-warning/80" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, iconClass: "text-primary/80", analyticsOnly: true },
  { href: "/on-duty", label: "On-Duty", icon: Clock, iconClass: "text-success/80" },
  { href: "/settings", label: "Settings", icon: Settings, iconClass: "text-muted-foreground" },
];

interface NavItemLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  isActive: boolean;
  collapsed: boolean;
}

function NavItemLink({ href, label, icon: Icon, iconClass, isActive, collapsed }: NavItemLinkProps) {
  const link = (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
        collapsed && "justify-center px-2.5"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-primary-foreground/60" />
      )}
      <Icon className={cn("h-4 w-4 shrink-0", !isActive && iconClass)} aria-hidden />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { canAccessAnalytics, canAccessUsers } = usePermissions();
  const { open, collapsed, toggleCollapsed } = useSidebar();

  const navItems = baseNavItems.filter(
    (item) => !item.analyticsOnly || canAccessAnalytics
  );

  const collapseBtn = (
    <button
      type="button"
      onClick={toggleCollapsed}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
        collapsed && "justify-center px-2.5"
      )}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <PanelLeft className="h-4 w-4 shrink-0 text-primary/70" />
      ) : (
        <PanelLeftClose className="h-4 w-4 shrink-0 text-primary/70" />
      )}
      {!collapsed && <span>Collapse</span>}
    </button>
  );

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-surface transition-[width] duration-200 ease-in-out",
        "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] md:static md:top-0 md:min-h-[calc(100vh-3.5rem)] md:h-full",
        open ? (collapsed ? "w-[68px]" : "w-60") : "w-0 overflow-hidden md:w-60",
        className
      )}
      aria-label="Main navigation"
    >
      {open && !collapsed && (
        <div className="hidden items-center justify-between border-b border-border px-4 py-3.5 md:flex">
          <Logo size="sm" showText={true} />
        </div>
      )}
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <NavItemLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              iconClass={item.iconClass}
              isActive={isActive}
              collapsed={collapsed}
            />
          );
        })}
        {canAccessUsers && (
          <>
            <div className="my-1.5 border-t border-border" />
            <NavItemLink
              href="/users"
              label="Users"
              icon={Users}
              iconClass="text-primary/80"
              isActive={pathname === "/users"}
              collapsed={collapsed}
            />
          </>
        )}
      </nav>
      <div className="border-t border-border p-2">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>{collapseBtn}</TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        ) : (
          collapseBtn
        )}
      </div>
    </aside>
  );
}
