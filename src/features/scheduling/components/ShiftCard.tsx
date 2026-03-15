"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { StatusTag } from "@/components/shared/StatusTag";
import { AssignStaffModal } from "./AssignStaffModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UserPlus,
  Pencil,
  Trash2,
  Send,
  Undo2,
  UserMinus,
  LogOut,
  Clock,
  Users,
} from "lucide-react";
import type { Shift } from "@/types";
import { usePublishShift, useUnpublishShift, useDeleteShift } from "@/hooks/useShifts";
import { useUnassignStaff } from "@/hooks/useAssignments";
import { useCreateDrop } from "@/hooks/useDrops";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

export interface ShiftCardProps {
  shift: Shift;
  locationTimezone?: string;
  onEdit: (shift: Shift) => void;
}

function IconBtn({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7 rounded-lg", className)}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ShiftCard({
  shift,
  locationTimezone = "UTC",
  onEdit,
}: ShiftCardProps) {
  const { user: currentUser } = useAuth();
  const { canManageSchedule: canManage } = usePermissions();
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const publishMutation = usePublishShift();
  const unpublishMutation = useUnpublishShift();
  const deleteMutation = useDeleteShift();
  const unassignMutation = useUnassignStaff();
  const createDropMutation = useCreateDrop();

  const assignments = shift.assignments ?? [];
  const headcountFilled = assignments.length;
  const headcountRequired = shift.headcountRequired;
  const isFull = headcountFilled >= headcountRequired;

  const isDraft = shift.scheduleState === "DRAFT";

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden border-border",
          isDraft && "border-l-4 border-l-amber-400/80",
          !isDraft && "border-l-4 border-l-primary/60"
        )}
      >
        <CardHeader className="relative flex flex-row items-start justify-between gap-3 pb-3 pl-5 pt-5">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {shift.skill?.name ?? "Shift"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusTag type="schedule" value={shift.scheduleState} />
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                  isFull
                    ? "bg-success/10 text-success"
                    : "bg-muted/80 text-muted-foreground"
                )}
              >
                <Users className={cn("h-3.5 w-3.5", isFull ? "text-success" : "text-primary/80")} />
                {headcountFilled}/{headcountRequired}
              </span>
            </div>
          </div>
          {canManage && (
            <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted/50 p-0.5">
              <IconBtn label="Assign staff" onClick={() => setAssignOpen(true)}>
                <UserPlus className="h-3.5 w-3.5 text-primary" />
              </IconBtn>
              <IconBtn label="Edit shift" onClick={() => onEdit(shift)}>
                <Pencil className="h-3.5 w-3.5 text-primary" />
              </IconBtn>
              {isDraft ? (
                <IconBtn
                  label="Publish"
                  onClick={() => publishMutation.mutate(shift.id)}
                  disabled={publishMutation.isPending}
                >
                  <Send className="h-3.5 w-3.5 text-success" />
                </IconBtn>
              ) : (
                <IconBtn
                  label="Unpublish"
                  onClick={() => unpublishMutation.mutate(shift.id)}
                  disabled={unpublishMutation.isPending}
                >
                  <Undo2 className="h-3.5 w-3.5 text-muted-foreground" />
                </IconBtn>
              )}
              <IconBtn
                label="Delete shift"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={deleteMutation.isPending}
                className="text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
          )}
        </CardHeader>
        <CardContent className="relative space-y-3 pb-5 pl-5 pt-0">
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
            <Clock className="h-4 w-4 shrink-0 text-info" />
            <p className="text-sm font-medium text-foreground tabular-nums">
              <TimezoneDisplay utcDate={shift.startAt} timezone={locationTimezone} />
              <span className="mx-1.5 text-muted-foreground/60">→</span>
              <TimezoneDisplay utcDate={shift.endAt} timezone={locationTimezone} />
            </p>
          </div>
          {assignments.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-muted/20">
              <ul className="divide-y divide-border/60 p-1.5">
                {assignments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <UserAvatar
                        firstName={a.user?.firstName ?? ""}
                        lastName={a.user?.lastName ?? ""}
                        size="sm"
                      />
                      <span className="truncate text-sm font-medium text-foreground">
                        {a.user?.firstName} {a.user?.lastName}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      {canManage && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md text-muted-foreground hover:bg-danger/10 hover:text-danger"
                              onClick={() =>
                                unassignMutation.mutate({
                                  shiftId: shift.id,
                                  userId: a.userId,
                                })
                              }
                              disabled={unassignMutation.isPending}
                              aria-label={`Unassign ${a.user?.firstName}`}
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Unassign</TooltipContent>
                        </Tooltip>
                      )}
                      {a.userId === currentUser?.id && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                              onClick={() => createDropMutation.mutate(shift.id)}
                              disabled={createDropMutation.isPending}
                              aria-label="Drop this shift"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Drop shift</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <AssignStaffModal
        shift={shift}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete this shift?"
        description="This will permanently remove the shift and all its assignments. This action cannot be undone."
        confirmLabel="Delete shift"
        variant="destructive"
        onConfirm={() => deleteMutation.mutateAsync(shift.id)}
      />
    </>
  );
}
