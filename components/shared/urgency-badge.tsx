import type { EstadoEsquema } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const STYLES: Record<EstadoEsquema, string> = {
  vencido: "bg-vera-coral-soft text-vera-coral",
  falta: "bg-vera-honey-soft text-vera-honey",
  al_dia: "bg-vera-sage text-vera-emerald",
};

const LABELS: Record<EstadoEsquema, string> = {
  vencido: "Vencido",
  falta: "Falta vacuna",
  al_dia: "Al día",
};

export function UrgencyBadge({ estado, texto }: { estado: EstadoEsquema; texto?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", STYLES[estado])}>
      {texto ?? LABELS[estado]}
    </span>
  );
}
