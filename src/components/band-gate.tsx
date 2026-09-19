import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bootstrapSession } from "@/lib/server/api";
import { useKapela } from "@/lib/storage";

type Membership = { role: "admin" | "member"; email: string };

const MembershipContext = createContext<Membership | null>(null);

export function useMembership() {
  return useContext(MembershipContext);
}

export function BandGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const hydrate = useKapela((s) => s.hydrate);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [status, setStatus] = useState<"boot" | "denied" | "ready">("boot");

  useEffect(() => {
    if (isPending || !user) return;
    let cancelled = false;
    void bootstrapSession()
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setStatus("denied");
          return;
        }
        setMembership({ role: res.role, email: res.email });
        setStatus("ready");
        void hydrate();
      })
      .catch(() => {
        if (!cancelled) setStatus("denied");
      });
    return () => {
      cancelled = true;
    };
  }, [hydrate, isPending, user]);

  if (pathname === "/login") return <>{children}</>;
  if (isPending || (user && status === "boot")) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-24 w-64 animate-pulse rounded-xl bg-card" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (status === "denied") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 text-center">
        <p className="font-display text-4xl">Jovalius</p>
        <h1 className="mt-6 font-display text-2xl">Nemaš pristup</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Knjiga nastupa je samo za članove benda. Zamoli admina da doda tvoju
          e-mail adresu ({user.primaryEmail ?? "ovaj račun"}) u popis članova.
        </p>
      </main>
    );
  }

  return <MembershipContext.Provider value={membership}>{children}</MembershipContext.Provider>;
}
