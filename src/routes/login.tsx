import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/" });
    }
  }, [isPending, user, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0] || "Član",
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (err) throw new Error(err.message ?? "Registracija nije uspjela.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (err) throw new Error(err.message ?? "Prijava nije uspjela.");
      }
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nešto je pošlo po krivu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="font-display text-center text-4xl tracking-tight">Jovalius</p>
        <p className="mt-2 text-center text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Knjiga nastupa
        </p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pristup imaju samo članovi benda.
        </p>

        {authEnabled ? (
          <>
            <div className="mt-8 grid grid-cols-2 rounded-lg bg-card p-1 shadow-[var(--shadow-border)]">
              <button
                type="button"
                className={`h-10 rounded-md text-sm ${mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setMode("signin")}
              >
                Prijava
              </button>
              <button
                type="button"
                className={`h-10 rounded-md text-sm ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setMode("signup")}
              >
                Registracija
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid gap-3">
              {mode === "signup" && (
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Ime</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="grid gap-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="mt-1 w-full">
                {busy ? "Pričekaj…" : mode === "signup" ? "Registriraj se" : "Prijavi se"}
              </Button>
            </form>

           
            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              Nakon registracije pristup dobiješ samo ako te admin doda na popis.
              Prva osoba koja se prijavi postaje admin benda.
            </p>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-muted-foreground">Prijava je isključena.</p>
        )}
      </div>
    </main>
  );
}
