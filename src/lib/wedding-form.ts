export type YesNo = "da" | "ne" | "";
export type Church = "misa" | "obred" | "";

export type WeddingFormData = {
  brideName: string;
  groomName: string;
  contactPhone: string;
  weddingDate: string;
  venue: string;
  offerNumber: string;
  price: string;
  deposit: string;
  accompanimentEnsemble: string;
  accompanimentPlace: string;
  accompanimentStartTime: string;
  ceremonyTime: string;
  singAtCeremony: YesNo;
  singWhere: string;
  photographyAfter: YesNo;
  plannedArrivalTime: string;
  entranceProtocol: string;
  firstDance: string;
  firstDinnerTime: string;
  kumSpeech: YesNo;
  prayer: YesNo;
  anthem: YesNo;
  midnightCake: string;
  midnightToast: string;
  midnightGifts: string;
  midnightBouquet: string;
  midnightExit: string;
  secondDinnerTime: string;
  protocolExtras: string;
  specialSongs: string;
  guestMix: string;
  takeRequests: YesNo;
  takeRequestsNotes: string;
  folkMusic: YesNo;
  thompson: YesNo;
  repertoireNotes: string;
  churchService: Church;
};

export const EMPTY_WEDDING_FORM: WeddingFormData = {
  brideName: "",
  groomName: "",
  contactPhone: "",
  weddingDate: "",
  venue: "",
  offerNumber: "",
  price: "",
  deposit: "",
  accompanimentEnsemble: "",
  accompanimentPlace: "",
  accompanimentStartTime: "",
  ceremonyTime: "",
  singAtCeremony: "",
  singWhere: "",
  photographyAfter: "",
  plannedArrivalTime: "",
  entranceProtocol: "",
  firstDance: "",
  firstDinnerTime: "",
  kumSpeech: "",
  prayer: "",
  anthem: "",
  midnightCake: "",
  midnightToast: "",
  midnightGifts: "",
  midnightBouquet: "",
  midnightExit: "",
  secondDinnerTime: "",
  protocolExtras: "",
  specialSongs: "",
  guestMix: "",
  takeRequests: "",
  takeRequestsNotes: "",
  folkMusic: "",
  thompson: "",
  repertoireNotes: "",
  churchService: "",
};

export function parseCouple(title: string): { bride: string; groom: string } {
  const parts = title.split(/\s*[&+]\s*|\s+i\s+/i).map((s) => s.trim()).filter(Boolean);
  return { bride: parts[0] ?? "", groom: parts[1] ?? "" };
}

export function formFromGig(input: {
  title: string;
  date: string;
  venue: string;
  city: string;
  contactPhone: string;
  fee: number | null;
  deposit: number | null;
}): WeddingFormData {
  const couple = parseCouple(input.title);
  const venue = [input.venue, input.city].filter(Boolean).join(", ");
  return {
    ...EMPTY_WEDDING_FORM,
    brideName: couple.bride,
    groomName: couple.groom,
    contactPhone: input.contactPhone,
    weddingDate: input.date,
    venue,
    price: input.fee != null ? String(input.fee) : "",
    deposit: input.deposit != null ? String(input.deposit) : "",
  };
}

export function mergeWeddingForm(
  stored: Partial<WeddingFormData> | null | undefined,
  fallback: WeddingFormData,
): WeddingFormData {
  const next = { ...fallback };
  if (!stored) return next;
  for (const key of Object.keys(EMPTY_WEDDING_FORM) as (keyof WeddingFormData)[]) {
    const value = stored[key];
    if (typeof value === "string" && value.length > 0) next[key] = value as never;
  }
  return next;
}
