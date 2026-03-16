"use client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserMinus, ArrowLeftRight, LogOut } from "lucide-react";
import type { ShiftAssignment } from "@/types";

interface ShiftCardAssignmentRowProps {
  assignment: ShiftAssignment;
  shiftId: string;
  canManage: boolean;
  isCurrentUser: boolean;
  hasPendingSwap: boolean;
  hasPendingDrop: boolean;
  onUnassign: (p: { shiftId: string; userId: string }) => void;
  onSwap: () => void;
  onDrop: () => void;
  isUnassignPending: boolean;
  isDropPending: boolean;
}

export function ShiftCardAssignmentRow({
  assignment,
  shiftId,
  canManage,
  isCurrentUser,
  hasPendingSwap,
  hasPendingDrop,
  onUnassign,
  onSwap,
  onDrop,
  isUnassignPending,
  isDropPending,
}: ShiftCardAssignmentRowProps) {
  const name = [assignment.user?.firstName, assignment.user?.lastName].filter(Boolean).join(" ") || "—";

  return (
    <li className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40">
      <div className="flex min-w-0 items-center gap-2.5">
        <UserAvatar
          firstName={assignment.user?.firstName ?? ""}
          lastName={assignment.user?.lastName ?? ""}
          size="sm"
        />
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {canManage && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:bg-danger/10 hover:text-danger"
                onClick={() => onUnassign({ shiftId, userId: assignment.userId })}
                disabled={isUnassignPending}
                aria-label={`Unassign ${name}`}
              >
                <UserMinus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Unassign</TooltipContent>
          </Tooltip>
        )}
        {isCurrentUser && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  onClick={onSwap}
                  disabled={hasPendingSwap}
                  aria-label="Request swap"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{hasPendingSwap ? "Swap pending" : "Request swap"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  onClick={onDrop}
                  disabled={isDropPending || hasPendingDrop}
                  aria-label={hasPendingDrop ? "You already have a drop request for this shift" : "Drop this shift"}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasPendingDrop ? "You already have a drop request for this shift" : "Drop shift"}
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </li>
  );
}
