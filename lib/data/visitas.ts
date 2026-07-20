import { VISITAS } from "@/lib/data/seed/visitas";
import { addDaysISO } from "@/lib/date";
import type { Visita } from "@/lib/data/types";

export interface VisitaResuelta extends Visita {
  fecha: string;
}

function resolver(v: Visita): VisitaResuelta {
  return { ...v, fecha: addDaysISO(v.fechaOffsetDias) };
}

export async function getVisitasHoy(): Promise<VisitaResuelta[]> {
  return VISITAS.filter((v) => v.fechaOffsetDias === 0).map(resolver);
}

export async function getVisitasProximas(): Promise<VisitaResuelta[]> {
  return VISITAS.map(resolver).sort((a, b) => (a.fecha + (a.hora ?? "")).localeCompare(b.fecha + (b.hora ?? "")));
}

export async function getVisitasPorPaciente(pacienteId: string): Promise<VisitaResuelta[]> {
  return VISITAS.filter((v) => v.pacienteId === pacienteId)
    .map(resolver)
    .sort((a, b) => (a.fecha + (a.hora ?? "")).localeCompare(b.fecha + (b.hora ?? "")));
}
