"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";
import { mapClinica } from "@/lib/data/clinicas";
import type { ApiClinica } from "@/lib/api/types";
import type { Clinica } from "@/lib/data/types";

type Resultado = { ok: boolean; mensaje?: string };

/** El primer mensaje de validación de la API ({"campo": ["mensaje"]}), para mostrarlo tal cual. */
async function resultado(response: Response): Promise<Resultado> {
  if (response.ok) return { ok: true };
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const mensaje = Object.values(data).flat().find((v) => typeof v === "string") as string | undefined;
  return { ok: false, mensaje };
}

export interface DatosPaciente {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  esterilizado: boolean;
  vacunasCompletas: number;
  vacunasTotal: number;
  fotoUrl: string;
}

export async function actualizarPaciente(id: string, datos: DatosPaciente): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Paciente inválido." };
  const response = await apiFetch(`/api/pacientes/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: datos.nombre,
      especie: datos.especie,
      raza: datos.raza,
      sexo: datos.sexo,
      fecha_nacimiento: datos.fechaNacimiento,
      esterilizado: datos.esterilizado,
      vacunas_completas: datos.vacunasCompletas,
      vacunas_total: datos.vacunasTotal,
      foto_url: datos.fotoUrl,
    }),
  });
  return resultado(response);
}

export async function actualizarDueno(
  id: string,
  datos: { nombre: string; whatsapp: string; aceptaWhatsapp: boolean },
): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Dueño inválido." };
  const response = await apiFetch(`/api/duenos/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ nombre: datos.nombre, whatsapp: datos.whatsapp, acepta_whatsapp: datos.aceptaWhatsapp }),
  });
  return resultado(response);
}

export async function actualizarDatosClinicos(
  pacienteId: string,
  datos: { alergias: string[]; notasComportamiento: string[] },
): Promise<{ ok: boolean }> {
  if (!esIdValido(pacienteId)) return { ok: false };
  const response = await apiFetch(`/api/pacientes/${pacienteId}/`, {
    method: "PATCH",
    body: JSON.stringify({ alergias: datos.alergias, notas_comportamiento: datos.notasComportamiento }),
  });
  return { ok: response.ok };
}

export async function buscarClinicas(q: string): Promise<Clinica[]> {
  const response = await apiFetch(`/api/clinicas/?q=${encodeURIComponent(q)}`);
  if (!response.ok) return [];
  const data: ApiClinica[] = await response.json();
  return data.map(mapClinica);
}

export async function compartirPaciente(pacienteId: string, clinicaId: string): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/compartir/`, {
    method: "POST",
    body: JSON.stringify({ clinica_id: clinicaId }),
  });
  return { ok: response.ok };
}

export async function revocarComparticion(pacienteId: string, shareId: string): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/comparticiones/revocar/`, {
    method: "POST",
    body: JSON.stringify({ share_id: shareId }),
  });
  return { ok: response.ok };
}
