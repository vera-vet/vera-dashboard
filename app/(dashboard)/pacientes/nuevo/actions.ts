"use server";

import { apiFetch } from "@/lib/api/client";
import { buscarDuenoPorWhatsapp } from "@/lib/data/pacientes";
import type { Dueno } from "@/lib/data/types";

export async function buscarDueno(whatsapp: string): Promise<Dueno | undefined> {
  return buscarDuenoPorWhatsapp(whatsapp);
}

interface CrearDuenoInput {
  nombre: string;
  whatsapp: string;
}

export async function crearDueno(datos: CrearDuenoInput): Promise<{ ok: boolean; id?: string }> {
  const response = await apiFetch("/api/duenos/", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  if (!response.ok) return { ok: false };
  const data = await response.json();
  return { ok: true, id: String(data.id) };
}

interface CrearPacienteInput {
  duenoId: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  esterilizado: boolean;
  vacunasCompletas: number;
  vacunasTotal: number;
}

export async function crearPaciente(datos: CrearPacienteInput): Promise<{ ok: boolean; id?: string }> {
  const estadoEsquema = datos.vacunasCompletas >= datos.vacunasTotal ? "al_dia" : "falta";
  const response = await apiFetch("/api/pacientes/", {
    method: "POST",
    body: JSON.stringify({
      dueno: datos.duenoId,
      nombre: datos.nombre,
      especie: datos.especie,
      raza: datos.raza,
      sexo: datos.sexo,
      fecha_nacimiento: datos.fechaNacimiento,
      esterilizado: datos.esterilizado,
      vacunas_completas: datos.vacunasCompletas,
      vacunas_total: datos.vacunasTotal,
      estado_esquema: estadoEsquema,
    }),
  });
  if (!response.ok) return { ok: false };
  const data = await response.json();
  return { ok: true, id: String(data.id) };
}
