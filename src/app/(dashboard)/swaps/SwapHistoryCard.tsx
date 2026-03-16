"use client";

import { StatusTag } from "@/components/shared/StatusTag";
import { TimezoneDisplay } from "@/components/shared/TimezoneDisplay";
import { formatDate } from "@/lib/utils";
import type { SwapRequest } from "@/types";

type SwapHistoryCardProps = { swap: SwapRequest };

function resolvedByLabel(swap: SwapRequest): string {
  if (swap.status === "APPROVED" && swap.managerApprovedByUser) {
    const u = swap.managerApprovedByUser;
    return `Approved by ${u.firstName} ${u.lastName}`;
  }
  if (swap.status === "REJECTED") {
    if (swap.managerRejectedByUser) {
      const u = swap.managerRejectedByUser;
      return `Declined by ${u.firstName} ${u.lastName}`;
    }
    if (swap.receiver) {
      return `Declined by ${swap.receiver.firstName} ${swap.receiver.lastName}`;
    }
    return "Declined";
  }
  return "";
}

export function SwapHistoryCard({ swap }: SwapHistoryCardProps) {
  const label = resolvedByLabel(swap);
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40 hover:border-border">
      <div className="space-y-1 text-sm">
        <p className="font-medium text-foreground">
          {swap.requester?.firstName} {swap.requester?.lastName} ↔{" "}
          {swap.receiver?.firstName} {swap.receiver?.lastName}
        </p>
        <p className="text-muted-foreground">
          {swap.shift?.skill?.name} @ {swap.shift?.location?.name} —{" "}
          <TimezoneDisplay
            utcDate={swap.shift?.startAt ?? ""}
            timezone={swap.shift?.location?.timezone ?? "UTC"}
          />
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(swap.createdAt)}</p>
        {label && (
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        )}
      </div>
      <StatusTag type="swap" value={swap.status} />
    </li>
  );
}
