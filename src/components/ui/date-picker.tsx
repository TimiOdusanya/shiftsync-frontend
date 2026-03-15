"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Format YYYY-MM-DD for display (e.g. "Mar 15, 2025"). */
function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const d = parseValue(dateStr);
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Parse YYYY-MM-DD to Date at noon local (avoids TZ shifts). */
function parseValue(dateStr: string): Date | undefined {
  if (!dateStr || dateStr.length < 10) return undefined;
  const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return undefined;
  return new Date(y, m - 1, d);
}

/** Format Date to YYYY-MM-DD. */
function toValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
  /** Min date as YYYY-MM-DD (inclusive). */
  min?: string;
  /** Max date as YYYY-MM-DD (inclusive). */
  max?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  required,
  id,
  "aria-label": ariaLabel,
  className,
  min,
  max,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = parseValue(value);
  const minDate = min ? parseValue(min) : undefined;
  const maxDate = max ? parseValue(max) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(toValue(date));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-required={required}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {value ? formatDisplay(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={(d) => {
            if (minDate && d < minDate) return true;
            if (maxDate && d > maxDate) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
