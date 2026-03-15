"use client";

import { DataTable, type Column } from "@/components/shared/DataTable";
import type { User } from "@/types";

export interface UserListProps {
  users: User[];
  isLoading?: boolean;
}

export function UserList({ users, isLoading }: UserListProps) {
  const columns: Column<User>[] = [
    { id: "name", header: "Name", cell: (u) => `${u.firstName} ${u.lastName}` },
    { id: "email", header: "Email", cell: (u) => u.email },
    { id: "role", header: "Role", cell: (u) => u.role },
  ];
  return (
    <DataTable
      data={users}
      columns={columns}
      keyExtractor={(u) => u.id}
      isLoading={isLoading}
      emptyMessage="No users"
    />
  );
}
