"use client";

import { useState, useCallback, useMemo } from "react";
import { useLocations } from "@/hooks/useLocations";
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
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [weekOffset, setWeekOffset] = useState(0);
  const { start: startDate, end: endDate } = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
  const [locationId, setLocationId] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const filters: ShiftFilters = {
    locationId: locationId || undefined,
    startDate: `${startDate}T00:00:00.000Z`,
    endDate: `${endDate}T23:59:59.999Z`,
  };

  const handleEdit = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback((open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingShift(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Schedule</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage shifts across all locations</p>
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
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setEditingShift(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add shift
          </Button>
        </div>
      </div>

      <ShiftList filters={filters} onEdit={handleEdit} />

      <ShiftFormModal shift={editingShift} open={formOpen} onOpenChange={handleCloseForm} />
    </div>
  );
}
