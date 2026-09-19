import type { GigStatus } from "@/lib/types";

export function statusBadgeVariant(
  status: GigStatus,
): "success" | "warning" | "muted" | "destructive" {
  switch (status) {
    case "potvrdeno":
      return "success";
    case "upit":
      return "warning";
    case "otkazano":
      return "destructive";
    default:
      return "muted";
  }
}
