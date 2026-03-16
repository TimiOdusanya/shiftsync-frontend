"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserPlus, Pencil, Trash2, Send, Undo2, LogOut, ArrowLeftRight } from "lucide-react";
import type { Shift } from "@/types";

interface ShiftTableRowMenuProps {
  shift: Shift;
  canManageSchedule: boolean;
  isAssignedToMe: boolean;
  hasPendingSwapForThisShift: boolean;
  pendingDropShiftIds: Set<string>;
  onAssign: (s: Shift) => void;
  onEdit: (s: Shift) => void;
  onSwap: (s: Shift) => void;
  onDelete: (s: Shift) => void;
  onDrop: (shiftId: string) => void;
  isPublishPending: boolean;
  isUnpublishPending: boolean;
  isDeletePending: boolean;
  isDropPending: boolean;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
}

export function ShiftTableRowMenu({
  shift,
  canManageSchedule,
  isAssignedToMe,
  hasPendingSwapForThisShift,
  pendingDropShiftIds,
  onAssign,
  onEdit,
  onSwap,
  onDelete,
  onDrop,
  isPublishPending,
  isUnpublishPending,
  isDeletePending,
  isDropPending,
  onPublish,
  onUnpublish,
}: ShiftTableRowMenuProps) {
  const isDraft = shift.scheduleState === "DRAFT";
  const hasPendingDrop = pendingDropShiftIds.has(shift.id);

  return (
    <>
      {canManageSchedule && (
        <>
          <DropdownMenuItem onClick={() => onAssign(shift)}>
            <UserPlus className="h-4 w-4" />
            Assign staff
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(shift)}>
            <Pencil className="h-4 w-4" />
            Edit shift
          </DropdownMenuItem>
          {isDraft ? (
            <DropdownMenuItem onClick={() => onPublish(shift.id)} disabled={isPublishPending}>
              <Send className="h-4 w-4" />
              Publish
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onUnpublish(shift.id)} disabled={isUnpublishPending}>
              <Undo2 className="h-4 w-4" />
              Unpublish
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(shift)} disabled={isDeletePending}>
            <Trash2 className="h-4 w-4" />
            Delete shift
          </DropdownMenuItem>
        </>
      )}
      {!canManageSchedule && isAssignedToMe && (
        <>
          <DropdownMenuItem onClick={() => onSwap(shift)} disabled={hasPendingSwapForThisShift}>
            <ArrowLeftRight className="h-4 w-4" />
            Request swap
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDrop(shift.id)} disabled={isDropPending || hasPendingDrop}>
            <LogOut className="h-4 w-4" />
            {hasPendingDrop ? "Drop requested" : "Drop shift"}
          </DropdownMenuItem>
        </>
      )}
      {canManageSchedule && isAssignedToMe && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSwap(shift)} disabled={hasPendingSwapForThisShift}>
            <ArrowLeftRight className="h-4 w-4" />
            Request swap
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDrop(shift.id)} disabled={isDropPending || hasPendingDrop}>
            <LogOut className="h-4 w-4" />
            {hasPendingDrop ? "Drop requested" : "Drop my assignment"}
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
