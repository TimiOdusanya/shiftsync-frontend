"use client";

import { useShifts } from "@/hooks/useShifts";
import { ShiftCard } from "./ShiftCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import type { Shift, ShiftFilters } from "@/types";

function ShiftListSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-4 w-32" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export interface ShiftListProps {
  filters?: ShiftFilters;
  onEdit: (shift: Shift) => void;
}

export function ShiftList({ filters, onEdit }: ShiftListProps) {
  const { data: shifts = [], isLoading } = useShifts(filters);

  if (isLoading) {
    return <ShiftListSkeleton />;
  }

  if (shifts.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-6 w-6" />}
        title="No shifts in this range"
        description="Create a shift or adjust the date range to see shifts here."
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
