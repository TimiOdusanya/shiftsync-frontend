"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function initials(firstName: string, lastName: string): string {
  const f = firstName?.trim().charAt(0) ?? "";
  const l = lastName?.trim().charAt(0) ?? "";
  return (f + l).toUpperCase() || "?";
}

export interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ firstName, lastName, size = "md", className, ...props }: UserAvatarProps) {
  const sizeClass =
    size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  return (
    <div
      role="img"
      aria-label={`${firstName} ${lastName}`}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium",
        sizeClass,
        className
      )}
      {...props}
    >
      {initials(firstName, lastName)}
    </div>
  );
}
