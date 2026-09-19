import { useEffect, useRef, useState } from "react";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getWeddingForm, saveWeddingForm } from "@/lib/server/api";
import {
  EMPTY_WEDDING_FORM,
  type WeddingFormData,
  type YesNo,
} from "@/lib/wedding-form";
import { cn } from "@/lib/utils";
import type { Gig } from "@/lib/types";

export function WeddingFormPanel({ gig }: { gig: Gig }) {
  const [form, setForm] = useState<WeddingFormData>(EMPTY_WEDDING_FORM);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void getWeddingForm({ data: gig.id }).then((data) => {
      if (cancelled || !data) return;
      setForm(data);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [gig.id]);

  function patch<K extends keyof WeddingFormData>(key: K, value: WeddingFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        setSaving(true);
        void saveWeddingForm({ data: { gigId: gig.id, data: next } })
          .then(() => setSaving(false))
          .catch(() => {
            setSaving(false);
            toast.error("Obrazac se nije spremio.");
          });
      }, 500);
      return next;
    });
  }

  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Obrazac za mladence</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Klikni na praznu crtu i upiši. Sprema se samo za članove benda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{saving ? "Spremam…" : ready ? "Spremljeno" : "Učitavam…"}</span>
          <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" />
            Ispiši
          </Button>
        </div>
      </div>

      <article className="obrazac mt-5 rounded-lg bg-paper px-5 py-6 text-paper-ink sm:px-8 sm:py-8">
        <header className="border-b border-paper-ink/20 pb-4 text-center">
          <p className="font-display text-3xl tracking-tight">Jovalius</p>
          <p className="mt-1 text-[11px] font-medium tracking-[0.18em] uppercase">Obrazac za mladence</p>
        </header>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Line label="Ime i prezime mladenke" value={form.brideName} onChange={(v) => patch("brideName", v)} />
          <Line label="Ime i prezime mladoženje" value={form.groomName} onChange={(v) => patch("groomName", v)} />
          <Line label="Kontakt telefon" value={form.contactPhone} onChange={(v) => patch("contactPhone", v)} />
          <Line label="Datum svadbe" value={form.weddingDate} onChange={(v) => patch("weddingDate", v)} />
          <Line
            label="Mjesto održavanja svadbe"
            value={form.venue}
            onChange={(v) => patch("venue", v)}
            className="sm:col-span-2"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <Line label="Odabrana ponuda br." value={form.offerNumber} onChange={(v) => patch("offerNumber", v)} narrow />
          <Line label="Cijena" value={form.price} onChange={(v) => patch("price", v)} narrow />
          <Line label="Predujam" value={form.deposit} onChange={(v) => patch("deposit", v)} narrow />
        </div>

        <h3 className="font-display mt-8 text-xl">1. Protokol</h3>
        <div className="mt-3 grid gap-3">
          <p className="text-sm">
            Pratnja tijekom dana: sastav{" "}
            <Blank value={form.accompanimentEnsemble} onChange={(v) => patch("accompanimentEnsemble", v)} wide />
          </p>
          <p className="text-sm">
            Mjesto i adresa{" "}
            <Blank value={form.accompanimentPlace} onChange={(v) => patch("accompanimentPlace", v)} wide />
          </p>
          <p className="text-sm">
            Točno vrijeme početka pratnje{" "}
            <Blank value={form.accompanimentStartTime} onChange={(v) => patch("accompanimentStartTime", v)} /> h
          </p>
          <p className="text-sm">
            Vjenčanje u <Blank value={form.ceremonyTime} onChange={(v) => patch("ceremonyTime", v)} /> h
            <span className="ml-3">Pjevamo na vjenčanju?</span>{" "}
            <DaNe value={form.singAtCeremony} onChange={(v) => patch("singAtCeremony", v)} />
            <span className="ml-3">Gdje?</span>{" "}
            <Blank value={form.singWhere} onChange={(v) => patch("singWhere", v)} />
          </p>
          <p className="text-sm">
            Fotografiranje nakon vjenčanja?{" "}
            <DaNe value={form.photographyAfter} onChange={(v) => patch("photographyAfter", v)} />
            <span className="ml-3">Planirani dolazak mladenaca u salu u</span>{" "}
            <Blank value={form.plannedArrivalTime} onChange={(v) => patch("plannedArrivalTime", v)} /> h
          </p>
          <Area
            label="Ulazni protokol"
            hint="Način svečanog ulaska, sudionici, redoslijed zdravice i prvog plesa"
            value={form.entranceProtocol}
            onChange={(v) => patch("entranceProtocol", v)}
          />
          <Area
            label="Prvi ples"
            hint="Točan naziv i izvođač pjesme te način izvedbe"
            value={form.firstDance}
            onChange={(v) => patch("firstDance", v)}
          />
          <p className="text-sm">
            Prva večera u <Blank value={form.firstDinnerTime} onChange={(v) => patch("firstDinnerTime", v)} /> h
          </p>
          <p className="text-sm">
            Prije večere: govor kuma? <DaNe value={form.kumSpeech} onChange={(v) => patch("kumSpeech", v)} />
            <span className="ml-3">molitva?</span> <DaNe value={form.prayer} onChange={(v) => patch("prayer", v)} />
            <span className="ml-3">himna?</span> <DaNe value={form.anthem} onChange={(v) => patch("anthem", v)} />
          </p>
          <p className="mt-2 text-sm font-medium">Redoslijed u ponoć</p>
          <Line label="Torta" value={form.midnightCake} onChange={(v) => patch("midnightCake", v)} />
          <Line label="Zdravica" value={form.midnightToast} onChange={(v) => patch("midnightToast", v)} />
          <Line
            label="Darivanje i fotografiranje"
            value={form.midnightGifts}
            onChange={(v) => patch("midnightGifts", v)}
          />
          <Line label="Buket i podvezica" value={form.midnightBouquet} onChange={(v) => patch("midnightBouquet", v)} />
          <Line
            label="Odlazak mladenaca i ponovni ulazak"
            value={form.midnightExit}
            onChange={(v) => patch("midnightExit", v)}
          />
          <p className="text-sm">
            Druga večera u <Blank value={form.secondDinnerTime} onChange={(v) => patch("secondDinnerTime", v)} /> h
          </p>
          <Area
            label="Posebni dodaci protokolu"
            value={form.protocolExtras}
            onChange={(v) => patch("protocolExtras", v)}
          />
        </div>

        <h3 className="font-display mt-8 text-xl">2. Repertoar</h3>
        <p className="mt-3 text-sm leading-relaxed text-paper-ink/80">
          Jovalius u svakom nastupu izvodi raznovrstan repertoar koji nije unaprijed predodređen, već se
          odabire na svadbi ovisno o ispunjenosti plesnog podija. Cilj je zadovoljiti prije svega mladence,
          a onda i sve goste.
        </p>
        <div className="mt-4 grid gap-3">
          <Area
            label="Ostale posebne pojedinačne pjesme"
            value={form.specialSongs}
            onChange={(v) => patch("specialSongs", v)}
          />
          <Area
            label="Broj i sastav gostiju"
            hint="npr. 250, Slavonija, Hercegovina, većina mlađe populacije"
            value={form.guestMix}
            onChange={(v) => patch("guestMix", v)}
          />
          <p className="text-sm">
            Narudžbe? <DaNe value={form.takeRequests} onChange={(v) => patch("takeRequests", v)} />{" "}
            <Blank value={form.takeRequestsNotes} onChange={(v) => patch("takeRequestsNotes", v)} wide />
          </p>
          <p className="text-sm">
            Narodna glazba (stare narodne, bez cajki i turbofolka)?{" "}
            <DaNe value={form.folkMusic} onChange={(v) => patch("folkMusic", v)} />
          </p>
          <p className="text-sm">
            Thompson (isključivo bez provokativnih pjesama)?{" "}
            <DaNe value={form.thompson} onChange={(v) => patch("thompson", v)} />
          </p>
          <Area
            label="Posebne napomene repertoaru"
            hint="bez čega ne ide / što baš i ne mora biti"
            value={form.repertoireNotes}
            onChange={(v) => patch("repertoireNotes", v)}
          />
          <p className="text-sm">
            Vjenčanje u crkvi:{" "}
            <Choice
              value={form.churchService}
              options={[
                { id: "misa" as const, label: "MISA" },
                { id: "obred" as const, label: "OBRED" },
              ]}
              onChange={(v) => patch("churchService", v)}
            />
          </p>
        </div>
      </article>
    </section>
  );
}

