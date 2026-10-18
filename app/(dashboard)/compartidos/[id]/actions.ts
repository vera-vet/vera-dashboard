"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";

interface RegistrarVisitaCompartidaInput {
  tipo: string;
  producto: string;
  vet: string;
  nota: string;
}

export async function registrarVisitaCompartida(
  pacienteId: string,
  datos: RegistrarVisitaCompartidaInput,
): Promise<{ ok: boolean; mensaje?: string }> {
  if (!esIdValido(pacienteId)) return { ok: false, mensaje: "Paciente inválido." };
  // Sin "vet", la API deja la visita a nombre de quien la registra.
  const body: Record<string, string> = { tipo: datos.tipo, producto: datos.producto };
  if (datos.vet.trim()) body.vet = datos.vet.trim();
  if (datos.nota.trim()) body.nota = datos.nota.trim();
  const response = await apiFetch(`/api/pacientes-compartidos/${pacienteId}/registrar-servicio/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (response.ok) return { ok: true };
  const data = (await response.json().catch(() => ({}))) as { detail?: string };
  return { ok: false, mensaje: data.detail };
}
