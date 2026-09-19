"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import type { Empleado, Estacion, SesionActiva } from "@/lib/data/types";
import { GrabarConsultaButton } from "./grabar-consulta-button";
import { NuevaSesionForm } from "./nueva-sesion-form";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";

export function EstacionCard({
  estacion,
  sesion,
  pacientes,
  empleados,
}: {
  estacion: Estacion;
  sesion: SesionActiva | null;
  pacientes: { id: string; nombre: string }[];
  empleados: Empleado[];
}) {
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  return (
    <div
      className={
        sesion
          ? "rounded-2xl border border-vera-emerald bg-vera-sage p-4"
          : "rounded-2xl border border-dashed border-border bg-card p-4"
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-vera-emerald">{estacion.nombre}</span>
        {sesion ? (
          <span className="rounded-full bg-vera-emerald px-2 py-0.5 text-[10px] font-medium text-white">en curso</span>
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
              <div className="truncate text-xs text-muted-foreground">{sesion.duenoNombre}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
            <span className="font-medium">{sesion.empleadoNombre}</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock size={12} /> desde {sesion.inicio}
            </span>
          </div>
          <GrabarConsultaButton pacienteId={sesion.pacienteId} empleadoId={sesion.empleadoId} />
        </>
      ) : formularioAbierto ? (
        <NuevaSesionForm
          estacionId={estacion.id}
          pacientes={pacientes}
          empleados={empleados}
          onCerrar={() => setFormularioAbierto(false)}
        />
      ) : (
        <button
          onClick={() => setFormularioAbierto(true)}
          className="mt-3 w-full rounded-lg border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-vera-emerald hover:text-vera-emerald"
        >
          + Nueva sesión
        </button>
      )}
    </div>
  );
}
