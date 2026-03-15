import { apiClient } from "./api";
import type { Location } from "@/types";

const LOCATIONS_KEY = "locations" as const;

export function locationsKey() {
  return [LOCATIONS_KEY] as const;
}

export function locationKey(id: string) {
  return [LOCATIONS_KEY, id] as const;
}

export async function fetchLocations(): Promise<Location[]> {
  return apiClient.get<Location[]>("/locations");
}

export async function fetchLocation(id: string): Promise<Location | null> {
  return apiClient.get<Location>(`/locations/${id}`);
}
