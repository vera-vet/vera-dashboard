"use client";

import { useState } from "react";
import { solicitarAcceso } from "./actions-acceso";

export function SolicitarAccesoForm() {
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
      <p className="text-sm text-muted-foreground">Ingresa tu WhatsApp para recibir tu link de acceso a la tienda.</p>
      <input
        type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
        placeholder="WhatsApp" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
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
