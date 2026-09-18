"use server";

import { apiFetch } from "@/lib/api/client";

interface RegistrarVisitaCompartidaInput {
  tipo: string;
  producto: string;
  vet: string;
}

export async function registrarVisitaCompartida(pacienteId: string, datos: RegistrarVisitaCompartidaInput): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/pacientes-compartidos/${pacienteId}/registrar-servicio/`, {
    method: "POST",
    body: JSON.stringify(datos),
  });
  return { ok: response.ok };
}
