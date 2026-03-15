"use client";

import { useState, useMemo } from "react";
import { useLocations } from "@/hooks/useLocations";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { useOvertimeProjection, useFairness } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function getWeekRange(weekOffset: number) {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + weekOffset * 7);
  const start = d.toISOString().slice(0, 10);
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  return { start, end: end.toISOString().slice(0, 10) };
}

export default function AnalyticsPage() {
  const { user: currentUser } = useAuth();
  const { data: locations = [] } = useLocations();
  const { data: users = [] } = useUsers({});
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [userId, setUserId] = useState(currentUser?.id ?? "");
  const [weekOffset, setWeekOffset] = useState(0);
  const { start: weekStart, end: weekEnd } = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
  const [periodStart, setPeriodStart] = useState(new Date().toISOString().slice(0, 10));
  const [periodEnd, setPeriodEnd] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const { data: overtime, isLoading: overtimeLoading } = useOvertimeProjection(
    userId || null,
    weekStart,
    weekEnd
  );
  const { data: fairness, isLoading: fairnessLoading } = useFairness(
    locationId || null,
    periodStart,
    periodEnd
  );

  const maxHours = fairness?.distribution?.reduce((m, d) => Math.max(m, d.totalHours), 0) ?? 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Hours tracking, overtime, and fairness</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overtime projection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-52">
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setWeekOffset((o) => o - 1)}
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[120px] border-x border-border px-3 py-1.5 text-center text-sm text-muted-foreground">
                {weekStart} – {weekEnd}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setWeekOffset((o) => o + 1)}
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {overtimeLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : overtime ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {overtime.projectedHours.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">projected hours this week</span>
              </div>
              {overtime.warnings.length > 0 && (
                <ul className="space-y-1.5">
                  {overtime.warnings.map((w, i) => (
                    <li key={i}>
                      <Badge variant={w.requiresOverride ? "danger" : "warning"}>
                        {w.message}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a staff member to see projection</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fairness & distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-44">
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="date"
              className="h-10 w-auto"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
            <Input
              type="date"
              className="h-10 w-auto"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>
          {fairnessLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          ) : fairness ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {(fairness.fairnessScore * 100).toFixed(0)}%
                </span>
                <span className="text-sm text-muted-foreground">fairness score</span>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Hours per staff
                </p>
                {fairness.distribution.map((d) => (
                  <div key={d.userId} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {users.find((u) => u.id === d.userId)?.firstName}{" "}
                        {users.find((u) => u.id === d.userId)?.lastName ?? d.userId}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {d.totalHours.toFixed(1)}h
                        {d.premiumHours > 0 && (
                          <span className="ml-1.5 text-xs">({d.premiumHours.toFixed(1)} premium)</span>
                        )}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(100, (d.totalHours / maxHours) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a location to see distribution</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
