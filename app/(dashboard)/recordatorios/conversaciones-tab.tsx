"use client";

import { useState } from "react";
import type { Conversacion } from "@/lib/data/types";
import { WhatsAppBubble } from "@/components/shared/whatsapp-bubble";
import { cn } from "@/lib/utils";

const ESTADO_LABEL: Record<Conversacion["estado"], string> = {
  enviado: "Enviado",
  respondido: "Respondido",
  agendado: "Agendado",
  sin_respuesta: "Sin respuesta",
};

const ESTADO_COLOR: Record<Conversacion["estado"], string> = {
  enviado: "bg-muted text-muted-foreground",
  respondido: "bg-vera-menta-suave text-vera-apoyo",
  agendado: "bg-vera-menta-suave text-vera-apoyo",
  sin_respuesta: "bg-vera-arena text-vera-tinta-suave",
};

export function ConversacionesTab({ conversaciones }: { conversaciones: Conversacion[] }) {
  const [openId, setOpenId] = useState(conversaciones[0]?.id ?? null);
  const open = conversaciones.find((c) => c.id === openId);

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <ul className="space-y-2">
        {conversaciones.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => setOpenId(c.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border bg-card p-3 text-left",
                openId === c.id ? "border-vera-apoyo" : "border-border",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-sm font-bold">{c.duenoNombre} — {c.pacienteNombre}</span>
                  <span className="text-[11px] text-muted-foreground">{c.hora}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{c.ultimoMensaje}</div>
                <span className={cn("mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold", ESTADO_COLOR[c.estado])}>
                  {ESTADO_LABEL[c.estado]}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4">
            <div className="font-display text-lg font-bold">{open.duenoNombre}</div>
            <div className="text-sm text-muted-foreground">Sobre {open.pacienteNombre}</div>
          </div>
          <div className="space-y-2">
            {open.mensajes.map((m) => (
              <WhatsAppBubble key={m.id} mensaje={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
