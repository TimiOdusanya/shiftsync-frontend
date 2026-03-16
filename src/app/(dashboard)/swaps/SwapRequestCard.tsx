"use client";

import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/shared/StatusTag";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { formatDate } from "@/lib/utils";
import type { SwapRequest } from "@/types";

type Variant = "pendingApproval" | "sent" | "received" | "approvedByMe";

type SwapRequestCardProps = {
  swap: SwapRequest;
  variant: Variant;
  canManage?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
  isAcceptPending?: boolean;
  isDeclinePending?: boolean;
  isCancelPending?: boolean;
};

export function SwapRequestCard({
  swap,
  variant,
  canManage = false,
  onApprove,
  onReject,
  onAccept,
  onDecline,
  onCancel,
  isApprovePending,
  isRejectPending,
  isAcceptPending,
  isDeclinePending,
  isCancelPending,
}: SwapRequestCardProps) {
  const showPendingApprovalActions =
    variant === "pendingApproval" && swap.status === "PENDING_APPROVAL";
  const showReceivedActions =
    variant === "received" && swap.status === "PENDING_ACCEPTANCE";
  const showReceivedManagerActions =
    variant === "received" && canManage && swap.status === "PENDING_APPROVAL";
  const showCancel = variant === "sent" && swap.status === "PENDING_ACCEPTANCE";

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40 hover:border-border">
      <div className="space-y-1 text-sm">
        {(variant === "pendingApproval" || variant === "approvedByMe") && (
          <p className="font-medium text-foreground">
            {swap.requester?.firstName} {swap.requester?.lastName} ↔{" "}
            {swap.receiver?.firstName} {swap.receiver?.lastName}
          </p>
        )}
        {variant === "sent" && (
          <>
            <p className="font-medium text-foreground">
              {swap.shift?.skill?.name} @ {swap.shift?.location?.name}
            </p>
            <p className="text-muted-foreground">
              <TimezoneDisplay
                utcDate={swap.shift?.startAt ?? ""}
                timezone={swap.shift?.location?.timezone ?? "UTC"}
              />
              {" → with "}
              {swap.receiver?.firstName} {swap.receiver?.lastName}
            </p>
          </>
        )}
        {variant === "received" && (
          <>
            <p className="font-medium text-foreground">
              {swap.requester?.firstName} {swap.requester?.lastName} wants to swap
            </p>
            <p className="text-muted-foreground">
              {swap.shift?.skill?.name} @ {swap.shift?.location?.name} —{" "}
              <TimezoneDisplay
                utcDate={swap.shift?.startAt ?? ""}
                timezone={swap.shift?.location?.timezone ?? "UTC"}
              />
            </p>
          </>
        )}
        {(variant === "pendingApproval" || variant === "approvedByMe") && (
          <p className="text-muted-foreground">
            {swap.shift?.skill?.name} @ {swap.shift?.location?.name} —{" "}
            <TimezoneDisplay
              utcDate={swap.shift?.startAt ?? ""}
              timezone={swap.shift?.location?.timezone ?? "UTC"}
            />
          </p>
        )}
        <p className="text-xs text-muted-foreground">{formatDate(swap.createdAt)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusTag type="swap" value={swap.status} />
        {showPendingApprovalActions && onApprove && onReject && (
          <>
            <Button size="sm" onClick={() => onApprove(swap.id)} loading={isApprovePending}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(swap.id)}
              disabled={isRejectPending}
            >
              Reject
            </Button>
          </>
        )}
        {showReceivedActions && onAccept && onDecline && (
          <>
            <Button size="sm" onClick={() => onAccept(swap.id)} loading={isAcceptPending}>
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDecline(swap.id)}
              disabled={isDeclinePending}
            >
              Decline
            </Button>
          </>
        )}
        {showReceivedManagerActions && onApprove && onReject && (
          <>
            <Button size="sm" onClick={() => onApprove(swap.id)} loading={isApprovePending}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(swap.id)}
              disabled={isRejectPending}
            >
              Reject
            </Button>
          </>
        )}
        {showCancel && onCancel && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCancel(swap.id)}
            loading={isCancelPending}
          >
            Cancel
          </Button>
        )}
      </div>
    </li>
  );
}
