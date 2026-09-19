import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GIG_STATUSES,
  GIG_STATUS_LABEL,
  GIG_TYPE_LABEL,
  GIG_TYPES,
  type Gig,
  type GigStatus,
  type GigType,
} from "@/lib/types";
import { todayIso } from "@/lib/format";
import { useKapela } from "@/lib/storage";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gig?: Gig | null;
  defaultDate?: string;
};

const empty = (date: string): Omit<Gig, "id" | "createdAt"> => ({
  title: "",
  type: "svadba",
  date,
  startTime: "18:00",
  endTime: "02:00",
  venue: "",
  city: "",
  address: "",
  contactName: "",
  contactPhone: "",
  fee: null,
  deposit: null,
  status: "upit",
  notes: "",
  setlist: "",
});

export function GigFormDialog({ open, onOpenChange, gig, defaultDate }: Props) {
  const upsertGig = useKapela((s) => s.upsertGig);
  const [form, setForm] = useState(empty(defaultDate || todayIso()));

  useEffect(() => {
    if (!open) return;
    if (gig) {
      const { id: _id, createdAt: _c, ...rest } = gig;
      setForm(rest);
    } else {
      setForm(empty(defaultDate || todayIso()));
    }
  }, [open, gig, defaultDate]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.title.trim().length < 2) {
      toast.error("Upiši ime para ili naziv nastupa.");
      return;
    }
    if (!form.date) {
      toast.error("Odaberi datum.");
      return;
    }
    const next: Gig = {
      ...(gig ?? { id: crypto.randomUUID(), createdAt: Date.now() }),
      ...form,
      title: form.title.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
    };
    await upsertGig(next);
    toast.success(gig ? "Svirka je spremljena." : "Svirka je dodana u kalendar.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{gig ? "Uredi svirku" : "Nova svirka"}</DialogTitle>
          <DialogDescription>
            Datum, mjesto i detalji nastupa. Dokumente dodaješ unutar svirke.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Par / naziv" htmlFor="title">
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ana & Marko"
                autoFocus
              />
            </Field>
            <Field label="Vrsta">
              <Select value={form.type} onValueChange={(v) => set("type", v as GigType)}>
                <SelectTrigger aria-label="Vrsta nastupa">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GIG_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {GIG_TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Datum" htmlFor="date">
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => set("status", v as GigStatus)}>
                <SelectTrigger aria-label="Status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GIG_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {GIG_STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Početak" htmlFor="start">
              <Input
                id="start"
                type="time"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
              />
            </Field>
            <Field label="Kraj" htmlFor="end">
              <Input
                id="end"
                type="time"
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
              />
            </Field>
            <Field label="Mjesto" htmlFor="venue">
              <Input
                id="venue"
                value={form.venue}
                onChange={(e) => set("venue", e.target.value)}
                placeholder="Restoran Dvorac"
              />
            </Field>
            <Field label="Grad" htmlFor="city">
              <Input
                id="city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Zagreb"
              />
            </Field>
            <Field label="Adresa" htmlFor="address" className="sm:col-span-2">
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>
            <Field label="Kontakt" htmlFor="contact">
              <Input
                id="contact"
                value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)}
              />
            </Field>
            <Field label="Telefon" htmlFor="phone">
              <Input
                id="phone"
                value={form.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)}
              />
            </Field>
            <Field label="Naknada (€)" htmlFor="fee">
              <Input
                id="fee"
                type="number"
                min={0}
                inputMode="numeric"
                value={form.fee ?? ""}
                onChange={(e) => set("fee", e.target.value === "" ? null : Number(e.target.value))}
              />
            </Field>
            <Field label="Predujam (€)" htmlFor="deposit">
              <Input
                id="deposit"
                type="number"
                min={0}
                inputMode="numeric"
                value={form.deposit ?? ""}
                onChange={(e) =>
                  set("deposit", e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </Field>
            <Field label="Bilješke" htmlFor="notes" className="sm:col-span-2">
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="Soundcheck, parking, posebni zahtjevi…"
              />
            </Field>
            <Field label="Setlista" htmlFor="setlist" className="sm:col-span-2">
              <Textarea
                id="setlist"
                value={form.setlist}
                onChange={(e) => set("setlist", e.target.value)}
                rows={4}
                placeholder="Prvi ples, ceremonija, after…"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Odustani
            </Button>
            <Button type="submit">{gig ? "Spremi" : "Dodaj svirku"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
