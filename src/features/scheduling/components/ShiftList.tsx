"use client";

import { useShifts } from "@/hooks/useShifts";
import { ShiftCard } from "./ShiftCard";
import { ShiftListSkeleton } from "./ShiftListSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Calendar } from "lucide-react";
import type { Shift, ShiftFilters } from "@/types";

export interface ShiftListProps {
  filters?: ShiftFilters;
  onEdit: (shift: Shift) => void;
  canManageSchedule?: boolean;
}

export function ShiftList({ filters, onEdit, canManageSchedule = false }: ShiftListProps) {
  const { data: shifts = [], isLoading } = useShifts(filters);

  if (isLoading) {
    return <ShiftListSkeleton />;
  }

  if (shifts.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-6 w-6 text-primary" />}
        title="No shifts in this range"
        description={
          canManageSchedule
            ? "Create a shift or adjust the date range to see shifts here."
            : "Adjust the date range to see shifts here."
        }
      />
    );
  }

  const byLocation = shifts.reduce<Record<string, Shift[]>>((acc, shift) => {
    const locId = shift.locationId;
    if (!acc[locId]) acc[locId] = [];
    acc[locId].push(shift);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(byLocation).map(([locationId, locationShifts]) => {
        const location = locationShifts[0]?.location;
        const locationName = location?.name ?? locationId;
        const timezone = location?.timezone ?? "UTC";
        return (
          <section key={locationId}>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              {locationName}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {locationShifts.map((shift) => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  locationTimezone={timezone}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
