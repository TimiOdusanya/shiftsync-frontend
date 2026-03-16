"use client";

import { useState, useMemo } from "react";
import { useLocations } from "@/hooks/useLocations";
import { useLocationFilter } from "@/store/location-filter-store";
import { usePermissions } from "@/hooks/usePermissions";
import { useScheduleViewMode, useSetScheduleViewMode } from "@/store/uiStore";
import {
  useSelectedShiftId,
  useShiftFormOpen,
  useShiftFormActions,
} from "@/store/shiftInteractionStore";
import { useShift } from "@/hooks/useShifts";
import { ShiftList } from "@/features/scheduling/components/ShiftList";
import { ShiftFormModal } from "@/features/scheduling/components/ShiftFormModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Plus, ChevronLeft, ChevronRight, LayoutList, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shift, ShiftFilters } from "@/types";

function getWeekRange(weekOffset: number) {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + weekOffset * 7);
  const start = d.toISOString().slice(0, 10);
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  return { start, end: end.toISOString().slice(0, 10) };
}

function formatWeekLabel(start: string, end: string) {
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  const sameMonth = s.getMonth() === e.getMonth();
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", opts).format(d);
  if (sameMonth) {
    return `${fmt(s, { month: "short", day: "numeric" })} – ${fmt(e, { day: "numeric" })}`;
  }
  return `${fmt(s, { month: "short", day: "numeric" })} – ${fmt(e, { month: "short", day: "numeric" })}`;
}

export default function SchedulePage() {
  const { data: locations = [] } = useLocations();
  const { locationId, setLocationId } = useLocationFilter();
  const { canManageSchedule } = usePermissions();
  const scheduleViewMode = useScheduleViewMode();
  const setScheduleViewMode = useSetScheduleViewMode();
  const [weekOffset, setWeekOffset] = useState(0);
  const { start: startDate, end: endDate } = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
  const selectedShiftId = useSelectedShiftId();
  const shiftFormOpen = useShiftFormOpen();
  const { openShiftForm, closeShiftForm } = useShiftFormActions();
  const { data: editingShift } = useShift(selectedShiftId);

  const filters: ShiftFilters = {
    locationId: locationId || undefined,
    startDate: `${startDate}T00:00:00.000Z`,
    endDate: `${endDate}T23:59:59.999Z`,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <Calendar className="mt-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" aria-hidden />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">Schedule</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {canManageSchedule ? "Manage shifts across all locations" : "Your schedule"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-44">
            <Select
              value={locationId || "__all__"}
              onValueChange={(v) => setLocationId(v === "__all__" ? "" : v)}
            >
              <SelectTrigger className="h-9">
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
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-r-none border-0"
              onClick={() => setWeekOffset((o) => o - 1)}
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4 text-primary/80" />
            </Button>
            <span className="min-w-[128px] border-x border-border px-3 py-1.5 text-center text-sm text-muted-foreground">
              {formatWeekLabel(startDate, endDate)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-l-none border-0"
              onClick={() => setWeekOffset((o) => o + 1)}
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4 text-primary/80" />
            </Button>
          </div>
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-md",
                    scheduleViewMode === "table"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setScheduleViewMode("table")}
                  aria-label="Table view"
                  aria-pressed={scheduleViewMode === "table"}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-md",
                    scheduleViewMode === "list"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setScheduleViewMode("list")}
                  aria-label="List view"
                  aria-pressed={scheduleViewMode === "list"}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List view</TooltipContent>
            </Tooltip>
          </div>
          {canManageSchedule && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => openShiftForm(null)}
            >
              <Plus className="h-4 w-4" />
              Add shift
            </Button>
          )}
        </div>
      </div>

      <ShiftList
        filters={filters}
        onEdit={(shift: Shift) => openShiftForm(shift.id)}
        canManageSchedule={canManageSchedule}
        viewMode={scheduleViewMode}
      />

      <ShiftFormModal
        shift={editingShift ?? null}
        open={shiftFormOpen}
        onOpenChange={(open) => {
          if (!open) closeShiftForm();
        }}
      />
    </div>
  );
}
