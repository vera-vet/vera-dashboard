"use client";

import { useState } from "react";
import { solicitarAcceso } from "./actions-acceso";

export function SolicitarAccesoForm({ sesionVencida = false }: { sesionVencida?: boolean }) {
  const [whatsapp, setWhatsapp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando || !whatsapp.trim()) return;
    setEnviando(true);
    await solicitarAcceso(whatsapp);
    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <p className="rounded-2xl border border-border bg-card p-4 text-sm text-vera-apoyo">
        Si tu número está registrado, te llegó un link de acceso por WhatsApp (válido 15 minutos).
      </p>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      {sesionVencida && <p className="text-sm text-vera-coral-fuerte">Tu sesión venció. Pide un link nuevo.</p>}
      <label htmlFor="tienda-whatsapp" className="block text-sm text-muted-foreground">
        Escribe tu WhatsApp para recibir tu link de acceso a la tienda.
      </label>
      <input
        id="tienda-whatsapp" type="tel" autoComplete="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
        placeholder="Ej. 7123 4567" className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm"
      />
      <button
        type="submit" disabled={enviando}
        className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Pedir acceso"}
      </button>
    </form>
  );
}