function Line({
  label,
  value,
  onChange,
  className,
  narrow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1 text-xs", className)}>
      <span className="text-paper-ink/60">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-0 border-b border-dotted border-paper-ink/50 bg-transparent py-1 text-sm text-paper-ink outline-none focus:border-solid",
          narrow ? "w-28" : "w-full",
        )}
      />
    </label>
  );
}

function Blank({
  value,
  onChange,
  wide,
}: {
  value: string;
  onChange: (v: string) => void;
  wide?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "mx-1 inline-block border-0 border-b border-dotted border-paper-ink/50 bg-transparent px-1 py-0.5 text-sm text-paper-ink outline-none focus:border-solid",
        wide ? "min-w-[12rem] flex-1" : "min-w-[5rem] w-24",
      )}
    />
  );
}

function Area({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-paper-ink/60">
        {label}
        {hint ? <span className="font-normal text-paper-ink/45"> — {hint}</span> : null}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-y rounded-sm border-0 border-b border-dotted border-paper-ink/50 bg-transparent py-1 text-sm text-paper-ink outline-none focus:border-solid"
      />
    </label>
  );
}

function DaNe({ value, onChange }: { value: YesNo; onChange: (v: YesNo) => void }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => onChange(value === "da" ? "" : "da")}
        className={cn("px-1", value === "da" ? "font-semibold underline" : "opacity-45")}
      >
        DA
      </button>
      <span className="opacity-40">/</span>
      <button
        type="button"
        onClick={() => onChange(value === "ne" ? "" : "ne")}
        className={cn("px-1", value === "ne" ? "font-semibold underline" : "opacity-45")}
      >
        NE
      </button>
    </span>
  );
}

function Choice<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | "";
  options: { id: T; label: string }[];
  onChange: (v: T | "") => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      {options.map((opt, i) => (
        <span key={opt.id} className="inline-flex items-center gap-1">
          {i > 0 && <span className="opacity-40">/</span>}
          <button
            type="button"
            onClick={() => onChange(value === opt.id ? "" : opt.id)}
            className={cn("px-1", value === opt.id ? "font-semibold underline" : "opacity-45")}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </span>
  );
}
