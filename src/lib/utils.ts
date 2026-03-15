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
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}
