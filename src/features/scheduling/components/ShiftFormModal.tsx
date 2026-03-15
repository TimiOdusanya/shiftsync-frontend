"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/shared/TimePicker";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocations } from "@/hooks/useLocations";
import { useSkills } from "@/hooks/useSkills";
import { useCreateShift, useUpdateShift } from "@/hooks/useShifts";
import { requiredId, runValidations } from "@/lib/validation";
import { getTimeInZone, localTimeInZoneToUTC, toDateInputInZone } from "@/lib/utils";
import type { Shift } from "@/types";

export interface ShiftFormModalProps {
  shift: Shift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShiftFormModal({ shift, open, onOpenChange }: ShiftFormModalProps) {
  const isEdit = !!shift;
  const { data: locations = [] } = useLocations();
  const { data: skills = [] } = useSkills();
  const createMutation = useCreateShift();
  const updateMutation = useUpdateShift();

  const [locationId, setLocationId] = React.useState(shift?.locationId ?? "");
  const [skillId, setSkillId] = React.useState(shift?.skillId ?? "");
  const tz0 = shift?.location?.timezone ?? "UTC";
  const [startDate, setStartDate] = React.useState(
    shift ? toDateInputInZone(shift.startAt, tz0) : ""
  );
  const [startTime, setStartTime] = React.useState(
    shift ? getTimeInZone(shift.startAt, tz0) : "09:00"
  );
  const [endDate, setEndDate] = React.useState(
    shift ? toDateInputInZone(shift.endAt, tz0) : ""
  );
  const [endTime, setEndTime] = React.useState(
    shift ? getTimeInZone(shift.endAt, tz0) : "17:00"
  );
  const [headcountRequired, setHeadcountRequired] = React.useState<number | "">(
    shift != null ? shift.headcountRequired : ""
  );
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (shift) {
      const tz = shift.location?.timezone ?? "UTC";
      setLocationId(shift.locationId);
      setSkillId(shift.skillId);
      setStartDate(toDateInputInZone(shift.startAt, tz));
      setStartTime(getTimeInZone(shift.startAt, tz));
      setEndDate(toDateInputInZone(shift.endAt, tz));
      setEndTime(getTimeInZone(shift.endAt, tz));
      setHeadcountRequired(shift.headcountRequired);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setLocationId("");
      setSkillId("");
      setStartDate(today);
      setEndDate(today);
      setStartTime("09:00");
      setEndTime("17:00");
      setHeadcountRequired("");
    }
  }, [shift, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const locationError = requiredId(locationId, "location");
    const skillError = requiredId(skillId, "skill/role");
    const validation = runValidations([
      { key: "location", error: locationError },
      { key: "skill", error: skillError },
    ]);
    if (!validation.valid) {
      setError(Object.values(validation.errors).join(" "));
      return;
    }

    const locId = locationId.trim();
    const skId = skillId.trim();
    const timezone =
      locations.find((l) => l.id === locId)?.timezone ?? "UTC";
    const startAt = localTimeInZoneToUTC(startDate, startTime, timezone);
    const endAt = localTimeInZoneToUTC(endDate, endTime, timezone);
    if (new Date(endAt) <= new Date(startAt)) {
      setError("End time must be after start time.");
      return;
    }
    const headcount =
      headcountRequired === "" || headcountRequired < 1 ? 1 : headcountRequired;
    try {
      if (isEdit && shift) {
        await updateMutation.mutateAsync({
          id: shift.id,
          data: { locationId: locId, skillId: skId, startAt, endAt, headcountRequired: headcount },
        });
      } else {
        await createMutation.mutateAsync({
          locationId: locId,
          skillId: skId,
          startAt,
          endAt,
          headcountRequired: headcount,
        });
      }
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const pending = createMutation.isPending || updateMutation.isPending;
  const canSubmit =
    locationId.trim() !== "" &&
    skillId.trim() !== "" &&
    startDate !== "" &&
    endDate !== "" &&
    headcountRequired !== "" &&
    (typeof headcountRequired !== "number" || headcountRequired >= 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={!pending}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit shift" : "New shift"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Location"
            name="location"
            required
            error={!locationId.trim() && error ? "Select a location" : undefined}
          >
            <Select
              value={locationId || undefined}
              onValueChange={(v) => setLocationId(v ?? "")}
              required
            >
              <SelectTrigger id="location" aria-invalid={!locationId.trim()}>
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
          </FormField>
          <FormField
            label="Skill / role"
            name="skill"
            required
            error={!skillId.trim() && error ? "Select a skill/role" : undefined}
          >
            <Select
              value={skillId || undefined}
              onValueChange={(v) => setSkillId(v ?? "")}
              required
            >
              <SelectTrigger id="skill" aria-invalid={!skillId.trim()}>
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start date" name="startDate" required>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Pick start date"
                required
              />
            </FormField>
            <FormField label="Start time" name="startTime" required>
              <TimePicker value={startTime} onChange={setStartTime} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="End date" name="endDate" required>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Pick end date"
                required
              />
            </FormField>
            <FormField label="End time" name="endTime" required>
              <TimePicker value={endTime} onChange={setEndTime} />
            </FormField>
          </div>
          <FormField label="Headcount required" name="headcount" required>
            <Input
              type="number"
              min={1}
              value={headcountRequired === "" ? "" : headcountRequired}
              onChange={(e) => {
                const v = e.target.value;
                setHeadcountRequired(v === "" ? "" : Number(v));
              }}
              required
            />
          </FormField>
          {error && (
            <p className="rounded-lg bg-danger/8 px-3 py-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={pending} disabled={!canSubmit}>
              {pending ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Save changes" : "Create shift")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
