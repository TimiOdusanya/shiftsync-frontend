"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { UserList } from "@/features/users/components/UserList";
import { Users } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { canAccessUsers } = usePermissions();
  const { data: users = [], isLoading } = useUsers({});

  useEffect(() => {
    if (user != null && !canAccessUsers) router.replace("/schedule");
  }, [user, canAccessUsers, router]);

  if (user != null && !canAccessUsers) return null;

  return (
    <div className="space-y-6">
      <header className="flex min-w-0 items-start gap-2 sm:gap-3">
        <Users className="mt-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" aria-hidden />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 tracking-tight text-foreground sm:text-lg">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage team members and roles</p>
        </div>
      </header>
      <UserList users={users} isLoading={isLoading} />
    </div>
  );
}
