"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, MessageCircle, Pause, Play, X } from "lucide-react";
import type { Recordatorio } from "@/lib/data/types";
import { etiquetaTipo } from "@/lib/data/registro";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";
import { cambiarPausaRecordatorio, editarMensajeRecordatorio } from "@/app/(dashboard)/recordatorios/actions";

const MENSAJE_MAX = 500;

export function ReminderQueueItem({ recordatorio }: { recordatorio: Recordatorio }) {
  const router = useRouter();
  const idMensaje = useId();
  const [estado, setEstado] = useState(recordatorio.estado);
  const [texto, setTexto] = useState(recordatorio.mensaje);
  const [borrador, setBorrador] = useState(recordatorio.mensaje);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pausado = estado === "pausado";

  async function alternarPausa() {
    if (guardando) return;
    setGuardando(true);
    setError(null);
    try {
      const resultado = await cambiarPausaRecordatorio(recordatorio.id, !pausado);
      if (resultado.ok) {
        setEstado(pausado ? "pendiente" : "pausado");
        router.refresh();
      } else {
        setError(resultado.mensaje ?? "No se pudo guardar. Intenta de nuevo.");
      }
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarMensaje(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (!borrador.trim()) {
      setError("El mensaje no puede quedar vacío.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const resultado = await editarMensajeRecordatorio(recordatorio.id, borrador);
      if (resultado.ok) {
        // La API lo deja en una sola línea: así se ve como lo recibirá el dueño.
        const limpio = borrador.split(/\s+/).filter(Boolean).join(" ");
        setTexto(limpio);
        setBorrador(limpio);
        setEditando(false);
        router.refresh();
      } else {
        setError(resultado.mensaje ?? "No se pudo guardar. Intenta de nuevo.");
      }
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  function cancelarEdicion() {
    setBorrador(texto);
    setEditando(false);
    setError(null);
  }

  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <AvatarPaciente nombre={recordatorio.pacienteNombre} fotoUrl={recordatorio.pacienteFotoUrl} tamano={40} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-sm font-bold">{recordatorio.pacienteNombre}</span>
          <span className="text-xs text-muted-foreground">· {etiquetaTipo(recordatorio.tipo)}</span>
          <span className={pausado ? "ml-auto text-xs font-medium text-vera-tinta-suave" : "ml-auto text-xs font-medium text-vera-apoyo"}>
            {pausado ? `Pausado · ${recordatorio.cuando}` : recordatorio.cuando}
          </span>
        </div>

        {!recordatorio.duenoAceptaWhatsapp && (
          <p className="mt-1 text-xs font-semibold text-vera-coral-fuerte">
            No saldrá: el dueño no aceptó recibir WhatsApp. Puedes cambiarlo en su ficha.
          </p>
        )}

        {editando ? (
          <form onSubmit={guardarMensaje} className="mt-2">
            <label htmlFor={idMensaje} className="sr-only">Mensaje del recordatorio</label>
            <textarea
              id={idMensaje}
              value={borrador}
              onChange={(e) => setBorrador(e.target.value)}
              rows={3}
              maxLength={MENSAJE_MAX}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary md:text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Antes de este texto, Vera saluda al dueño por su nombre y se presenta con el nombre de la clínica.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                disabled={guardando}
                className="min-h-11 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-60"
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={cancelarEdicion}
                disabled={guardando}
                className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-border px-3 text-xs font-semibold"
              >
                <X size={12} aria-hidden /> Cancelar
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
            <MessageCircle size={12} className="mt-0.5 shrink-0 text-whatsapp" aria-hidden />
            {texto}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-1 text-xs text-vera-coral-fuerte">
            {error}
          </p>
        )}

        {!editando && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={alternarPausa}
              disabled={guardando}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-medium hover:underline disabled:opacity-60"
            >
              {pausado ? <Play size={12} aria-hidden /> : <Pause size={12} aria-hidden />}
              {pausado ? "Reanudar" : "Pausar"}
            </button>
            <button
              type="button"
              onClick={() => setEditando(true)}
              disabled={guardando}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-medium text-muted-foreground hover:text-foreground"
            >
              <Edit3 size={12} aria-hidden /> Editar mensaje
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
