"use client";

import { useEffect } from "react";
import { useOnDuty, useAllowedOnDutyLocationIds } from "@/hooks/useAnalytics";
import { useLocations } from "@/hooks/useLocations";
import { useLocationFilter } from "@/store/location-filter-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { OnDutyPageSkeleton } from "@/app/(dashboard)/on-duty/OnDutyPageSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

export default function OnDutyPage() {
  const { locationId, setLocationId } = useLocationFilter();
  const { data: locations = [] } = useLocations();
  const { data: allowedData } = useAllowedOnDutyLocationIds();
  const allowedLocationIds = allowedData?.locationIds ?? null;
  const visibleLocations =
    Array.isArray(allowedLocationIds) && allowedLocationIds.length > 0
      ? locations.filter((loc) => allowedLocationIds.includes(loc.id))
      : locations;
  const { data: byLocation = {}, isLoading } = useOnDuty(locationId || undefined);

  useEffect(() => {
    if (
      locationId &&
      Array.isArray(allowedLocationIds) &&
      allowedLocationIds.length > 0 &&
      !allowedLocationIds.includes(locationId)
    ) {
      setLocationId("");
    }
  }, [locationId, allowedLocationIds, setLocationId]);

  const entries = Object.entries(byLocation) as [
    string,
    Array<{
      userId: string;
      shiftId: string;
      startAt: string;
      endAt: string;
      user?: { id: string; firstName: string; lastName: string };
    }>
  ][];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <Clock className="mt-1 h-5 w-5 shrink-0 text-success sm:h-6 sm:w-6" aria-hidden />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">On duty</h1>
            <p className="mt-1 text-sm text-muted-foreground">Staff currently working across locations</p>
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={locationId || "__all__"}
            onValueChange={(v) => setLocationId(v === "__all__" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All locations</SelectItem>
              {visibleLocations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <OnDutyPageSkeleton />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-6 w-6 text-success" />}
          title="No one on duty right now"
          description="Staff assigned to current shifts will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([locId, assignments]) => {
            const location = locations.find((l) => l.id === locId);
            const locationName = location?.name ?? locId;
            const timezone = location?.timezone ?? "UTC";
            return (
              <Card key={locId} className="border-l-4 border-l-success/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-success ring-2 ring-success/30" />
                    {locationName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {assignments.map(
                      (a: {
                        userId: string;
                        shiftId: string;
                        startAt: string;
                        endAt: string;
                        user?: { firstName: string; lastName: string };
                      }) => (
                        <li
                          key={`${a.shiftId}-${a.userId}`}
                          className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/50"
                        >
                          <UserAvatar
                            firstName={a.user?.firstName ?? ""}
                            lastName={a.user?.lastName ?? ""}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {a.user?.firstName} {a.user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <TimezoneDisplay utcDate={a.startAt} timezone={timezone} />
                              {" – "}
                              <TimezoneDisplay utcDate={a.endAt} timezone={timezone} />
                            </p>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
