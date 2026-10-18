"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ServicioVisita } from "@/lib/data/types";
import { etiquetaTipo } from "@/lib/data/registro";
import { SiluetaMarcable } from "@/components/shared/silueta-marcable";
import { formatFechaCorta } from "@/lib/date";

/** Una visita del historial clínico: se despliega si tiene nota, transcripción o reporte. */
export function HistorialItem({ servicio }: { servicio: ServicioVisita }) {
  const [abierto, setAbierto] = useState(false);
  const { reporte, notas } = servicio;
  const desplegable = Boolean(reporte) || notas.length > 0;
  const Chevron = abierto ? ChevronDown : ChevronRight;

  return (
    <li>
      <button
        type="button"
        onClick={() => desplegable && setAbierto((v) => !v)}
        aria-expanded={desplegable ? abierto : undefined}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
        disabled={!desplegable}
      >
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-bold">{servicio.producto}</div>
          <div className="text-xs text-muted-foreground">
            {formatFechaCorta(servicio.fecha)} · {servicio.vet}
            {servicio.clinicaOrigenNombre && <> · Registrado por {servicio.clinicaOrigenNombre}</>}
          </div>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {etiquetaTipo(servicio.tipo)}
        </span>
        {desplegable && <Chevron size={16} className="shrink-0 text-muted-foreground" aria-hidden />}
      </button>
      {abierto && desplegable && (
        <div className="space-y-3 border-t border-border/70 px-5 py-4">
          {notas.map((n) => (
            <p key={n.id} className="whitespace-pre-line text-sm">
              {n.texto}
            </p>
          ))}
          {reporte && reporte.marcas.length > 0 && (
            <SiluetaMarcable diagramaTipo={reporte.diagramaTipo} marcas={reporte.marcas} modo="lectura" />
          )}
          {reporte && reporte.fotos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {reporte.fotos.map((url, i) => (
                <img key={i} src={url} alt={`Foto ${i + 1} de la visita`} className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
