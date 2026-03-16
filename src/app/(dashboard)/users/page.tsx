"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { UserList } from "@/features/users/components/UserList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "__all__", label: "All roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "STAFF", label: "Staff" },
] as const;

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { canAccessUsers } = usePermissions();
  const [roleFilter, setRoleFilter] = useState<string>("__all__");
  const filters = roleFilter === "__all__" ? {} : { role: roleFilter };
  const { data: users = [], isLoading } = useUsers(filters);

  useEffect(() => {
    if (user != null && !canAccessUsers) router.replace("/schedule");
  }, [user, canAccessUsers, router]);

  if (user != null && !canAccessUsers) return null;

  return (
    <div className="space-y-6">
      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <Users className="mt-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" aria-hidden />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">Users</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage team members and roles</p>
          </div>
        </div>
        <div className="w-full sm:w-40">
          <Label htmlFor="role-filter" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Filter by role
          </Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger id="role-filter" className="h-9">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <UserList users={users} isLoading={isLoading} />
    </div>
  );
}
