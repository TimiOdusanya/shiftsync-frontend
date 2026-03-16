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
import { useCreateSwap } from "@/hooks/useSwapRequests";
import { useAssignmentAlternatives } from "@/hooks/useAssignments";
import { useAuth } from "@/hooks/useAuth";
import { requiredId } from "@/lib/validation";
import type { Shift } from "@/types";

export interface RequestSwapModalProps {
  shift: Shift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestSwapModal({ shift, open, onOpenChange }: RequestSwapModalProps) {
  const { user: currentUser } = useAuth();
  const [receiverId, setReceiverId] = React.useState("");
  const [error, setError] = React.useState("");

  const { data: alternatives = [] } = useAssignmentAlternatives(shift?.id ?? null);
  const createSwap = useCreateSwap();

  const receivers = alternatives.filter((a) => a.userId !== currentUser?.id);

  const reset = React.useCallback(() => {
    setReceiverId("");
    setError("");
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
    setError("");

    const staffError = requiredId(receiverId, "a staff member to swap with");
    if (staffError) {
      setError(staffError);
      return;
    }

    try {
      const result = await createSwap.mutateAsync({
        shiftId: shift.id,
        receiverId: receiverId.trim(),
      });
      if (result.success) {
        handleOpenChange(false);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showClose={!createSwap.isPending}>
        <DialogHeader>
          <DialogTitle>Request swap</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {shift && (
            <p className="text-sm text-muted-foreground">
              {shift.skill?.name} @ {shift.location?.name}
            </p>
          )}
          <FormField
            label="Swap with"
            name="receiver"
            required
            error={error || undefined}
          >
            <Select
              value={receiverId || undefined}
              onValueChange={(v) => setReceiverId(v ?? "")}
              required
            >
              <SelectTrigger id="receiver" aria-invalid={!!error}>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {receivers.map((o) => (
                  <SelectItem key={o.userId} value={o.userId}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          {receivers.length === 0 && shift && (
            <p className="text-sm text-muted-foreground">
              No other qualified staff available for this shift.
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createSwap.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!receiverId || createSwap.isPending || receivers.length === 0}
              loading={createSwap.isPending}
            >
              {createSwap.isPending ? "Sending…" : "Request swap"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
