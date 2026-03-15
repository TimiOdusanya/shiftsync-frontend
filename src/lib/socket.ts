import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";

export function createSocket(token: string | null): Socket | null {
  if (!token) return null;
  return io(WS_URL, {
    auth: { token },
    path: "/socket.io",
    transports: ["websocket", "polling"],
  });
}

export const SOCKET_EVENTS = {
  SCHEDULE_UPDATED: "schedule:updated",
  SHIFT_ASSIGNED: "shift:assigned",
  SWAP_STATE_CHANGE: "swap:stateChange",
  DROP_CLAIMED: "drop:claimed",
  CONFLICT_ASSIGNMENT: "conflict:assignment",
  ON_DUTY_UPDATE: "on-duty:update",
  NOTIFICATION: "notification",
} as const;
