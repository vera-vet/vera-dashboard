import { apiFetch } from "@/lib/api/client";
import { formatCuando, formatFechaHora } from "@/lib/data/format";
import type { ApiConversacion, ApiMensaje, ApiRecordatorio } from "@/lib/api/types";
import type { Conversacion, Mensaje, Recordatorio } from "@/lib/data/types";

export function mapRecordatorio(api: ApiRecordatorio): Recordatorio {
  return {
    id: String(api.id),
    pacienteId: String(api.paciente),
    pacienteNombre: api.paciente_nombre,
    pacienteFotoUrl: api.paciente_foto_url,
    duenoAceptaWhatsapp: api.dueno_acepta_whatsapp ?? true,
    tipo: api.tipo,
    servicioProducto: api.servicio_producto ?? null,
    cuando: formatCuando(api.programado_para),
    mensaje: api.mensaje,
    estado: api.estado as Recordatorio["estado"],
  };
}

/** La cola de lo que todavía no sale: pendientes y pausados (sin el histórico de enviados). */
export async function getRecordatoriosProgramados(): Promise<Recordatorio[]> {
  const response = await apiFetch("/api/recordatorios/?estado=pendiente,pausado");
  if (!response.ok) throw new Error(`No se pudieron cargar los recordatorios (${response.status})`);
  const data: ApiRecordatorio[] = await response.json();
  return data.map(mapRecordatorio);
}

export function mapMensaje(api: ApiMensaje): Mensaje {
  return { id: String(api.id), autor: api.autor as "vera" | "dueno", texto: api.texto, hora: formatFechaHora(api.created_at) };
}

export function mapConversacion(api: ApiConversacion): Conversacion {
  return {
    id: String(api.id),
    duenoNombre: api.dueno_nombre,
    pacienteId: String(api.paciente),
    pacienteNombre: api.paciente_nombre,
    ultimoMensaje: api.ultimo_mensaje,
    hora: api.ultimo_mensaje_en ? formatFechaHora(api.ultimo_mensaje_en) : "",
    estado: api.estado as Conversacion["estado"],
    mensajes: (api.mensajes ?? []).map(mapMensaje),
  };
}

export async function getConversaciones(): Promise<Conversacion[]> {
  const response = await apiFetch("/api/conversaciones/");
  if (!response.ok) throw new Error(`No se pudieron cargar las conversaciones (${response.status})`);
  const data: ApiConversacion[] = await response.json();
  return data.map(mapConversacion);
}

export async function getConversacion(id: string): Promise<Conversacion | undefined> {
  const response = await apiFetch(`/api/conversaciones/${id}/`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`No se pudo cargar la conversación ${id} (${response.status})`);
  return mapConversacion(await response.json());
}
