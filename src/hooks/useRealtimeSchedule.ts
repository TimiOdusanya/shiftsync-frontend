"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./useSocket";
import { SOCKET_EVENTS } from "@/lib/socket";
import { shiftsKeys } from "@/services/shifts";

export function useRealtimeSchedule() {
  const { on } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubSchedule = on(SOCKET_EVENTS.SCHEDULE_UPDATED, () => {
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
    });

    const unsubShift = on(SOCKET_EVENTS.SHIFT_ASSIGNED, () => {
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
    });

    const unsubSwap = on(SOCKET_EVENTS.SWAP_STATE_CHANGE, () => {
      queryClient.invalidateQueries({ queryKey: ["swaps"] });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
    });

    const unsubDrop = on(SOCKET_EVENTS.DROP_CLAIMED, () => {
      queryClient.invalidateQueries({ queryKey: ["drops"] });
      queryClient.invalidateQueries({ queryKey: shiftsKeys() });
    });

    const unsubOnDuty = on(SOCKET_EVENTS.ON_DUTY_UPDATE, () => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "on-duty"] });
    });

    const unsubNotification = on(SOCKET_EVENTS.NOTIFICATION, () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      unsubSchedule?.();
      unsubShift?.();
      unsubSwap?.();
      unsubDrop?.();
      unsubOnDuty?.();
      unsubNotification?.();
    };
  }, [on, queryClient]);
}
