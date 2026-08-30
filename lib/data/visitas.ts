import { apiFetch } from "@/lib/api/client";
import type { ApiVisita } from "@/lib/api/types";
import type { Visita } from "@/lib/data/types";

export function mapVisita(api: ApiVisita): Visita {
  return {
    id: String(api.id),
    pacienteId: String(api.paciente),
    pacienteNombre: api.paciente_nombre,
    pacienteFotoUrl: api.paciente_foto_url,
    duenoNombre: api.dueno_nombre,
    fecha: api.fecha,
    hora: api.hora ?? undefined,
    motivo: api.motivo,
    confirmada: api.confirmada,
  };
}

export async function getVisitasHoy(): Promise<Visita[]> {
  const response = await apiFetch("/api/visitas/hoy/");
  if (!response.ok) throw new Error(`No se pudieron cargar las visitas de hoy (${response.status})`);
  const data: ApiVisita[] = await response.json();
  return data.map(mapVisita);
}

export async function getVisitasProximas(): Promise<Visita[]> {
  const response = await apiFetch("/api/visitas/proximas/");
  if (!response.ok) throw new Error(`No se pudieron cargar las próximas visitas (${response.status})`);
  const data: ApiVisita[] = await response.json();
  return data.map(mapVisita);
}

export async function getVisitasPorPaciente(pacienteId: string): Promise<Visita[]> {
  const response = await apiFetch(`/api/visitas/?paciente=${pacienteId}`);
  if (!response.ok) throw new Error(`No se pudieron cargar las visitas (${response.status})`);
  const data: ApiVisita[] = await response.json();
  return data.map(mapVisita);
}
