export const GIG_TYPES = [
  "svadba",
  "krstenje",
  "korporativ",
  "koncert",
  "privatna",
  "ostalo",
] as const;

export type GigType = (typeof GIG_TYPES)[number];

export const GIG_STATUSES = [
  "upit",
  "potvrdeno",
  "odradeno",
  "otkazano",
] as const;

export type GigStatus = (typeof GIG_STATUSES)[number];

export const DOC_KINDS = [
  "ugovor",
  "predracun",
  "racun",
  "setlista",
  "rider",
  "tlocrt",
  "ostalo",
] as const;

export type DocKind = (typeof DOC_KINDS)[number];

export type Gig = {
  id: string;
  title: string;
  type: GigType;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  address: string;
  contactName: string;
  contactPhone: string;
  fee: number | null;
  deposit: number | null;
  status: GigStatus;
  notes: string;
  setlist: string;
  createdAt: number;
};

export type GigDocument = {
  id: string;
  gigId: string;
  name: string;
  kind: DocKind;
  mimeType: string;
  size: number;
  createdAt: number;
};

export type GigDocumentRecord = GigDocument & { blob: Blob };

export const GIG_TYPE_LABEL: Record<GigType, string> = {
  svadba: "Svadba",
  krstenje: "Krštenje",
  korporativ: "Korporativ",
  koncert: "Koncert",
  privatna: "Privatna proslava",
  ostalo: "Ostalo",
};

export const GIG_STATUS_LABEL: Record<GigStatus, string> = {
  upit: "Upit",
  potvrdeno: "Potvrđeno",
  odradeno: "Odrađeno",
  otkazano: "Otkazano",
};

export const DOC_KIND_LABEL: Record<DocKind, string> = {
  ugovor: "Ugovor",
  predracun: "Predračun",
  racun: "Račun",
  setlista: "Setlista",
  rider: "Tehnički rider",
  tlocrt: "Tlocrt sale",
  ostalo: "Ostalo",
};

export const MAX_PDF_BYTES = 8 * 1024 * 1024;
