"use client";

import * as React from "react";
import { toLocationTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface TimezoneDisplayProps {
  utcDate: string | Date;
  timezone: string;
  className?: string;
}

export function TimezoneDisplay({ utcDate, timezone, className }: TimezoneDisplayProps) {
  const formatted = toLocationTime(utcDate, timezone);
  return <span className={cn(className)}>{formatted}</span>;
}
