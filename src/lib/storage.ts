import { create } from "zustand";
import type { DocKind, Gig, GigDocument } from "@/lib/types";
import {
  addDocument as addDocumentFn,
  deleteDocument as deleteDocumentFn,
  deleteGig as deleteGigFn,
  getDocumentContent,
  listDocuments,
  listGigs,
  upsertGig as upsertGigFn,
} from "@/lib/server/api";

function base64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime || "application/pdf" });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export type KapelaState = {
  hydrated: boolean;
  gigs: Gig[];
  docs: GigDocument[];
  hydrate: () => Promise<void>;
  upsertGig: (gig: Gig) => Promise<void>;
  deleteGig: (id: string) => Promise<void>;
  loadDocuments: (gigId: string) => Promise<void>;
  addDocument: (gigId: string, file: File, kind: DocKind) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentBlob: (id: string) => Promise<Blob | undefined>;
};

export const useKapela = create<KapelaState>((set, get) => ({
  hydrated: false,
  gigs: [],
  docs: [],

  hydrate: async () => {
    const gigs = await listGigs();
    set({ hydrated: true, gigs });
  },

  upsertGig: async (gig) => {
    const { createdAt: _c, ...write } = gig;
    void _c;
    await upsertGigFn({ data: write });
    const gigs = [...get().gigs.filter((g) => g.id !== gig.id), gig].sort(
      (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
    );
    set({ gigs });
  },

  deleteGig: async (id) => {
    await deleteGigFn({ data: id });
    set({
      gigs: get().gigs.filter((g) => g.id !== id),
      docs: get().docs.filter((d) => d.gigId !== id),
    });
  },

  loadDocuments: async (gigId) => {
    const list = await listDocuments({ data: gigId });
    set({
      docs: [...get().docs.filter((d) => d.gigId !== gigId), ...list],
    });
  },

  addDocument: async (gigId, file, kind) => {
    const contentBase64 = await fileToBase64(file);
    const doc = await addDocumentFn({
      data: {
        gigId,
        name: file.name,
        kind,
        mimeType: file.type || "application/pdf",
        size: file.size,
        contentBase64,
      },
    });
    set({ docs: [doc, ...get().docs.filter((d) => d.id !== doc.id)] });
  },

  deleteDocument: async (id) => {
    await deleteDocumentFn({ data: id });
    set({ docs: get().docs.filter((d) => d.id !== id) });
  },

  getDocumentBlob: async (id) => {
    const row = await getDocumentContent({ data: id });
    if (!row) return undefined;
    return base64ToBlob(row.content_base64, row.mime_type);
  },
}));
