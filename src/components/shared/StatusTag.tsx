"use client";

import { Badge } from "./Badge";
import type { SwapStatus, DropStatus, ScheduleState } from "@/types";

const SWAP_LABELS: Record<SwapStatus, string> = {
  PENDING_ACCEPTANCE: "Pending acceptance",
  PENDING_APPROVAL: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const DROP_LABELS: Record<DropStatus, string> = {
  OPEN: "Open",
  CLAIMED_PENDING_APPROVAL: "Pending approval",
  APPROVED: "Approved",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

const SWAP_VARIANT: Record<SwapStatus, "default" | "secondary" | "success" | "danger" | "warning"> = {
  PENDING_ACCEPTANCE: "warning",
  PENDING_APPROVAL: "info" as "default",
  APPROVED: "success",
  REJECTED: "danger",
  CANCELLED: "secondary",
};

const DROP_VARIANT: Record<DropStatus, "default" | "secondary" | "success" | "danger" | "warning"> = {
  OPEN: "default",
  CLAIMED_PENDING_APPROVAL: "warning",
  APPROVED: "success",
  EXPIRED: "secondary",
  CANCELLED: "secondary",
};

const SCHEDULE_VARIANT: Record<ScheduleState, "default" | "secondary" | "success"> = {
  DRAFT: "secondary",
  PUBLISHED: "success",
};

type Props =
  | { type: "swap"; value: SwapStatus }
  | { type: "drop"; value: DropStatus }
  | { type: "schedule"; value: ScheduleState };

export function StatusTag(props: Props) {
  if (props.type === "swap") {
    return (
      <Badge variant={SWAP_VARIANT[props.value]}>
        {SWAP_LABELS[props.value]}
      </Badge>
    );
  }
  if (props.type === "drop") {
    return (
      <Badge variant={DROP_VARIANT[props.value]}>
        {DROP_LABELS[props.value]}
      </Badge>
    );
  }
  return (
    <Badge variant={SCHEDULE_VARIANT[props.value]}>
      {props.value === "DRAFT" ? "Draft" : "Published"}
    </Badge>
  );
}
