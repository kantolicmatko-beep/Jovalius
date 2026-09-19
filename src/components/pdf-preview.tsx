import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GigDocument } from "@/lib/types";
import { DOC_KIND_LABEL } from "@/lib/types";

export function PdfPreview({
  doc,
  onClose,
  loadBlob,
}: {
  doc: GigDocument | null;
  onClose: () => void;
  loadBlob: (id: string) => Promise<Blob | undefined>;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!doc) {
      setUrl(null);
      return;
    }
    let revoked = false;
    let objectUrl: string | null = null;
    void loadBlob(doc.id).then((blob) => {
      if (!blob || revoked) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc, loadBlob]);

  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-w-4xl flex-col p-0 sm:max-h-[92dvh]">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="pr-8">{doc?.name ?? "PDF"}</DialogTitle>
          <DialogDescription>
            {doc ? DOC_KIND_LABEL[doc.kind] : "Pregled dokumenta"}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[50vh] flex-1 bg-background px-3 pb-3 sm:px-5 sm:pb-5">
          {url ? (
            <iframe
              title={doc?.name ?? "PDF"}
              src={url}
              className="h-[70vh] w-full rounded-md bg-background"
            />
          ) : (
            <div className="flex h-[50vh] items-center justify-center text-sm text-muted-foreground">
              Učitavanje dokumenta…
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          {url && doc && (
            <Button asChild variant="secondary" size="sm">
              <a href={url} download={doc.name}>
                <Download className="size-4" />
                Preuzmi
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
            Zatvori
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
