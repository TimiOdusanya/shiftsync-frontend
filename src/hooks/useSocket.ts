"use client";

import { useEffect, useRef, useState } from "react";
import { createSocket, SOCKET_EVENTS } from "@/lib/socket";
import { getStoredToken } from "@/services/auth";

export type SocketEventHandler = (payload: unknown) => void;

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<ReturnType<typeof createSocket>>(null);
  const listenersRef = useRef<Map<string, Set<SocketEventHandler>>>(new Map());

  useEffect(() => {
    const token = getStoredToken();
    const socket = createSocket(token);
    if (!socket) return;

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    const events = [
      SOCKET_EVENTS.SCHEDULE_UPDATED,
      SOCKET_EVENTS.SHIFT_ASSIGNED,
      SOCKET_EVENTS.SWAP_STATE_CHANGE,
      SOCKET_EVENTS.DROP_CLAIMED,
      SOCKET_EVENTS.CONFLICT_ASSIGNMENT,
      SOCKET_EVENTS.ON_DUTY_UPDATE,
      SOCKET_EVENTS.NOTIFICATION,
    ] as const;

    events.forEach((event) => {
      socket.on(event, (payload: unknown) => {
        listenersRef.current.get(event)?.forEach((fn) => fn(payload));
      });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, []);

  const on = (event: string, handler: SocketEventHandler) => {
    if (!listenersRef.current.has(event)) listenersRef.current.set(event, new Set());
    listenersRef.current.get(event)!.add(handler);
    return () => listenersRef.current.get(event)?.delete(handler);
  };

  const emit = (event: string, ...args: unknown[]) => {
    socketRef.current?.emit(event, ...args);
  };

  return { connected, on, emit };
}
