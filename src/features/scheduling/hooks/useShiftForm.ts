"use client";

import { useState } from "react";
import { useCreateShift, useUpdateShift } from "@/hooks/useShifts";

export function useShiftForm() {
  const [open, setOpen] = useState(false);
  const createShift = useCreateShift();
  const updateShift = useUpdateShift();

  return {
    open,
    setOpen,
    createShift,
    updateShift,
    isPending: createShift.isPending || updateShift.isPending,
  };
}
