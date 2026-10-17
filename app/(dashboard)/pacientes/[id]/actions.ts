"use server";

import { apiFetch } from "@/lib/api/client";
import { mapClinica } from "@/lib/data/clinicas";
import type { ApiClinica } from "@/lib/api/types";
import type { Clinica } from "@/lib/data/types";

export async function actualizarDatosClinicos(
  pacienteId: string,
  datos: { alergias: string[]; notasComportamiento: string[] },
): Promise<{ ok: boolean }> {
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

export async function compartirPaciente(
  pacienteId: string,
  clinicaId: string,
): Promise<{ ok: boolean; mensaje?: string }> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/compartir/`, {
    method: "POST",
    body: JSON.stringify({ clinica_id: clinicaId }),
  });
  if (response.ok) return { ok: true };
  // La API explica por qué rechazó (p. ej. compartir con la propia clínica): se muestra tal cual.
  const data = (await response.json().catch(() => ({}))) as { detail?: string };
  return { ok: false, mensaje: data.detail };
}

export async function revocarComparticion(pacienteId: string, shareId: string): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/comparticiones/revocar/`, {
    method: "POST",
    body: JSON.stringify({ share_id: shareId }),
  });
  return { ok: response.ok };
}
