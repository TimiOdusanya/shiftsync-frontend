"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { StatusTag } from "@/components/shared/StatusTag";
import { AssignStaffModal } from "./AssignStaffModal";
import { RequestSwapModal } from "./RequestSwapModal";
import { ShiftTableRowMenu } from "./ShiftTableRowMenu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, Users, MoreVertical } from "lucide-react";
import type { Shift } from "@/types";
import { usePublishShift, useUnpublishShift, useDeleteShift } from "@/hooks/useShifts";
import { useCreateDrop, useMyDrops } from "@/hooks/useDrops";
import { useSwapRequests } from "@/hooks/useSwapRequests";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

export interface ShiftTableProps {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  canManageSchedule?: boolean;
}

export function ShiftTable({ shifts, onEdit, canManageSchedule = false }: ShiftTableProps) {
  const { user: currentUser } = useAuth();
  const [assignShift, setAssignShift] = React.useState<Shift | null>(null);
  const [swapShift, setSwapShift] = React.useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = React.useState<Shift | null>(null);

  const { data: swapRequests } = useSwapRequests();
  const { data: myDrops = [] } = useMyDrops();
  const pendingDropShiftIds = React.useMemo(
    () =>
      new Set(
        myDrops
          .filter((d) => d.status === "OPEN" || d.status === "CLAIMED_PENDING_APPROVAL")
          .map((d) => d.shiftId)
      ),
    [myDrops]
  );
  const publishMutation = usePublishShift();
  const unpublishMutation = useUnpublishShift();
  const deleteMutation = useDeleteShift();
  const createDropMutation = useCreateDrop();

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3.5 font-semibold text-foreground">Shift</th>
                <th className="px-5 py-3.5 font-semibold text-foreground">Location</th>
                <th className="px-5 py-3.5 font-semibold text-foreground">Date & time</th>
                <th className="px-5 py-3.5 font-semibold text-foreground">Status</th>
                <th className="px-5 py-3.5 font-semibold text-foreground">Staff</th>
                {(canManageSchedule || currentUser) && (
                  <th className="w-12 px-3 py-3.5 text-right font-semibold text-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, index) => {
                const timezone = shift.location?.timezone ?? "UTC";
                const isDraft = shift.scheduleState === "DRAFT";
                const assignments = shift.assignments ?? [];
                const headcountFilled = assignments.length;
                const headcountRequired = shift.headcountRequired;
                const isFull = headcountFilled >= headcountRequired;
                const isAssignedToMe = assignments.some((a) => a.userId === currentUser?.id);
                const hasPendingSwapForThisShift = (swapRequests?.initiated ?? []).some(
                  (s) => s.shiftId === shift.id && (s.status === "PENDING_ACCEPTANCE" || s.status === "PENDING_APPROVAL")
                );

                return (
                  <tr
                    key={shift.id}
                    className={cn(
                      "border-b border-border/80 transition-colors last:border-b-0",
                      "hover:bg-muted/30",
                      index % 2 === 1 && "bg-muted/10"
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            isDraft ? "bg-amber-400" : "bg-primary/60"
                          )}
                          aria-hidden
                        />
                        <span className="font-medium text-foreground">
                          {shift.skill?.name ?? "Shift"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {shift.location?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0 text-info" aria-hidden />
                        <span className="tabular-nums">
                          <TimezoneDisplay utcDate={shift.startAt} timezone={timezone} />
                          <span className="mx-1.5 text-muted-foreground/60">→</span>
                          <TimezoneDisplay utcDate={shift.endAt} timezone={timezone} />
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusTag type="schedule" value={shift.scheduleState} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
                            isFull ? "bg-success/10 text-success" : "bg-muted/80 text-muted-foreground"
                          )}
                        >
                          <Users className={cn("h-3.5 w-3.5", isFull ? "text-success" : "text-primary/80")} />
                          {headcountFilled}/{headcountRequired}
                        </span>
                        {assignments.length > 0 && (
                          <div className="flex -space-x-2">
                            {assignments.slice(0, 3).map((a) => (
                              <UserAvatar
                                key={a.id}
                                firstName={a.user?.firstName ?? ""}
                                lastName={a.user?.lastName ?? ""}
                                size="sm"
                                className="h-7 w-7 text-xs ring-2 ring-card"
                              />
                            ))}
                            {assignments.length > 3 && (
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-card">
                                +{assignments.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    {(canManageSchedule || isAssignedToMe) && (
                      <td className="px-3 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Open actions menu"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <ShiftTableRowMenu
                              shift={shift}
                              canManageSchedule={canManageSchedule}
                              isAssignedToMe={isAssignedToMe}
                              hasPendingSwapForThisShift={hasPendingSwapForThisShift}
                              pendingDropShiftIds={pendingDropShiftIds}
                              onAssign={setAssignShift}
                              onEdit={onEdit}
                              onSwap={setSwapShift}
                              onDelete={setDeleteShift}
                              onDrop={(id) => createDropMutation.mutate(id)}
                              isPublishPending={publishMutation.isPending}
                              isUnpublishPending={unpublishMutation.isPending}
                              isDeletePending={deleteMutation.isPending}
                              isDropPending={createDropMutation.isPending}
                              onPublish={(id) => publishMutation.mutate(id)}
                              onUnpublish={(id) => unpublishMutation.mutate(id)}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {assignShift && (
        <AssignStaffModal
          shift={assignShift}
          open={!!assignShift}
          onOpenChange={(open) => !open && setAssignShift(null)}
        />
      )}
      {swapShift && (
        <RequestSwapModal
          shift={swapShift}
          open={!!swapShift}
          onOpenChange={(open) => !open && setSwapShift(null)}
        />
      )}
      {deleteShift && (
        <ConfirmDialog
          open={!!deleteShift}
          onOpenChange={(open) => !open && setDeleteShift(null)}
          title="Delete this shift?"
          description="This will permanently remove the shift and all its assignments. This action cannot be undone."
          confirmLabel="Delete shift"
          variant="destructive"
          onConfirm={async () => {
            if (deleteShift) await deleteMutation.mutateAsync(deleteShift.id);
            setDeleteShift(null);
          }}
        />
      )}
    </>
  );
}
