"use server";

import { apiFetch } from "@/lib/api/client";

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
