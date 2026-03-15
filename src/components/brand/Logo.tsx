"use client";

import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeMap = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };
const textSizeMap = { sm: "text-base", md: "text-lg", lg: "text-2xl" };

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", sizeMap[size])}
        aria-hidden
      >
        <rect width="36" height="36" rx="9" fill="hsl(224 71% 24%)" />
        <path
          d="M11 10h6a1 1 0 011 1v14a1 1 0 01-1 1h-6a1 1 0 01-1-1V11a1 1 0 011-1z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M19 15h6a1 1 0 011 1v9a1 1 0 01-1 1h-6a1 1 0 01-1-1v-9a1 1 0 011-1z"
          fill="white"
          fillOpacity="0.55"
        />
        <circle cx="24" cy="11.5" r="3" fill="hsl(160 84% 39%)" />
      </svg>
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            textSizeMap[size]
          )}
        >
          ShiftSync
        </span>
      )}
    </div>
  );
}
