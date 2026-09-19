import { Link } from "@tanstack/react-router";
import { FileText, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { StatusBadge } from "@/components/status-badge";
import { GIG_TYPE_LABEL, type Gig, type GigDocument } from "@/lib/types";
import { formatTimeRange } from "@/lib/format";
import { cn } from "@/lib/utils";

export function GigRow({
  gig,
  docs,
  compact,
}: {
  gig: Gig;
  docs: GigDocument[];
  compact?: boolean;
}) {
  const day = parseISO(gig.date);
  const count = docs.filter((d) => d.gigId === gig.id).length;

  return (
    <Link
      to="/gigs/$id"
      params={{ id: gig.id }}
      className={cn(
        "group flex gap-4 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-accent",
        compact && "px-2 py-2.5",
      )}
    >
      <div className="flex w-12 shrink-0 flex-col items-center pt-0.5">
        <span className="font-display text-2xl leading-none tabular-nums">{format(day, "d")}</span>
        <span className="mt-1 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          {format(day, "LLL", { locale: hr })}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-xl leading-tight">{gig.title}</p>
          <StatusBadge status={gig.status} />
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {GIG_TYPE_LABEL[gig.type]}
          {gig.venue ? ` · ${gig.venue}` : ""}
          {gig.city ? `, ${gig.city}` : ""}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{formatTimeRange(gig)}</span>
          {count > 0 && (
            <span className="inline-flex items-center gap-1">
              <FileText className="size-3" />
              {count} {count === 1 ? "dokument" : "dokumenta"}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

export function GigList({
  gigs,
  docs,
  empty,
}: {
  gigs: Gig[];
  docs: GigDocument[];
  empty: string;
}) {
  if (gigs.length === 0) {
    return <p className="px-3 py-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {gigs.map((gig) => (
        <li key={gig.id}>
          <GigRow gig={gig} docs={docs} />
        </li>
      ))}
    </ul>
  );
}

export function NextGigHero({ gig, docs }: { gig: Gig; docs: GigDocument[] }) {
  const count = docs.filter((d) => d.gigId === gig.id).length;
  const day = parseISO(gig.date);
  return (
    <Link
      to="/gigs/$id"
      params={{ id: gig.id }}
      className="block rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
    >
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        Sljedeća svirka
      </p>
      <h2 className="font-display mt-3 text-3xl leading-none">{gig.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground capitalize">
        {format(day, "EEEE, d. MMMM", { locale: hr })} · {formatTimeRange(gig)}
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm text-foreground/80">
        <MapPin className="size-3.5 text-muted-foreground" />
        <span>
          {gig.venue}
          {gig.city ? ` · ${gig.city}` : ""}
        </span>
      </p>
      <div className="mt-4 flex items-center gap-2">
        <StatusBadge status={gig.status} />
        <span className="text-xs text-muted-foreground">
          {GIG_TYPE_LABEL[gig.type]}
          {count > 0 ? ` · ${count} PDF` : ""}
        </span>
      </div>
    </Link>
  );
}
