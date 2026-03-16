import type { Notification } from "@/types";

const SWAP_TYPES = new Set([
  "SWAP_REQUEST",
  "SWAP_ACCEPTED",
  "SWAP_PENDING_APPROVAL",
  "SWAP_REJECTED",
  "SWAP_APPROVED",
  "SWAP_CANCELLED",
]);
const DROP_TYPES = new Set([
  "DROP_CANCELLED",
  "DROP_CLAIMED",
  "DROP_APPROVED",
  "DROP_CREATED",
  "DROP_PENDING_APPROVAL",
]);
const SCHEDULE_TYPES = new Set([
  "SHIFT_ASSIGNED",
  "SHIFT_CHANGED",
  "SCHEDULE_PUBLISHED",
]);

/**
 * Returns the path to navigate to when the user clicks this notification, or null.
 */
export function getNotificationHref(notification: Notification): string | null {
  const type = notification.type;
  const metadata = notification.metadata as Record<string, unknown> | undefined;

  if (SWAP_TYPES.has(type)) return "/swaps";
  if (DROP_TYPES.has(type)) return "/drops";
  if (SCHEDULE_TYPES.has(type)) return "/schedule";

  if (metadata?.swapId) return "/swaps";
  if (metadata?.dropRequestId) return "/drops";
  if (metadata?.shiftId != null || metadata?.locationId != null) return "/schedule";

  return null;
}
