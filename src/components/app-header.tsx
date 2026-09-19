import { Link } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/lib/auth/gates";
import { useMembership } from "@/components/band-gate";

export function AppHeader({
  onNewGig,
  compact,
}: {
  onNewGig?: () => void;
  compact?: boolean;
}) {
  const membership = useMembership();
  return (
    <header className="no-print flex items-center justify-between gap-4">
      <Link to="/" className="group flex min-w-0 items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-card shadow-[var(--shadow-border)]">
          <Mark />
        </span>
        <span>
          <p className="font-display text-3xl leading-none tracking-tight">Jovalius</p>
          {!compact && (
            <p className="mt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Knjiga nastupa
            </p>
          )}
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        {membership?.role === "admin" && (
          <Button variant="ghost" size="icon-sm" asChild aria-label="Članovi">
            <Link to="/members">
              <Users />
            </Link>
          </Button>
        )}
        {onNewGig && (
          <Button onClick={onNewGig} className="shrink-0">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nova svirka</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-primary" aria-hidden>
      <rect x="4" y="7" width="2.2" height="10" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="10" y="4" width="2.2" height="16" rx="1" fill="currentColor" />
      <rect x="16" y="9" width="2.2" height="8" rx="1" fill="currentColor" opacity="0.75" />
    </svg>
  );
}
