"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";
import type { ApiPaciente, ApiRecordatorio } from "@/lib/api/types";
import { mapPaciente } from "@/lib/data/pacientes";
import type { RecordatorioAbierto } from "@/lib/data/registro";
import type { Paciente } from "@/lib/data/types";
import { formatFechaCorta, hoyISOElSalvador } from "@/lib/date";

const MAX_RESULTADOS = 20;

/** Búsqueda de recepción: por mascota, dueño o teléfono (lo resuelve la API con ?q=). */
export async function buscarPacientes(q: string): Promise<Paciente[]> {
  const texto = q.trim();
  if (texto.length < 2) return [];
  const response = await apiFetch(`/api/pacientes/?q=${encodeURIComponent(texto)}`);
  if (!response.ok) throw new Error(`No se pudo buscar (${response.status})`);
  const data: ApiPaciente[] = await response.json();
  return data.slice(0, MAX_RESULTADOS).map(mapPaciente);
}

/** Fecha corta en El Salvador de un datetime de la API ("7 nov"). */
function fechaLocal(iso: string): string {
  return formatFechaCorta(hoyISOElSalvador(new Date(iso)));
}

/** Recordatorios de este tipo que una visita nueva puede dar por cumplidos. */
export async function recordatoriosAbiertos(pacienteId: string, tipo: string): Promise<RecordatorioAbierto[]> {
  if (!esIdValido(pacienteId)) return [];
  const params = new URLSearchParams({ paciente: pacienteId, tipo, estado: "pendiente,pausado,enviado" });
  const response = await apiFetch(`/api/recordatorios/?${params}`);
  if (!response.ok) return [];
  const data: ApiRecordatorio[] = await response.json();
  return data.map((r) => ({
    id: String(r.id),
    servicioProducto: r.servicio_producto ?? null,
    mensaje: r.mensaje,
    cuando: fechaLocal(r.programado_para),
  }));
}

/** La transcripción de hoy que todavía no está conectada a ninguna visita (la más reciente). */
export async function buscarNotaConsultaSinConectar(pacienteId: string): Promise<{ id: string; hora: string } | null> {
  if (!esIdValido(pacienteId)) return null;
  const response = await apiFetch(`/api/pacientes/${pacienteId}/notas-consulta/`);
  if (!response.ok) return null;

  const notas: { id: number; fecha_hora: string; servicio_visita: number | null }[] = await response.json();
  const hoy = hoyISOElSalvador();
  const sinConectar = notas.filter((n) => !n.servicio_visita && hoyISOElSalvador(new Date(n.fecha_hora)) === hoy);
  if (sinConectar.length === 0) return null;

  const masReciente = sinConectar[sinConectar.length - 1];
  const hora = new Date(masReciente.fecha_hora).toLocaleTimeString("es-SV", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/El_Salvador",
  });
  return { id: String(masReciente.id), hora };
}

interface RegistrarServicioInput {
  tipo: string;
  producto: string;
  marcas?: { x: number; y: number; nota: string }[];
  diagramaTipo?: string;
  notaConsultaId?: string;
  nota?: string;
  /** Días hasta el próximo recordatorio; null = no programar. */
  proximoEnDias: number | null;
  /** Recordatorios abiertos que esta visita da por cumplidos. */
  cumpleRecordatorios: string[];
}

export async function registrarServicio(
  pacienteId: string,
  datos: RegistrarServicioInput,
): Promise<{ ok: boolean; mensaje?: string; proximoRecordatorio?: string | null }> {
  if (!esIdValido(pacienteId)) return { ok: false, mensaje: "Paciente inválido." };

  // Sin "vet": la API deja la visita a nombre de quien la registra.
  const body: Record<string, unknown> = {
    tipo: datos.tipo,
    producto: datos.producto,
    proximo_en_dias: datos.proximoEnDias,
    cumple_recordatorios: datos.cumpleRecordatorios.filter(esIdValido).map(Number),
  };
  if (datos.marcas?.length) {
    body.marcas = datos.marcas;
    body.diagrama_tipo = datos.diagramaTipo;
  }
  if (datos.nota?.trim()) body.nota = datos.nota.trim();
  if (datos.notaConsultaId && esIdValido(datos.notaConsultaId)) body.nota_consulta_id = Number(datos.notaConsultaId);

  const response = await apiFetch(`/api/pacientes/${pacienteId}/registrar-servicio/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, mensaje: (data as { detail?: string }).detail };

  const recordatorio = (data as { recordatorio?: { programado_para: string } | null }).recordatorio;
  return { ok: true, proximoRecordatorio: recordatorio ? fechaLocal(recordatorio.programado_para) : null };
}
