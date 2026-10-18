"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";
import { buscarDuenoPorWhatsapp } from "@/lib/data/pacientes";
import type { Dueno } from "@/lib/data/types";

export async function buscarDueno(whatsapp: string): Promise<Dueno | undefined> {
  return buscarDuenoPorWhatsapp(whatsapp);
}

/** El primer mensaje de validación de DRF ({"campo": ["mensaje"]}), para mostrarlo tal cual. */
async function primerError(response: Response): Promise<string | undefined> {
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  for (const valor of Object.values(data)) {
    if (typeof valor === "string") return valor;
    if (Array.isArray(valor) && typeof valor[0] === "string") return valor[0];
  }
  return undefined;
}

interface CrearDuenoInput {
  nombre: string;
  whatsapp: string;
  /** El dueño aceptó recibir recordatorios por WhatsApp. */
  aceptaWhatsapp: boolean;
}

export async function crearDueno(datos: CrearDuenoInput): Promise<{ ok: boolean; id?: string; mensaje?: string }> {
  const response = await apiFetch("/api/duenos/", {
    method: "POST",
    body: JSON.stringify({ nombre: datos.nombre, whatsapp: datos.whatsapp, acepta_whatsapp: datos.aceptaWhatsapp }),
  });
  if (!response.ok) return { ok: false, mensaje: await primerError(response) };
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
  fotoUrl: string;
}

export async function crearPaciente(datos: CrearPacienteInput): Promise<{ ok: boolean; id?: string; mensaje?: string }> {
  if (!esIdValido(datos.duenoId)) return { ok: false, mensaje: "Dueño inválido." };
  // El estado del esquema ("Falta 2ª dosis") lo calcula la API a partir de las dosis.
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
      foto_url: datos.fotoUrl,
    }),
  });
  if (!response.ok) return { ok: false, mensaje: await primerError(response) };
  const data = await response.json();
  return { ok: true, id: String(data.id) };
}
