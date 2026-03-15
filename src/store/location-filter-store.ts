import { create } from "zustand";

interface LocationFilterState {
  locationId: string;
  setLocationId: (id: string) => void;
}

export const useLocationFilterStore = create<LocationFilterState>((set) => ({
  locationId: "",
  setLocationId: (id) => set({ locationId: id }),
}));

export function useLocationFilter() {
  const locationId = useLocationFilterStore((s) => s.locationId);
  const setLocationId = useLocationFilterStore((s) => s.setLocationId);
  return { locationId, setLocationId };
}
