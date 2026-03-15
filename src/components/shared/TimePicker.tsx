"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CUSTOM_VALUE = "__custom__";

/** Preset times from 00:00 to 23:30 in 30-min steps. */
function getPresetTimes(): string[] {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times;
}

const PRESETS = getPresetTimes();

/** Returns time string HH:mm for use in API (ISO date + time). */
export function toTimeString(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

export interface TimePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value?: string;
  onChange?: (value: string) => void;
}

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ value = "", onChange, className, disabled, id, ...props }, ref) => {
    const isPreset = value && PRESETS.includes(value);
    const selectValue = isPreset ? value : CUSTOM_VALUE;
    const [customTime, setCustomTime] = React.useState(value && !isPreset ? value : "09:00");

    const displayValue = isPreset ? value : customTime;

    const handleSelectChange = (v: string) => {
      if (v === CUSTOM_VALUE) {
        onChange?.(customTime);
      } else {
        onChange?.(v);
      }
    };

    const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setCustomTime(v);
      onChange?.(v);
    };

    React.useEffect(() => {
      if (!isPreset && value) setCustomTime(value);
    }, [value, isPreset]);

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)}>
        <Select
          value={selectValue}
          onValueChange={handleSelectChange}
          disabled={disabled}
        >
          <SelectTrigger id={id} className="w-full">
            <Clock className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
            <SelectItem value={CUSTOM_VALUE}>Custom</SelectItem>
          </SelectContent>
        </Select>
        {selectValue === CUSTOM_VALUE && (
          <Input
            type="time"
            value={displayValue}
            onChange={handleCustomTimeChange}
            disabled={disabled}
            className="w-full"
            {...props}
          />
        )}
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";
