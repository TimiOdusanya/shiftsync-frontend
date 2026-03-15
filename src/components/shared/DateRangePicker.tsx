"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex flex-wrap items-end gap-4", className)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="start">Start</Label>
        <Input
          id="start"
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="end">End</Label>
        <Input
          id="end"
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </div>
    </div>
  );
}
