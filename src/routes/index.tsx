import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format, isSameMonth, parseISO, startOfMonth } from "date-fns";
import { AppHeader } from "@/components/app-header";
import { MonthCalendar } from "@/components/month-calendar";
import { GigFormDialog } from "@/components/gig-form-dialog";
import { GigList, NextGigHero } from "@/components/gig-list";
import { Button } from "@/components/ui/button";
import { useKapela } from "@/lib/storage";
import { todayIso } from "@/lib/format";
import type { Gig } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hydrated = useKapela((s) => s.hydrated);
  const gigs = useKapela((s) => s.gigs);
  const docs = useKapela((s) => s.docs);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const today = todayIso();

  const upcoming = useMemo(
    () =>
      gigs
        .filter((g) => g.date >= today && g.status !== "otkazano")
        .sort(byDate),
    [gigs, today],
  );

  const next = upcoming[0] ?? null;

  const monthGigs = useMemo(
    () => gigs.filter((g) => isSameMonth(parseISO(g.date), month)),
    [gigs, month],
  );

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selectedGigs = selectedKey
    ? gigs.filter((g) => g.date === selectedKey).sort(byDate)
    : null;

  const inquiries = gigs.filter((g) => g.status === "upit" && g.date >= today).length;
  const confirmedMonth = monthGigs.filter((g) => g.status === "potvrdeno").length;

  const listTitle = selectedKey
    ? selectedGigs && selectedGigs.length > 0
      ? "Svirke toga dana"
      : "Nema svirke"
    : "Nadolazeće";

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
      <AppHeader onNewGig={() => setFormOpen(true)} />

      {!hydrated ? (
        <HomeSkeleton />
      ) : (
        <>
          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            <Stat label="Ovaj mjesec" value={String(monthGigs.length)} hint="svirki u kalendaru" />
            <Stat
              label="Potvrđeno"
              value={String(confirmedMonth)}
              hint="u prikazanom mjesecu"
            />
            <Stat label="Otvoreni upiti" value={String(inquiries)} hint="čekaju potvrdu" />
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start">
            <MonthCalendar
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={setSelected}
              gigs={gigs}
            />

            <div className="flex flex-col gap-4">
              {next && !selectedKey && <NextGigHero gig={next} docs={docs} />}

              <section className="rounded-xl bg-card py-4 shadow-[var(--shadow-border)]">
                <div className="flex items-center justify-between px-5">
                  <h2 className="font-display text-2xl">{listTitle}</h2>
                  {selectedKey && (
                    <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                      Sve nadolazeće
                    </Button>
                  )}
                </div>
                <div className="mt-2">
                  <GigList
                    gigs={selectedGigs ?? upcoming.slice(0, 8)}
                    docs={docs}
                    empty={
                      selectedKey
                        ? "Ovaj dan je slobodan. Dodaj svirku na odabrani datum."
                        : "Nema nadolazećih svirki. Dodaj prvu u kalendar."
                    }
                  />
                </div>
                {selectedKey && (
                  <div className="px-5 pt-1 pb-2">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setFormOpen(true)}
                    >
                      Dodaj svirku {format(selected!, "d.M.")}
                    </Button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </>
      )}

      <GigFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultDate={selectedKey ?? today}
      />
    </main>
  );
}

function byDate(a: Gig, b: Gig) {
  return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)]">
      <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-display mt-2 text-3xl leading-none tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="h-96 animate-pulse rounded-xl bg-card" />
      <div className="h-80 animate-pulse rounded-xl bg-card" />
    </div>
  );
}
