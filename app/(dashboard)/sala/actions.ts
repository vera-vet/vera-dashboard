"use server";

import { apiFetch } from "@/lib/api/client";

export async function crearNotaConsulta(pacienteId: string, formData: FormData): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/notas-consulta/`, {
    method: "POST",
    body: formData,
  });
  return { ok: response.ok };
}
