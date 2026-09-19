import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  Clock,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { DocumentPanel } from "@/components/document-panel";
import { GigFormDialog } from "@/components/gig-form-dialog";
import { StatusBadge } from "@/components/status-badge";
import { WeddingFormPanel } from "@/components/wedding-form-panel";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useKapela } from "@/lib/storage";
import { formatEur, formatLongDate, formatTimeRange } from "@/lib/format";
import { GIG_TYPE_LABEL } from "@/lib/types";

export const Route = createFileRoute("/gigs/$id")({
  component: GigDetail,
});

function GigDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useKapela((s) => s.hydrated);
  const gigs = useKapela((s) => s.gigs);
  const docs = useKapela((s) => s.docs);
  const deleteGig = useKapela((s) => s.deleteGig);
  const loadDocuments = useKapela((s) => s.loadDocuments);
  const gig = gigs.find((g) => g.id === id);
  const gigDocs = useMemo(
    () => docs.filter((d) => d.gigId === id).sort((a, b) => b.createdAt - a.createdAt),
    [docs, id],
  );
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    void loadDocuments(id);
  }, [id, loadDocuments]);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
      <AppHeader onNewGig={() => setNewOpen(true)} compact />

      {!hydrated ? (
        <div className="mt-10 h-64 animate-pulse rounded-xl bg-card" />
      ) : !gig ? (
        <div className="mt-16 text-center">
          <p className="font-display text-3xl">Svirka nije pronađena</p>
          <p className="mt-2 text-sm text-muted-foreground">Možda je obrisana iz kalendara.</p>
          <Button asChild className="mt-6">
            <Link to="/">Natrag na kalendar</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="no-print mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link to="/">
                <ArrowLeft className="size-4" />
                Kalendar
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Uredi
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Više radnji">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                    <Pencil className="size-4" />
                    Uredi svirku
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="size-4" />
                    Obriši svirku
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <header className="no-print mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={gig.status} />
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                {GIG_TYPE_LABEL[gig.type]}
              </span>
            </div>
            <h1 className="font-display mt-3 text-4xl leading-none sm:text-5xl">{gig.title}</h1>
            <p className="mt-3 text-base text-muted-foreground capitalize">
              {formatLongDate(gig.date)} · {formatTimeRange(gig)}
            </p>
          </header>

          <section className="no-print mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Meta
              icon={<MapPin className="size-4" />}
              label="Mjesto"
              value={gig.venue || "Nije upisano"}
              hint={[gig.address, gig.city].filter(Boolean).join(", ")}
            />
            <Meta
              icon={<Clock className="size-4" />}
              label="Trajanje"
              value={formatTimeRange(gig)}
            />
            <Meta
              icon={<User className="size-4" />}
              label="Kontakt"
              value={gig.contactName || "—"}
              hint={gig.contactPhone}
            />
            <Meta
              icon={<Banknote className="size-4" />}
              label="Naknada"
              value={formatEur(gig.fee)}
              hint={gig.deposit ? `Predujam ${formatEur(gig.deposit)}` : undefined}
            />
          </section>

          {(gig.notes || gig.setlist) && (
            <section className="no-print mt-6 grid gap-4 lg:grid-cols-2">
              {gig.notes && (
                <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                  <h2 className="font-display text-2xl">Bilješke</h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                    {gig.notes}
                  </p>
                </article>
              )}
              {gig.setlist && (
                <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                  <h2 className="font-display text-2xl">Setlista</h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                    {gig.setlist}
                  </p>
                </article>
              )}
            </section>
          )}

          <div className="mt-6">
            <WeddingFormPanel gig={gig} />
          </div>

          <div className="no-print mt-6">
            <DocumentPanel gigId={gig.id} docs={gigDocs} />
          </div>

          <GigFormDialog open={editOpen} onOpenChange={setEditOpen} gig={gig} />
          <GigFormDialog open={newOpen} onOpenChange={setNewOpen} defaultDate={gig.date} />

          <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Obrisati svirku?</AlertDialogTitle>
                <AlertDialogDescription>
                  {gig.title} i svi PDF-ovi vezani uz nju bit će uklonjeni.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Odustani</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground"
                  onClick={async () => {
                    await deleteGig(gig.id);
                    toast.success("Svirka je obrisana.");
                    await navigate({ to: "/" });
                  }}
                >
                  Obriši
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </main>
  );
}

function Meta({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm leading-snug">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
