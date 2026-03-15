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
} from "lucide-react";
import type { Shift } from "@/types";
import { usePublishShift, useUnpublishShift, useDeleteShift } from "@/hooks/useShifts";
import { useUnassignStaff } from "@/hooks/useAssignments";
import { useCreateDrop } from "@/hooks/useDrops";
import { useAuth } from "@/hooks/useAuth";
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
  const canManage =
    currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER";
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

  return (
    <>
      <Card className="border-border transition-shadow hover:shadow-card-hover">
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2 pt-4">
          <div>
            <p className="font-semibold text-foreground">
              {shift.skill?.name ?? "Shift"}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <StatusTag type="schedule" value={shift.scheduleState} />
              <span
                className={cn(
                  "text-xs",
                  isFull ? "text-success" : "text-muted-foreground"
                )}
              >
                {headcountFilled}/{headcountRequired} staff
              </span>
            </div>
          </div>
          {canManage && (
            <div className="flex items-center gap-0.5">
              <IconBtn label="Assign staff" onClick={() => setAssignOpen(true)}>
                <UserPlus className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="Edit shift" onClick={() => onEdit(shift)}>
                <Pencil className="h-3.5 w-3.5" />
              </IconBtn>
              {shift.scheduleState === "DRAFT" ? (
                <IconBtn
                  label="Publish"
                  onClick={() => publishMutation.mutate(shift.id)}
                  disabled={publishMutation.isPending}
                >
                  <Send className="h-3.5 w-3.5" />
                </IconBtn>
              ) : (
                <IconBtn
                  label="Unpublish"
                  onClick={() => unpublishMutation.mutate(shift.id)}
                  disabled={unpublishMutation.isPending}
                >
                  <Undo2 className="h-3.5 w-3.5" />
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
        <CardContent className="space-y-2 pb-4 pt-1 text-sm">
          <p className="text-muted-foreground">
            <TimezoneDisplay utcDate={shift.startAt} timezone={locationTimezone} />
            <span className="mx-1 text-muted-foreground/50">–</span>
            <TimezoneDisplay utcDate={shift.endAt} timezone={locationTimezone} />
          </p>
          {assignments.length > 0 && (
            <ul className="mt-2 space-y-1.5 border-t border-border pt-2">
              {assignments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      firstName={a.user?.firstName ?? ""}
                      lastName={a.user?.lastName ?? ""}
                      size="sm"
                    />
                    <span className="text-foreground">
                      {a.user?.firstName} {a.user?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {canManage && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded text-muted-foreground hover:bg-danger/10 hover:text-danger"
                            onClick={() =>
                              unassignMutation.mutate({
                                shiftId: shift.id,
                                userId: a.userId,
                              })
                            }
                            disabled={unassignMutation.isPending}
                            aria-label={`Unassign ${a.user?.firstName}`}
                          >
                            <UserMinus className="h-3 w-3" />
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
                            className="h-6 w-6 rounded text-muted-foreground hover:text-foreground"
                            onClick={() => createDropMutation.mutate(shift.id)}
                            disabled={createDropMutation.isPending}
                            aria-label="Drop this shift"
                          >
                            <LogOut className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Drop shift</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
