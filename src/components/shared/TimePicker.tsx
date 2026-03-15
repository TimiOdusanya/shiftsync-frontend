"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Returns time string HH:mm for use in API (ISO date + time). */
export function toTimeString(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

/** Parse HH:mm to hour (0-23) and minute (0-59). */
function parseTime(value: string): { hour: number; minute: number } {
  const fallback = { hour: 9, minute: 0 };
  if (!value || value.length < 5) return fallback;
  const [hStr, mStr] = value.split(":");
  const hour = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return fallback;
  return {
    hour: Math.min(23, Math.max(0, hour)),
    minute: Math.min(59, Math.max(0, minute)),
  };
}

/** Format hour, minute to HH:mm. */
function toHHmm(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Format HH:mm for display (24-hour, e.g. "09:00", "14:30"). */
function formatDisplay(value: string): string {
  if (!value || value.length < 5) return "";
  const { hour, minute } = parseTime(value);
  return toHHmm(hour, minute);
}

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const selectClass = cn(
  "h-10 rounded-lg border border-input bg-background pl-3 pr-8 py-2 text-sm text-foreground",
  "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
  "min-w-0"
);

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

export const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value = "",
      onChange,
      className,
      disabled,
      id,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const parsed = parseTime(value);
    const [hour, setHour] = React.useState(parsed.hour);
    const [minute, setMinute] = React.useState(parsed.minute);

    React.useEffect(() => {
      const p = parseTime(value);
      setHour(p.hour);
      setMinute(p.minute);
    }, [value]);

    const handleApply = () => {
      onChange?.(toHHmm(hour, minute));
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleApply();
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            id={id}
            aria-label={ariaLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <Clock className="mr-2 h-4 w-4 shrink-0 text-info" />
            {value ? formatDisplay(value) : "Select time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-4">
            <div
              className="flex flex-nowrap items-center gap-2"
              role="group"
              aria-label="Select time (24-hour)"
              onKeyDown={handleKeyDown}
            >
              <select
                aria-label="Hour (0-23)"
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                disabled={disabled}
                className={cn(selectClass, "w-[5.5rem]")}
              >
                {HOURS_24.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="shrink-0 text-muted-foreground font-medium">:</span>
              <select
                aria-label="Minute"
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                disabled={disabled}
                className={cn(selectClass, "w-[5.5rem]")}
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <Button type="button" size="sm" className="shrink-0" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
TimePicker.displayName = "TimePicker";
