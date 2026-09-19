import { format, parseISO, isValid } from "date-fns";
import { hr } from "date-fns/locale";
import type { Gig } from "@/lib/types";

export function parseGigDate(iso: string): Date {
  const d = parseISO(iso);
  return isValid(d) ? d : new Date();
}

export function formatLongDate(iso: string): string {
  return format(parseGigDate(iso), "EEEE, d. MMMM yyyy.", { locale: hr });
}

export function formatShortDate(iso: string): string {
  return format(parseGigDate(iso), "d. MMM", { locale: hr });
}

export function formatMonthTitle(date: Date): string {
  return format(date, "LLLL yyyy", { locale: hr });
}

export function formatWeekday(date: Date): string {
  return format(date, "EEEEEE", { locale: hr });
}

export function formatTimeRange(gig: Pick<Gig, "startTime" | "endTime">): string {
  if (!gig.startTime && !gig.endTime) return "Vrijeme nije upisano";
  if (gig.startTime && gig.endTime) return `${gig.startTime}–${gig.endTime}`;
  return gig.startTime || gig.endTime;
}

export function formatEur(amount: number | null): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function todayIso(): string {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
