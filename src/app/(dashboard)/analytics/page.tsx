"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocations } from "@/hooks/useLocations";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocationFilter } from "@/store/location-filter-store";
import { useOvertimeProjection, useFairness } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { OvertimeCardSkeleton } from "@/features/analytics/components/OvertimeCardSkeleton";
import { FairnessCardSkeleton } from "@/features/analytics/components/FairnessCardSkeleton";
import { FairnessDistributionChart } from "@/features/analytics/components/FairnessDistributionChart";
import { OvertimeVisual } from "@/features/analytics/components/OvertimeVisual";
import { AnalyticsStatsSidebar } from "@/features/analytics/components/AnalyticsStatsSidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function getWeekRange(weekOffset: number) {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + weekOffset * 7);
  const start = d.toISOString().slice(0, 10);
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  return { start, end: end.toISOString().slice(0, 10) };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { canAccessAnalytics } = usePermissions();
  const { data: locations = [] } = useLocations();

  useEffect(() => {
    if (currentUser != null && !canAccessAnalytics) router.replace("/schedule");
  }, [currentUser, canAccessAnalytics, router]);

  if (currentUser != null && !canAccessAnalytics) return null;
  const { locationId: contextLocationId, setLocationId: setContextLocationId } = useLocationFilter();
  const locationId = contextLocationId || (locations[0]?.id ?? "");
  const setLocationId = setContextLocationId;
  const { data: users = [] } = useUsers({});
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

  const [fairnessStart, fairnessEnd] = useMemo(() => {
    if (!periodStart || !periodEnd) return [periodStart, periodEnd];
    return periodStart <= periodEnd
      ? [periodStart, periodEnd]
      : [periodEnd, periodStart];
  }, [periodStart, periodEnd]);

  const { data: fairness, isLoading: fairnessLoading } = useFairness(
    locationId || null,
    fairnessStart,
    fairnessEnd
  );

  const maxHours = fairness?.distribution?.reduce((m, d) => Math.max(m, d.totalHours), 0) ?? 1;
  const chartDistribution = useMemo(() => {
    if (!fairness?.distribution || !users.length) return [];
    return fairness.distribution.map((d) => {
      const u = users.find((u) => u.id === d.userId);
      return {
        userId: d.userId,
        name: u ? `${u.firstName} ${u.lastName}` : d.userId.slice(0, 8),
        totalHours: d.totalHours,
        premiumHours: d.premiumHours,
        regularHours: Math.max(0, d.totalHours - d.premiumHours),
      };
    });
  }, [fairness?.distribution, users]);
  const weekLabel = `${weekStart} – ${weekEnd}`;
  const periodLabel = useMemo(() => {
    if (!periodStart || !periodEnd) return "Selected period";
    const fmt = (s: string) =>
      new Date(s + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return periodStart === periodEnd ? fmt(periodStart) : `${fmt(periodStart)} – ${fmt(periodEnd)}`;
  }, [periodStart, periodEnd]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex min-w-0 items-start gap-2 sm:gap-3">
        <BarChart3 className="mt-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" aria-hidden />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hours tracking, overtime, and fairness</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,minmax(280px,340px)] lg:gap-8">
        <div className="min-w-0 space-y-8">
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
                <ChevronLeft className="h-4 w-4 text-primary/80" />
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
                <ChevronRight className="h-4 w-4 text-primary/80" />
              </Button>
            </div>
          </div>
          {overtimeLoading ? (
            <OvertimeCardSkeleton />
          ) : overtime ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {overtime.projectedHours.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">projected hours this week</span>
              </div>
              <OvertimeVisual projectedHours={overtime.projectedHours} weekLabel={weekLabel} />
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
          <div className="flex flex-wrap items-end gap-3 sm:gap-4">
            <div className="w-full min-w-0 sm:w-44">
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Location
              </Label>
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
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fairness-start" className="text-xs font-medium text-muted-foreground">
                  Start date
                </Label>
                <DatePicker
                  id="fairness-start"
                  value={periodStart}
                  onChange={setPeriodStart}
                  aria-label="Fairness period start date"
                  min={undefined}
                  max={periodEnd || undefined}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fairness-end" className="text-xs font-medium text-muted-foreground">
                  End date
                </Label>
                <DatePicker
                  id="fairness-end"
                  value={periodEnd}
                  onChange={setPeriodEnd}
                  aria-label="Fairness period end date"
                  min={periodStart || undefined}
                />
              </div>
            </div>
          </div>
          {fairnessLoading ? (
            <FairnessCardSkeleton />
          ) : fairness ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {(fairness.fairnessScore * 100).toFixed(0)}%
                </span>
                <span className="text-sm text-muted-foreground">fairness score</span>
              </div>
              {chartDistribution.length > 0 ? (
                <FairnessDistributionChart data={chartDistribution} maxHours={maxHours} />
              ) : (
                <p className="text-sm text-muted-foreground">No shift data in this period</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a location to see distribution</p>
          )}
        </CardContent>
      </Card>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AnalyticsStatsSidebar
            overtime={overtime ?? null}
            overtimeLoading={overtimeLoading}
            fairness={fairness ?? null}
            fairnessLoading={fairnessLoading}
            weekLabel={weekLabel}
            periodLabel={periodLabel}
          />
        </aside>
      </div>
    </div>
  );
}
