"use client";

import { useOnDuty } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";

export interface OnDutyListProps {
  locationId?: string;
}

export function OnDutyList({ locationId }: OnDutyListProps) {
  const { data: byLocation = {}, isLoading } = useOnDuty(locationId);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  const entries = Object.entries(byLocation) as [string, Array<{ userId: string; user?: { firstName?: string; lastName?: string }; startAt?: string; endAt?: string }>][];

  if (entries.length === 0) return <p className="text-muted-foreground">No one on duty</p>;

  return (
    <div className="space-y-4">
      {entries.map(([locId, staff]) => (
        <Card key={locId}>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Location {locId}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {staff.map((s: { userId: string; user?: { firstName?: string; lastName?: string }; startAt?: string; endAt?: string }, i: number) => (
                <li key={s.userId ?? i}>
                  {s.user ? `${(s.user as { firstName?: string }).firstName} ${(s.user as { lastName?: string }).lastName}` : s.userId}
                  {s.startAt && s.endAt && (
                    <span className="text-muted-foreground">
                      {" "}
                      {formatTime(s.startAt)} – {formatTime(s.endAt)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
