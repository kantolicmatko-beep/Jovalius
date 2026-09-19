import { Badge } from "@/components/ui/badge";
import { GIG_STATUS_LABEL, type GigStatus } from "@/lib/types";
import { statusBadgeVariant } from "@/lib/status";

export function StatusBadge({ status }: { status: GigStatus }) {
  return <Badge variant={statusBadgeVariant(status)}>{GIG_STATUS_LABEL[status]}</Badge>;
}
