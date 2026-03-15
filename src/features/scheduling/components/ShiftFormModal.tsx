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
import type { Shift } from "@/types";

function toDateInput(date: string): string {
  return date.slice(0, 10);
}
function toTimeInput(date: string): string {
  const d = new Date(date);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}
function toISO(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00.000Z`;
}

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
  const [startDate, setStartDate] = React.useState(
    shift ? toDateInput(shift.startAt) : ""
  );
  const [startTime, setStartTime] = React.useState(
    shift ? toTimeInput(shift.startAt) : "09:00"
  );
  const [endDate, setEndDate] = React.useState(
    shift ? toDateInput(shift.endAt) : ""
  );
  const [endTime, setEndTime] = React.useState(
    shift ? toTimeInput(shift.endAt) : "17:00"
  );
  const [headcountRequired, setHeadcountRequired] = React.useState(
    shift?.headcountRequired ?? 1
  );
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (shift) {
      setLocationId(shift.locationId);
      setSkillId(shift.skillId);
      setStartDate(toDateInput(shift.startAt));
      setStartTime(toTimeInput(shift.startAt));
      setEndDate(toDateInput(shift.endAt));
      setEndTime(toTimeInput(shift.endAt));
      setHeadcountRequired(shift.headcountRequired);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setStartDate(today);
      setEndDate(today);
      setStartTime("09:00");
      setEndTime("17:00");
      setHeadcountRequired(1);
    }
  }, [shift]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const startAt = toISO(startDate, startTime);
    const endAt = toISO(endDate, endTime);
    if (new Date(endAt) <= new Date(startAt)) {
      setError("End time must be after start time");
      return;
    }
    try {
      if (isEdit && shift) {
        await updateMutation.mutateAsync({
          id: shift.id,
          data: { locationId, skillId, startAt, endAt, headcountRequired },
        });
      } else {
        await createMutation.mutateAsync({
          locationId,
          skillId,
          startAt,
          endAt,
          headcountRequired,
        });
      }
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={!pending}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit shift" : "New shift"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Location" name="location" required>
            <Select value={locationId} onValueChange={setLocationId} required>
              <SelectTrigger id="location">
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
          <FormField label="Skill / role" name="skill" required>
            <Select value={skillId} onValueChange={setSkillId} required>
              <SelectTrigger id="skill">
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
              value={headcountRequired}
              onChange={(e) => setHeadcountRequired(Number(e.target.value))}
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
            <Button type="submit" loading={pending}>
              {pending ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Save changes" : "Create shift")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
