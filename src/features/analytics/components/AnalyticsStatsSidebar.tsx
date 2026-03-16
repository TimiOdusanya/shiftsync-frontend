"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const OT_THRESHOLD = 40;
const WARNING_AT = 35;

interface OvertimeData {
  projectedHours: number;
  warnings: Array< { message: string; requiresOverride?: boolean }>;
}

interface FairnessData {
  fairnessScore: number;
  distribution: Array<{ userId: string; totalHours: number }>;
}

interface AnalyticsStatsSidebarProps {
  overtime: OvertimeData | null | undefined;
  overtimeLoading: boolean;
  fairness: FairnessData | null | undefined;
  fairnessLoading: boolean;
  weekLabel?: string;
  periodLabel?: string;
}

function StatRow({
  icon: Icon,
  label,
  value,
  sub,
  variant = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          variant === "success" && "bg-success/10 text-success",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "danger" && "bg-danger/10 text-danger",
          variant === "default" && "bg-primary/10 text-primary"
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-semibold tabular-nums text-foreground">{value}</p>
        {sub != null && sub !== "" && (
          <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function AnalyticsStatsSidebar({
  overtime,
  overtimeLoading,
  fairness,
  fairnessLoading,
  weekLabel = "This week",
  periodLabel = "Selected period",
}: AnalyticsStatsSidebarProps) {
  const overtimeStatus =
    overtime != null
      ? overtime.projectedHours >= OT_THRESHOLD
        ? ("danger" as const)
        : overtime.projectedHours >= WARNING_AT
          ? ("warning" as const)
          : ("success" as const)
      : null;
  const overtimeStatusLabel =
    overtimeStatus === "danger"
      ? "Over 40h (OT)"
      : overtimeStatus === "warning"
        ? "Approaching OT"
        : overtimeStatus === "success"
          ? "On track"
          : "";

  const distribution = fairness?.distribution ?? [];
  const totalStaff = distribution.length;
  const hoursRange =
    totalStaff > 0
      ? (() => {
          const hours = distribution.map((d) => d.totalHours);
          const min = Math.min(...hours);
          const max = Math.max(...hours);
          return { min, max };
        })()
      : null;

  return (
    <Card className="h-fit lg:h-[60vh] border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" aria-hidden />
          At a glance
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Plain-language summary of the charts
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Overtime summary */}
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overtime
          </h3>
          {overtimeLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-lg bg-muted/50" />
              <div className="h-12 animate-pulse rounded-lg bg-muted/50" />
            </div>
          ) : overtime ? (
            <div className="space-y-2">
              <StatRow
                icon={Clock}
                label={`Projected hours · ${weekLabel}`}
                value={`${overtime.projectedHours.toFixed(1)}h`}
                sub={overtimeStatusLabel}
                variant={overtimeStatus ?? "default"}
              />
              {overtime.warnings.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {overtime.warnings.length} warning{overtime.warnings.length !== 1 ? "s" : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {overtime.warnings[0]?.message}
                      {overtime.warnings.length > 1 ? " …" : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
              Select a staff member to see overtime summary
            </p>
          )}
        </section>

        {/* Fairness summary */}
        <section className="space-y-2 border-t border-border pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fairness & distribution
          </h3>
          {fairnessLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-lg bg-muted/50" />
              <div className="h-12 animate-pulse rounded-lg bg-muted/50" />
            </div>
          ) : fairness ? (
            <div className="space-y-2">
              <StatRow
                icon={TrendingUp}
                label="Fairness score"
                value={`${(fairness.fairnessScore * 100).toFixed(0)}%`}
                sub={periodLabel}
                variant="default"
              />
              {totalStaff > 0 && hoursRange != null ? (
                <>
                  <StatRow
                    icon={Users}
                    label="Staff in range"
                    value={String(totalStaff)}
                    sub={`${hoursRange.min.toFixed(1)}h – ${hoursRange.max.toFixed(1)}h total`}
                    variant="default"
                  />
                </>
              ) : (
                <p className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
                  No shift data in this period
                </p>
              )}
            </div>
          ) : (
            <p className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
              Select a location and dates to see fairness summary
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
