"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { activarCuenta } from "./actions";

export function ActivarForm({ uid, token, email }: { uid: string; token: string; email: string }) {
  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (password !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setGuardando(true);
    setError(null);
    const resultado = await activarCuenta(uid, token, password);
    setGuardando(false);
    if (resultado.ok) setListo(true);
    else setError(resultado.mensaje ?? "No se pudo guardar. Intenta de nuevo.");
  }

  if (listo) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm" role="status">Listo. Ya puedes entrar con {email} y tu contraseña nueva.</p>
        <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
          Entrar a Vera
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <p className="text-sm text-muted-foreground">Cuenta: <span className="font-semibold text-foreground">{email}</span></p>
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña nueva</Label>
        <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <p className="text-xs text-muted-foreground">Al menos 8 caracteres, que no sean solo números ni algo fácil de adivinar.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmacion">Confírmala</Label>
        <Input id="confirmacion" type="password" autoComplete="new-password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} required />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={guardando} className="min-h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {guardando ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
