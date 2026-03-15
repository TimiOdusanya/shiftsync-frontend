import { create } from "zustand";

interface ShiftInteractionState {
  selectedShiftId: string | null;
  shiftFormOpen: boolean;
  setSelectedShiftId: (id: string | null) => void;
  setShiftFormOpen: (open: boolean) => void;
  openShiftForm: (shiftId?: string | null) => void;
  closeShiftForm: () => void;
}

export const useShiftInteractionStore = create<ShiftInteractionState>((set) => ({
  selectedShiftId: null,
  shiftFormOpen: false,
  setSelectedShiftId: (selectedShiftId) => set({ selectedShiftId }),
  setShiftFormOpen: (shiftFormOpen) => set({ shiftFormOpen }),
  openShiftForm: (shiftId = null) => set({ selectedShiftId: shiftId, shiftFormOpen: true }),
  closeShiftForm: () => set({ selectedShiftId: null, shiftFormOpen: false }),
}));

export function useSelectedShiftId() {
  return useShiftInteractionStore((s) => s.selectedShiftId);
}

export function useShiftFormOpen() {
  return useShiftInteractionStore((s) => s.shiftFormOpen);
}

export function useShiftFormActions() {
  const openShiftForm = useShiftInteractionStore((s) => s.openShiftForm);
  const closeShiftForm = useShiftInteractionStore((s) => s.closeShiftForm);
  const setSelectedShiftId = useShiftInteractionStore((s) => s.setSelectedShiftId);
  const setShiftFormOpen = useShiftInteractionStore((s) => s.setShiftFormOpen);
  return { openShiftForm, closeShiftForm, setSelectedShiftId, setShiftFormOpen };
}
