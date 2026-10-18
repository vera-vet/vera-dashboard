"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";

type Resultado = { ok: boolean; mensaje?: string };

/** El primer mensaje de validación de la API ("Consultorio 1 ya está en uso…"), tal cual. */
async function resultado(response: Response): Promise<Resultado> {
  if (response.ok) return { ok: true };
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const mensaje = Object.values(data).flat().find((v) => typeof v === "string") as string | undefined;
  return { ok: false, mensaje };
}

export async function crearNotaConsulta(pacienteId: string, formData: FormData): Promise<{ ok: boolean }> {
  if (!esIdValido(pacienteId)) return { ok: false };
  const response = await apiFetch(`/api/pacientes/${pacienteId}/notas-consulta/`, {
    method: "POST",
    body: formData,
  });
  return { ok: response.ok };
}

interface CrearSesionActivaInput {
  pacienteId: string;
  empleadoId: string;
  estacionId: string;
  motivo: string;
  tipo: "consulta" | "grooming";
  /** "HH:MM" del navegador. */
  inicio: string;
}

export async function crearSesionActiva(datos: CrearSesionActivaInput): Promise<Resultado> {
  if (![datos.pacienteId, datos.empleadoId, datos.estacionId].every(esIdValido)) {
    return { ok: false, mensaje: "Elige paciente, quién atiende y consultorio." };
  }
  const response = await apiFetch("/api/sesiones-activas/", {
    method: "POST",
    body: JSON.stringify({
      paciente: datos.pacienteId,
      empleado: datos.empleadoId,
      estacion: datos.estacionId,
      motivo: datos.motivo,
      tipo: datos.tipo,
      inicio: datos.inicio,
    }),
  });
  return resultado(response);
}

/** Terminar la atención libera el consultorio (la sesión se borra). */
export async function terminarSesion(id: string): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Sesión inválida." };
  return resultado(await apiFetch(`/api/sesiones-activas/${id}/`, { method: "DELETE" }));
}

export async function agregarASalaDeEspera(pacienteId: string, motivo: string): Promise<Resultado> {
  if (!esIdValido(pacienteId)) return { ok: false, mensaje: "Elige el paciente." };
  // Sin hora: la API toma la hora local de llegada.
  const response = await apiFetch("/api/sala-espera/", {
    method: "POST",
    body: JSON.stringify({ paciente: pacienteId, motivo }),
  });
  return resultado(response);
}

export async function quitarDeSalaDeEspera(id: string): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Registro inválido." };
  return resultado(await apiFetch(`/api/sala-espera/${id}/`, { method: "DELETE" }));
}
