import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, timezone?: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: timezone,
  }).format(d);
}

/** Relative time for notifications, e.g. "Just now", "5m ago", "2h ago", "Yesterday", "Mar 12". */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

export function formatTime(date: string | Date, timezone?: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    timeZone: timezone,
  }).format(d);
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function toLocationTime(utcDate: string | Date, timezone: string): string {
  const d = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
  const base = { timeZone: timezone };
  const dateParts = new Intl.DateTimeFormat("en-US", {
    ...base,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).formatToParts(d);
  const yearPart = dateParts.find((p) => p.type === "year")?.value ?? "";
  const currentYearParts = new Intl.DateTimeFormat("en-US", {
    ...base,
    year: "numeric",
  }).formatToParts(new Date());
  const currentYear = currentYearParts.find((p) => p.type === "year")?.value ?? "";
  const dateStr =
    yearPart === currentYear
      ? new Intl.DateTimeFormat("en-US", {
          ...base,
          month: "short",
          day: "numeric",
        }).format(d)
      : new Intl.DateTimeFormat("en-US", {
          ...base,
          month: "short",
          day: "numeric",
          year: "2-digit",
        }).format(d);
  const timeStr = new Intl.DateTimeFormat("en-US", {
    ...base,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${dateStr}, ${timeStr}`;
}

export function getTimeInZone(utcDate: string | Date, timezone: string): string {
  const d = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${h}:${m}`;
}

export function toDateInputInZone(utcDate: string | Date, timezone: string): string {
  const d = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
  return d.toLocaleDateString("en-CA", { timeZone: timezone });
}

/**
 * Interprets (dateStr, timeStr) as a local date/time in the given IANA timezone
 * and returns the corresponding UTC moment as an ISO string.
 * Used so shift form "10:00–17:00" means 10:00–17:00 in the shift's location, not UTC.
 */
export function localTimeInZoneToUTC(
  dateStr: string,
  timeStr: string,
  timezone: string
): string {
  const [userH = 0, userM = 0] = timeStr.split(":").map(Number);
  const userMinutes = userH * 60 + userM;

  const ref = new Date(`${dateStr}T12:00:00.000Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(ref);
  const tzH = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const tzM = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const tzMinutes = tzH * 60 + tzM;

  const diffMinutes = userMinutes - tzMinutes;
  const result = new Date(ref.getTime() + diffMinutes * 60 * 1000);
  return result.toISOString();
}
