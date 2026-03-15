"use client";

import { useState } from "react";
import { useOnDuty } from "@/hooks/useAnalytics";
import { useLocations } from "@/hooks/useLocations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [locationId, setLocationId] = useState<string>("");
  const { data: locations = [] } = useLocations();
  const { data: byLocation = {}, isLoading } = useOnDuty(locationId || undefined);

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
        <div>
          <h1 className="text-2xl font-semibold text-foreground">On duty</h1>
          <p className="mt-1 text-sm text-muted-foreground">Staff currently working across locations</p>
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
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
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
              <Card key={locId}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="h-2 w-2 rounded-full bg-success" />
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
                          className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2.5"
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
