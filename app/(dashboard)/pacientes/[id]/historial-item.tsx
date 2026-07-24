"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Reporte, ServicioVisita } from "@/lib/data/types";
import { SiluetaMarcable } from "@/components/shared/silueta-marcable";
import { formatFechaCorta } from "@/lib/date";

export function HistorialItem({ servicio, reporte }: { servicio: ServicioVisita; reporte: Reporte | undefined }) {
  const [abierto, setAbierto] = useState(false);
  const Chevron = abierto ? ChevronDown : ChevronRight;

  return (
    <li>
      <button
        type="button"
        onClick={() => reporte && setAbierto((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
        disabled={!reporte}
      >
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-bold">{servicio.producto}</div>
          <div className="text-xs text-muted-foreground">{formatFechaCorta(servicio.fecha)} · {servicio.vet}</div>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {servicio.tipo}
        </span>
        {reporte && <Chevron size={16} className="shrink-0 text-muted-foreground" />}
      </button>
      {abierto && reporte && (
        <div className="border-t border-border/70 px-5 py-4">
          <SiluetaMarcable diagramaTipo={reporte.diagramaTipo} marcas={reporte.marcas} modo="lectura" />
          {reporte.fotos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {reporte.fotos.map((url, i) => (
                <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
