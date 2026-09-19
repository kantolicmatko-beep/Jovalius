import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { hr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Gig } from "@/lib/types";
import { formatMonthTitle } from "@/lib/format";

const WEEKDAYS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

type Props = {
  month: Date;
  onMonthChange: (d: Date) => void;
  selected: Date | null;
  onSelect: (d: Date | null) => void;
  gigs: Gig[];
};

export function MonthCalendar({ month, onMonthChange, selected, onSelect, gigs }: Props) {
  const monthStart = startOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1, locale: hr });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1, locale: hr });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const today = new Date();

  const gigsByDay = new Map<string, Gig[]>();
  for (const gig of gigs) {
    const list = gigsByDay.get(gig.date) ?? [];
    list.push(gig);
    gigsByDay.set(gig.date, list);
  }

  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl capitalize sm:text-3xl">
          {formatMonthTitle(month)}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Prethodni mjesec"
            onClick={() => onMonthChange(subMonths(month, 1))}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onMonthChange(today);
              onSelect(today);
            }}
          >
            Danas
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Sljedeći mjesec"
            onClick={() => onMonthChange(addMonths(month, 1))}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="pb-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase"
          >
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayGigs = gigsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, today);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const countable = dayGigs.filter((g) => g.status !== "otkazano");

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(isSelected ? null : day)}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md transition-colors duration-150",
                !inMonth && "text-muted-foreground/35",
                inMonth && "text-foreground",
                isSelected && "bg-primary text-primary-foreground",
                !isSelected && isToday && "ring-1 ring-primary/50 ring-inset",
                !isSelected && inMonth && "hover:bg-accent",
              )}
            >
              <span className="text-sm leading-none tabular-nums">{format(day, "d")}</span>
              <span className="flex h-1.5 items-center justify-center gap-0.5">
                {countable.length > 0
                  ? countable.slice(0, 3).map((g) => (
                      <span
                        key={g.id}
                        className={cn(
                          "size-1 rounded-full",
                          isSelected ? "bg-primary-foreground" : "bg-primary/80",
                          g.status === "upit" && !isSelected && "bg-warning",
                          g.status === "odradeno" && !isSelected && "bg-muted-foreground",
                        )}
                      />
                    ))
                  : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}