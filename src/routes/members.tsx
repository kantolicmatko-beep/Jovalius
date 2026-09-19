import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteMember, listMembers, removeMember, revokeInvite } from "@/lib/server/api";
import { useMembership } from "@/components/band-gate";

export const Route = createFileRoute("/members")({ component: MembersPage });

function MembersPage() {
  const membership = useMembership();
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState<{ user_id: string; email: string; role: "admin" | "member" }[]>(
    [],
  );
  const [invites, setInvites] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function reload() {
    const data = await listMembers();
    setMembers(data.members);
    setInvites(data.invites);
  }

  useEffect(() => {
    if (membership?.role !== "admin") return;
    void reload().catch(() => toast.error("Popis članova nije učitan."));
  }, [membership?.role]);

  if (membership?.role !== "admin") {
    return (
      <main className="mx-auto min-h-dvh max-w-lg px-4 pt-10">
        <AppHeader compact />
        <p className="mt-16 text-center text-sm text-muted-foreground">
          Samo admin može uređivati tko vidi knjigu nastupa.
        </p>
      </main>
    );
  }

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await inviteMember({ data: email });
      setEmail("");
      await reload();
      toast.success("Pozivnica je spremljena. Ta osoba se može registrirati tim e-mailom.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Pozivnica nije poslana.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
      <AppHeader compact />
      <div className="mt-10">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Pristup
        </p>
        <h1 className="font-display mt-2 text-4xl">Članovi benda</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Samo pozvane e-mail adrese mogu vidjeti kalendar, ugovore i obrasce.
        </p>
      </div>

      <form onSubmit={onInvite} className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="email@primjer.hr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={busy}>
          Dodaj pristup
        </Button>
      </form>

      <section className="mt-10 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-2xl">Aktivni članovi</h2>
        <ul className="mt-4 divide-y divide-border">
          {members.map((m) => (
            <li key={m.user_id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm">{m.email || "bez e-maila"}</p>
                <p className="text-xs text-muted-foreground">{m.role === "admin" ? "Admin" : "Član"}</p>
              </div>
              {m.email !== membership.email && m.role !== "admin" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await removeMember({ data: m.user_id });
                    await reload();
                  }}
                >
                  Ukloni
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-2xl">Čeka registraciju</h2>
        {invites.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nema otvorenih pozivnica.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {invites.map((inv) => (
              <li key={inv} className="flex items-center justify-between gap-3 py-3">
                <p className="text-sm">{inv}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await revokeInvite({ data: inv });
                    await reload();
                  }}
                >
                  Povuci
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-8">
        <Link to="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Natrag na kalendar
        </Link>
      </p>
    </main>
  );
}
