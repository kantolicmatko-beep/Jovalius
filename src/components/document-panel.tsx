import { useCallback, useRef, useState } from "react";
import { Download, Eye, FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PdfPreview } from "@/components/pdf-preview";
import { useKapela } from "@/lib/storage";
import { inferDocKind } from "@/lib/sample-pdf";
import { formatBytes, cn } from "@/lib/utils";
import {
  DOC_KIND_LABEL,
  DOC_KINDS,
  MAX_PDF_BYTES,
  type DocKind,
  type GigDocument,
} from "@/lib/types";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

export function DocumentPanel({ gigId, docs }: { gigId: string; docs: GigDocument[] }) {
  const addDocument = useKapela((s) => s.addDocument);
  const deleteDocument = useKapela((s) => s.deleteDocument);
  const getDocumentBlob = useKapela((s) => s.getDocumentBlob);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<GigDocument | null>(null);
  const [pendingKind, setPendingKind] = useState<DocKind>("ostalo");
  const [toDelete, setToDelete] = useState<GigDocument | null>(null);
  const [busy, setBusy] = useState(false);

  const onFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;
      setBusy(true);
      try {
        for (const file of list) {
          const isPdf =
            file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
          if (!isPdf) {
            toast.error(`${file.name} nije PDF.`);
            continue;
          }
          if (file.size > MAX_PDF_BYTES) {
            toast.error(`${file.name} je veći od 8 MB.`);
            continue;
          }
          const kind = pendingKind === "ostalo" ? inferDocKind(file.name) : pendingKind;
          await addDocument(gigId, file, kind);
        }
        toast.success("Dokument je spremljen uz ovu svirku.");
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [addDocument, gigId, pendingKind],
  );

  async function download(doc: GigDocument) {
    const blob = await getDocumentBlob(doc.id);
    if (!blob) {
      toast.error("Datoteka nije pronađena.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Dokumenti</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ugovori, predračuni, setliste i rideri vezani uz ovu svirku.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={pendingKind} onValueChange={(v) => setPendingKind(v as DocKind)}>
            <SelectTrigger className="h-9 w-40" aria-label="Vrsta dokumenta">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {DOC_KIND_LABEL[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void onFiles(e.dataTransfer.files);
        }}
        className={cn(
          "mt-5 flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors duration-150",
          dragOver ? "border-primary bg-accent" : "border-border bg-background/40",
        )}
      >
        <Upload className="size-5 text-muted-foreground" />
        <p className="mt-2 text-sm">Povuci PDF ovdje ili odaberi datoteku</p>
        <p className="mt-1 text-xs text-muted-foreground">Do 8 MB po dokumentu</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void onFiles(e.target.files);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-4"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          Odaberi PDF
        </Button>
      </div>

      {docs.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Još nema dokumenata za ovu svirku.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {docs.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 py-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent">
                <FileText className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{DOC_KIND_LABEL[doc.kind]}</Badge>
                  <span>{formatBytes(doc.size)}</span>
                  <span>
                    {format(doc.createdAt, "d. MMM yyyy.", { locale: hr })}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Pregledaj"
                  onClick={() => setPreview(doc)}
                >
                  <Eye />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Preuzmi"
                  onClick={() => void download(doc)}
                >
                  <Download />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Obriši dokument"
                  onClick={() => setToDelete(doc)}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PdfPreview
        doc={preview}
        onClose={() => setPreview(null)}
        loadBlob={getDocumentBlob}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obrisati dokument?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.name} bit će uklonjen s ove svirke.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={async () => {
                if (!toDelete) return;
                await deleteDocument(toDelete.id);
                setToDelete(null);
                toast.success("Dokument je obrisan.");
              }}
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
