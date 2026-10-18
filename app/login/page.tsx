"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (entrando) return;
    setError(null);
    setEntrando(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
        return;
      }
      // 401: credenciales; cualquier otra cosa (503, 429…) no es culpa de quien escribe.
      setError(
        response.status === 401
          ? "Correo o contraseña incorrectos."
          : response.status === 429
            ? "Demasiados intentos. Espera unos minutos e intenta de nuevo."
            : "No pudimos conectar con Vera. Intenta de nuevo en un momento.",
      );
    } catch {
      setError("No pudimos conectar con Vera. Revisa tu conexión e intenta de nuevo.");
    }
    setEntrando(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <span className="font-display text-lg font-bold">V</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-vera-verde">Bienvenido a Vera</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ingresa para ver tu clínica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="tu@clinica.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={entrando} className="min-h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {entrando ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
