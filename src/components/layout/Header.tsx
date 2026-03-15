"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLocations } from "@/hooks/useLocations";
import { NotificationCenter } from "./NotificationCenter";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Menu, LogOut } from "lucide-react";
import { useSidebar } from "@/store/sidebar-store";
import { useLocationFilter } from "@/store/location-filter-store";

export function Header({ className }: { className?: string }) {
  const { user, logout } = useAuth();
  const { data: locations = [] } = useLocations();
  const { toggle } = useSidebar();
  const { locationId, setLocationId } = useLocationFilter();

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-primary/80" />
        </Button>
        <Link href="/schedule" aria-label="ShiftSync home">
          <Logo size="sm" showText={true} />
        </Link>
        {locations.length > 0 && (
          <div className="ml-2 hidden w-44 md:block">
            <Select
              value={locationId || "__all__"}
              onValueChange={(v) => setLocationId(v === "__all__" ? "" : v)}
              aria-label="Filter by location"
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {user && (
          <>
            <NotificationCenter />
            <div className="mx-2 h-5 w-px bg-border" aria-hidden />
            <div className="flex items-center gap-2">
              <UserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
              />
              <div className="hidden flex-col sm:flex">
                <span className="text-sm font-medium leading-none text-foreground">
                  {user.firstName} {user.lastName}
                </span>
                <span className="mt-0.5 text-xs capitalize leading-none text-muted-foreground">
                  {user.role.toLowerCase()}
                </span>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 group"
                  onClick={() => logout()}
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-danger" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Log out</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </header>
  );
}
