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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignStaff } from "@/hooks/useAssignments";
import { useUsers } from "@/hooks/useUsers";
import { t } from "@/lib/toast";
import { requiredId } from "@/lib/validation";
import type { Shift, ConstraintViolation } from "@/types";

export interface AssignStaffModalProps {
  shift: Shift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignStaffModal({ shift, open, onOpenChange }: AssignStaffModalProps) {
  const [userId, setUserId] = React.useState("");
  const [overrideReason, setOverrideReason] = React.useState("");
  const [violation, setViolation] = React.useState<ConstraintViolation | null>(null);
  const assignMutation = useAssignStaff();
  const { data: users = [] } = useUsers({});
  const staffOptions = violation?.alternatives?.length
    ? violation.alternatives.map((a) => ({ id: a.userId, name: a.name }))
    : users.map((u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }));

  const needsOverrideReason = violation?.rule === "OVERTIME" && violation?.message?.includes("overrideReason");

  const reset = React.useCallback(() => {
    setUserId("");
    setOverrideReason("");
    setViolation(null);
  }, []);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) reset();
      onOpenChange(next);
    },
    [onOpenChange, reset]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!shift) return;
    setViolation(null);

    const staffError = requiredId(userId, "a staff member");
    if (staffError) {
      setViolation({ rule: "REQUIRED", message: staffError });
      return;
    }

    if (needsOverrideReason && !overrideReason.trim()) {
      setViolation({
        rule: "OVERTIME",
        message: "Override reason is required for 7th consecutive day.",
      });
      return;
    }

    try {
      const result = await assignMutation.mutateAsync({
        shiftId: shift.id,
        userId: userId.trim(),
        overrideReason: needsOverrideReason ? overrideReason.trim() : undefined,
      });
      if (result.success) {
        t.success("Staff assigned successfully");
        handleOpenChange(false);
      } else if (result.violation) {
        setViolation(result.violation);
      }
    } catch (err) {
      const e = err as Error & { violation?: ConstraintViolation };
      if (e.violation) setViolation(e.violation);
      else setViolation({ rule: "ERROR", message: e.message });
    }
  }

  const canAssign = userId && shift && (!needsOverrideReason || !!overrideReason.trim());

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showClose={!assignMutation.isPending}>
        <DialogHeader>
          <DialogTitle>Assign staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {shift && (
            <p className="text-sm text-muted-foreground">
              {shift.skill?.name} — {shift.location?.name}
            </p>
          )}
          <FormField
            label="Staff member"
            name="staff"
            required
            error={violation?.message}
          >
            <Select
              value={userId || undefined}
              onValueChange={(v) => setUserId(v ?? "")}
              required
            >
              <SelectTrigger id="staff" aria-invalid={!!violation}>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staffOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          {violation?.alternatives && violation.alternatives.length > 0 && (
            <p className="rounded-lg bg-warning/8 px-3 py-2 text-xs text-warning">
              Suggested alternatives: {violation.alternatives.map((a) => a.name).join(", ")}
            </p>
          )}
          {needsOverrideReason && (
            <FormField
              label="Override reason (required for 7th consecutive day)"
              name="overrideReason"
            >
              <input
                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Documented reason for override"
              />
            </FormField>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={assignMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canAssign}
              loading={assignMutation.isPending}
            >
              {assignMutation.isPending ? "Assigning…" : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
