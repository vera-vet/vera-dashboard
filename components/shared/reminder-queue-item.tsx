"use client";

import { useState } from "react";
import { Edit3, MessageCircle, Pause, Play, X } from "lucide-react";
import type { Recordatorio } from "@/lib/data/types";

interface Props {
  recordatorio: Recordatorio;
  pacienteNombre: string;
  fotoUrl?: string;
}

export function ReminderQueueItem({ recordatorio, pacienteNombre, fotoUrl }: Props) {
  const [pausado, setPausado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(recordatorio.mensaje);

  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      {fotoUrl ? (
        <img src={fotoUrl || undefined} alt={pacienteNombre} className="h-10 w-10 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-sm font-bold">{pacienteNombre}</span>
          <span className="text-xs text-muted-foreground">· {recordatorio.tipo}</span>
          <span className={pausado ? "ml-auto text-xs font-medium text-vera-honey" : "ml-auto text-xs font-medium text-vera-emerald"}>
            {recordatorio.cuando}
          </span>
        </div>

        {editando ? (
          <div className="mt-2 flex items-start gap-2">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={2}
              className="min-h-11 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary md:text-sm"
            />
            <button
              onClick={() => setEditando(false)}
              className="min-h-11 rounded-xl bg-vera-emerald px-3 py-2 text-xs font-semibold text-white"
            >
              Guardar
            </button>
          </div>
        ) : (
          <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
            <MessageCircle size={12} className="mt-0.5 shrink-0 text-whatsapp" />
            {texto}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3 text-xs">
          <button
            onClick={() => setPausado((v) => !v)}
            className="inline-flex items-center gap-1 font-medium hover:underline"
          >
            {pausado ? <Play size={12} /> : <Pause size={12} />}
            {pausado ? "Reanudar" : "Pausar"}
          </button>
          <button
            onClick={() => setEditando((v) => !v)}
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
          >
            {editando ? <X size={12} /> : <Edit3 size={12} />}
            {editando ? "Cancelar" : "Editar mensaje"}
          </button>
        </div>
      </div>
    </li>
  );
}
