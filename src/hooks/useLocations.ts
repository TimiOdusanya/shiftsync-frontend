"use client";

import { useQuery } from "@tanstack/react-query";
import { locationsKey, locationKey, fetchLocations, fetchLocation } from "@/services/locations";

export function useLocations() {
  return useQuery({
    queryKey: locationsKey(),
    queryFn: fetchLocations,
  });
}

export function useLocation(id: string | null) {
  return useQuery({
    queryKey: locationKey(id!),
    queryFn: () => fetchLocation(id!),
    enabled: !!id,
  });
}
