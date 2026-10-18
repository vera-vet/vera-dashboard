"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import type { Empleado, Estacion, SesionActiva } from "@/lib/data/types";
import { GrabarConsultaButton } from "./grabar-consulta-button";
import { NuevaSesionForm } from "./nueva-sesion-form";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";
import { formatFechaCorta, formatHora } from "@/lib/date";
import { terminarSesion } from "./actions";

export function EstacionCard({
  estacion,
  sesion,
  empleados,
  hoy,
}: {
  estacion: Estacion;
  sesion: SesionActiva | null;
  empleados: Empleado[];
  hoy: string;
}) {
  const router = useRouter();
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [terminando, setTerminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function terminar() {
    if (!sesion || terminando) return;
    if (!window.confirm(`¿Terminar la atención de ${sesion.pacienteNombre}? ${estacion.nombre} queda libre.`)) return;
    setTerminando(true);
    setError(null);
    try {
      const resultado = await terminarSesion(sesion.id);
      if (resultado.ok) router.refresh();
      else setError(resultado.mensaje ?? "No se pudo terminar. Intenta de nuevo.");
    } catch {
      setError("No se pudo terminar. Intenta de nuevo.");
    } finally {
      setTerminando(false);
    }
  }

  // Una sesión de otro día es una que alguien olvidó terminar: se dice, para que se cierre.
  const deOtroDia = sesion?.fechaInicio && sesion.fechaInicio !== hoy;

  return (
    <div
      className={
        sesion
          ? "rounded-2xl border border-vera-apoyo bg-vera-menta-suave p-4"
          : "rounded-2xl border border-dashed border-border bg-card p-4"
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-vera-apoyo">{estacion.nombre}</span>
        {sesion ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">en curso</span>
        ) : (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Libre</span>
        )}
      </div>
      {sesion ? (
        <>
          <div className="mt-3 flex items-center gap-3">
            <AvatarPaciente nombre={sesion.pacienteNombre} fotoUrl={sesion.pacienteFotoUrl} tamano={48} />
            <div className="min-w-0">
              <div className="truncate font-display text-base font-bold">{sesion.pacienteNombre}</div>
              <div className="truncate text-xs text-muted-foreground">{sesion.duenoNombre} · {sesion.motivo}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
            <span className="font-medium">{sesion.empleadoNombre}</span>
            <span className={deOtroDia ? "flex items-center gap-1 font-semibold text-vera-coral-fuerte" : "flex items-center gap-1 text-muted-foreground"}>
              <Clock size={12} aria-hidden />
              {deOtroDia ? `abierta desde el ${formatFechaCorta(sesion.fechaInicio!)}` : `desde ${formatHora(sesion.inicio)}`}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/registrar?paciente=${sesion.pacienteId}`}
              className="inline-flex min-h-9 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
            >
              Registrar visita
            </Link>
            <button
              type="button"
              onClick={terminar}
              disabled={terminando}
              className="min-h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold disabled:opacity-60"
            >
              {terminando ? "Terminando…" : "Terminar sesión"}
            </button>
          </div>
          <GrabarConsultaButton pacienteId={sesion.pacienteId} empleadoId={sesion.empleadoId} />
          {error && <p role="alert" className="mt-2 text-xs text-vera-coral-fuerte">{error}</p>}
        </>
      ) : formularioAbierto ? (
        <NuevaSesionForm estacion={estacion} empleados={empleados} onCerrar={() => setFormularioAbierto(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setFormularioAbierto(true)}
          className="mt-3 min-h-10 w-full rounded-lg border border-dashed border-border text-xs font-semibold text-muted-foreground hover:border-vera-apoyo hover:text-vera-apoyo"
        >
          + Nueva sesión
        </button>
      )}
    </div>
  );
}
