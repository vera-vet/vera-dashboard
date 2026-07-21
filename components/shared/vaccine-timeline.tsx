import { Check, Syringe } from "lucide-react";
import type { ServicioVisita } from "@/lib/data/types";
import { formatFechaCorta } from "@/lib/date";

interface Props {
  servicios: ServicioVisita[];
  vacunasCompletas: number;
  vacunasTotal: number;
}

export function VaccineTimeline({ servicios, vacunasCompletas, vacunasTotal }: Props) {
  const vacunas = servicios.filter((s) => s.tipo === "vacuna");
  const pendientes = Math.max(vacunasTotal - vacunasCompletas, 0);

  return (
    <ol className="relative ml-3 space-y-5 border-l-2 border-border pl-6">
      {vacunas.map((v) => (
        <li key={v.id} className="relative">
          <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-vera-emerald text-white">
            <Check size={13} />
          </span>
          <div className="font-display text-sm font-bold">{v.producto}</div>
          <div className="text-xs text-muted-foreground">{formatFechaCorta(v.fecha)} · {v.vet}</div>
        </li>
      ))}
      {Array.from({ length: pendientes }).map((_, i) => (
        <li key={`pendiente-${i}`} className="relative opacity-70">
          <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full border-2 border-dashed border-vera-honey bg-card text-vera-honey">
            <Syringe size={12} />
          </span>
          <div className="font-display text-sm font-bold text-vera-honey">Dosis pendiente</div>
          <div className="text-xs text-muted-foreground">Por programar</div>
        </li>
      ))}
    </ol>
  );
}
