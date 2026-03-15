"use client";

import { useUsers } from "@/hooks/useUsers";
import { UserList } from "@/features/users/components/UserList";

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers({});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Users</h1>
      <UserList users={users} isLoading={isLoading} />
    </div>
  );
}
