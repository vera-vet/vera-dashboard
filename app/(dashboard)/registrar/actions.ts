"use server";

import { apiFetch } from "@/lib/api/client";

interface RegistrarServicioInput {
  tipo: string;
  producto: string;
  marcas?: { x: number; y: number; nota: string }[];
  fotos?: string[];
  diagramaTipo?: string;
}

export async function registrarServicio(pacienteId: string, datos: RegistrarServicioInput): Promise<{ ok: boolean }> {
  const meResponse = await apiFetch("/api/auth/me/");
  if (!meResponse.ok) return { ok: false };
  const { nombre: vet } = await meResponse.json();

  const body: Record<string, unknown> = { tipo: datos.tipo, producto: datos.producto, vet };
  if (datos.marcas?.length) body.marcas = datos.marcas;
  if (datos.fotos?.length) body.fotos = datos.fotos;
  if (datos.diagramaTipo) body.diagrama_tipo = datos.diagramaTipo;

  const response = await apiFetch(`/api/pacientes/${pacienteId}/registrar-servicio/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return { ok: response.ok };
}
