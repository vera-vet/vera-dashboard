import { SERVICIOS } from "@/lib/data/seed/servicios";
import { apiFetch } from "@/lib/api/client";
import type { ApiDueno, ApiPaciente } from "@/lib/api/types";
import type { Dueno, EstadoEsquema, Especie, Paciente, ServicioVisita } from "@/lib/data/types";

export function mapDueno(api: ApiDueno): Dueno {
  return { id: String(api.id), nombre: api.nombre, whatsapp: api.whatsapp };
}

export function mapPaciente(api: ApiPaciente): Paciente {
  return {
    id: String(api.id),
    nombre: api.nombre,
    especie: api.especie as Especie,
    raza: api.raza,
    sexo: api.sexo as "M" | "H",
    fechaNacimiento: api.fecha_nacimiento,
    fotoUrl: api.foto_url,
    duenoId: String(api.dueno),
    esterilizado: api.esterilizado,
    vacunasCompletas: api.vacunas_completas,
    vacunasTotal: api.vacunas_total,
    estadoEsquema: api.estado_esquema as EstadoEsquema,
    faltaTexto: api.falta_texto || undefined,
    alergias: api.alergias,
    notasComportamiento: api.notas_comportamiento,
  };
}

export async function getPacientes(): Promise<Paciente[]> {
  const response = await apiFetch("/api/pacientes/");
  if (!response.ok) throw new Error(`No se pudieron cargar los pacientes (${response.status})`);
  const data: ApiPaciente[] = await response.json();
  return data.map(mapPaciente);
}

export async function getPaciente(id: string): Promise<Paciente | undefined> {
  const response = await apiFetch(`/api/pacientes/${id}/`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`No se pudo cargar el paciente ${id} (${response.status})`);
  return mapPaciente(await response.json());
}

export async function getDueno(id: string): Promise<Dueno | undefined> {
  const response = await apiFetch(`/api/duenos/${id}/`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`No se pudo cargar el dueño ${id} (${response.status})`);
  return mapDueno(await response.json());
}

export async function getServiciosPorPaciente(pacienteId: string): Promise<ServicioVisita[]> {
  return SERVICIOS.filter((s) => s.pacienteId === pacienteId);
}

export async function getPendientesVacunas(): Promise<Paciente[]> {
  const response = await apiFetch("/api/pacientes/pendientes-vacunas/");
  if (!response.ok) throw new Error(`No se pudieron cargar los pendientes de vacunas (${response.status})`);
  const data: ApiPaciente[] = await response.json();
  return data.map(mapPaciente);
}
