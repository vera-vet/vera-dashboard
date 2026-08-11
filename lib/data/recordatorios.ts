import { CONVERSACIONES } from "@/lib/data/seed/conversaciones";
import { apiFetch } from "@/lib/api/client";
import { formatFechaHora } from "@/lib/data/format";
import type { ApiRecordatorio } from "@/lib/api/types";
import type { Conversacion, Recordatorio } from "@/lib/data/types";

export function mapRecordatorio(api: ApiRecordatorio): Recordatorio {
  return {
    id: String(api.id),
    pacienteId: String(api.paciente),
    tipo: api.tipo,
    cuando: formatFechaHora(api.programado_para),
    mensaje: api.mensaje,
    estado: api.estado as Recordatorio["estado"],
  };
}

export async function getRecordatoriosProgramados(): Promise<Recordatorio[]> {
  const response = await apiFetch("/api/recordatorios/");
  if (!response.ok) throw new Error(`No se pudieron cargar los recordatorios (${response.status})`);
  const data: ApiRecordatorio[] = await response.json();
  return data.map(mapRecordatorio);
}

export async function getConversaciones(): Promise<Conversacion[]> {
  return CONVERSACIONES;
}

export async function getConversacion(id: string): Promise<Conversacion | undefined> {
  return CONVERSACIONES.find((c) => c.id === id);
}
