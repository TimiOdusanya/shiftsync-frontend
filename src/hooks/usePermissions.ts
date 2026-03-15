import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  const isAdmin = role === "ADMIN";
  const isManager = role === "MANAGER";
  const isStaff = role === "STAFF";
  const canManageSchedule = isAdmin || isManager;
  const canAccessAnalytics = isAdmin || isManager;
  const canAccessUsers = isAdmin;

  return {
    role: role ?? null,
    isAdmin,
    isManager,
    isStaff,
    canManageSchedule,
    canAccessAnalytics,
    canAccessUsers,
  };
}

export function canManageScheduleRole(role: Role | undefined): boolean {
  return role === "ADMIN" || role === "MANAGER";
}
