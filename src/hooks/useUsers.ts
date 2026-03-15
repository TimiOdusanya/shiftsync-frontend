"use client";

import { useQuery } from "@tanstack/react-query";
import { usersKey, fetchUsers } from "@/services/users";

export function useUsers(filters?: { role?: string; locationId?: string }) {
  return useQuery({
    queryKey: usersKey(filters),
    queryFn: () => fetchUsers(filters),
  });
}
