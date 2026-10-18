"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";

export interface DatosCita {
  pacienteId: string;
  /** "YYYY-MM-DD" */
  fecha: string;
  /** "HH:MM" o vacío si la cita no tiene hora. */
  hora: string;
  motivo: string;
}

type Resultado = { ok: boolean; mensaje?: string };

/** El primer mensaje de validación de DRF, para mostrarlo tal cual ("La cita no puede quedar…"). */
async function resultado(response: Response): Promise<Resultado> {
  if (response.ok) return { ok: true };
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const mensaje = Object.values(data).flat().find((v) => typeof v === "string") as string | undefined;
  return { ok: false, mensaje };
}

export async function crearCita(datos: DatosCita): Promise<Resultado> {
  if (!esIdValido(datos.pacienteId)) return { ok: false, mensaje: "Elige un paciente." };
  const response = await apiFetch("/api/visitas/", {
    method: "POST",
    body: JSON.stringify({ paciente: datos.pacienteId, fecha: datos.fecha, hora: datos.hora || null, motivo: datos.motivo }),
  });
  return resultado(response);
}

export async function moverCita(id: string, datos: Omit<DatosCita, "pacienteId">): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Cita inválida." };
  const response = await apiFetch(`/api/visitas/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ fecha: datos.fecha, hora: datos.hora || null, motivo: datos.motivo }),
  });
  return resultado(response);
}

export async function confirmarCita(id: string): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Cita inválida." };
  const response = await apiFetch(`/api/visitas/${id}/`, { method: "PATCH", body: JSON.stringify({ confirmada: true }) });
  return resultado(response);
}

export async function cancelarCita(id: string): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Cita inválida." };
  const response = await apiFetch(`/api/visitas/${id}/`, { method: "DELETE" });
  return resultado(response);
}
