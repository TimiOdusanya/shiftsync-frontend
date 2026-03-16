"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useAvailability, useSetRecurringAvailability, useDesiredHours, useSetDesiredHours } from "@/hooks/useAvailability";
import { CalendarClock } from "lucide-react";
import type { RecurringWindow } from "@/services/users";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const DEFAULT_TZ = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

export function AvailabilitySection() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { data: availability, isLoading: availLoading } = useAvailability(userId);
  const { data: desiredHours, isLoading: desiredLoading } = useDesiredHours(userId);
  const setRecurring = useSetRecurringAvailability(userId);
  const setDesired = useSetDesiredHours(userId);

  const [newDay, setNewDay] = React.useState(1);
  const [newStart, setNewStart] = React.useState("09:00");
  const [newEnd, setNewEnd] = React.useState("17:00");
  const [desiredMin, setDesiredMin] = React.useState<string>("");
  const [desiredMax, setDesiredMax] = React.useState<string>("");

  const recurring = availability?.recurring ?? [];
  React.useEffect(() => {
    if (desiredHours) {
      setDesiredMin(desiredHours.minHours != null ? String(desiredHours.minHours) : "");
      setDesiredMax(desiredHours.maxHours != null ? String(desiredHours.maxHours) : "");
    }
  }, [desiredHours]);

  const handleAddWindow = () => {
    if (!userId) return;
    const existing = recurring.filter((r) => r.dayOfWeek !== newDay);
    const newWindows: RecurringWindow[] = [
      ...existing.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        startTime: r.startTime,
        endTime: r.endTime,
        timezone: r.timezone,
      })),
      { dayOfWeek: newDay, startTime: newStart, endTime: newEnd, timezone: DEFAULT_TZ },
    ];
    setRecurring.mutate(newWindows);
  };

  const handleRemoveWindow = (dayOfWeek: number) => {
    if (!userId) return;
    const next = recurring.filter((r) => r.dayOfWeek !== dayOfWeek).map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
      timezone: r.timezone,
    }));
    setRecurring.mutate(next);
  };

  const handleSaveDesiredHours = () => {
    if (!userId) return;
    setDesired.mutate({
      minHours: desiredMin === "" ? null : Number(desiredMin),
      maxHours: desiredMax === "" ? null : Number(desiredMax),
    });
  };

  if (!userId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4 text-primary" />
          Availability
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          When you can work. Managers use this when scheduling.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <Label className="text-sm font-medium">Recurring weekly</Label>
          {availLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : recurring.length === 0 ? (
            <p className="text-sm text-muted-foreground">No windows set. Add one below.</p>
          ) : (
            <ul className="space-y-1.5">
              {recurring
                .slice()
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((r) => (
                  <li
                    key={`${r.dayOfWeek}-${r.startTime}-${r.endTime}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm"
                  >
                    <span>
                      {DAYS.find((d) => d.value === r.dayOfWeek)?.label ?? r.dayOfWeek} — {r.startTime}–{r.endTime}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-muted-foreground hover:text-danger"
                      onClick={() => handleRemoveWindow(r.dayOfWeek)}
                      disabled={setRecurring.isPending}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
            </ul>
          )}
          <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border/60 bg-muted/10 p-3">
            <div className="w-32">
              <Label className="text-xs text-muted-foreground">Day</Label>
              <Select value={String(newDay)} onValueChange={(v) => setNewDay(Number(v))}>
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <Label className="text-xs text-muted-foreground">Start</Label>
              <Input
                type="time"
                className="h-9 mt-1"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
              />
            </div>
            <div className="w-24">
              <Label className="text-xs text-muted-foreground">End</Label>
              <Input
                type="time"
                className="h-9 mt-1"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddWindow}
              disabled={setRecurring.isPending}
            >
              Add window
            </Button>
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <Label className="text-sm font-medium">Desired hours per week (optional)</Label>
          {desiredLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-24">
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  min={0}
                  max={168}
                  className="h-9 mt-1"
                  placeholder="—"
                  value={desiredMin}
                  onChange={(e) => setDesiredMin(e.target.value)}
                />
              </div>
              <div className="w-24">
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  min={0}
                  max={168}
                  className="h-9 mt-1"
                  placeholder="—"
                  value={desiredMax}
                  onChange={(e) => setDesiredMax(e.target.value)}
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleSaveDesiredHours}
                disabled={setDesired.isPending}
              >
                Save
              </Button>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
