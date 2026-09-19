"use server";

import { apiFetch } from "@/lib/api/client";
import { hoyISOElSalvador } from "@/lib/date";

interface RegistrarServicioInput {
  tipo: string;
  producto: string;
  marcas?: { x: number; y: number; nota: string }[];
  fotos?: string[];
  diagramaTipo?: string;
  notaConsultaId?: string;
}

export async function registrarServicio(pacienteId: string, datos: RegistrarServicioInput): Promise<{ ok: boolean }> {
  const meResponse = await apiFetch("/api/auth/me/");
  if (!meResponse.ok) return { ok: false };
  const { nombre: vet } = await meResponse.json();

  const body: Record<string, unknown> = { tipo: datos.tipo, producto: datos.producto, vet };
  if (datos.marcas?.length) body.marcas = datos.marcas;
  if (datos.fotos?.length) body.fotos = datos.fotos;
  if (datos.diagramaTipo) body.diagrama_tipo = datos.diagramaTipo;
  if (datos.notaConsultaId) body.nota_consulta_id = datos.notaConsultaId;

  const response = await apiFetch(`/api/pacientes/${pacienteId}/registrar-servicio/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return { ok: response.ok };
}

export async function buscarNotaConsultaSinConectar(pacienteId: string): Promise<{ id: string; hora: string } | null> {
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
