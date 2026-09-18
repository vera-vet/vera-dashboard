import { apiFetch } from "@/lib/api/client";
import type { ApiNotaConsulta, ApiPaciente, ApiPacienteCompartido, ApiServicioVisita } from "@/lib/api/types";
import type { Comparticion, NotaConsulta, Paciente, ServicioVisita } from "@/lib/data/types";
import { mapNotaConsulta } from "@/lib/data/notas-consulta";
import { mapPaciente, mapServicioVisita } from "@/lib/data/pacientes";

export function mapComparticion(api: ApiPacienteCompartido): Comparticion {
  return {
    id: String(api.id),
    pacienteId: String(api.paciente),
    clinicaId: String(api.clinica),
    clinicaNombre: api.clinica_nombre,
    otorgadoPorNombre: api.otorgado_por_nombre,
    otorgadoEn: api.otorgado_en,
    revocadoEn: api.revocado_en,
    activo: api.activo,
  };
}

export async function getComparticionesPorPaciente(pacienteId: string): Promise<Comparticion[]> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/comparticiones/`);
  if (!response.ok) throw new Error(`No se pudieron cargar las comparticiones (${response.status})`);
  const data: ApiPacienteCompartido[] = await response.json();
  return data.map(mapComparticion);
}

export async function getPacientesCompartidosConmigo(): Promise<Paciente[]> {
  const response = await apiFetch("/api/pacientes-compartidos/");
  if (!response.ok) throw new Error(`No se pudieron cargar los pacientes compartidos (${response.status})`);
  const data: ApiPaciente[] = await response.json();
  return data.map(mapPaciente);
}

export async function getPacienteCompartido(pacienteId: string): Promise<Paciente | undefined> {
  const response = await apiFetch(`/api/pacientes-compartidos/${pacienteId}/`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`No se pudo cargar el paciente compartido ${pacienteId} (${response.status})`);
  return mapPaciente(await response.json());
}

export async function getServiciosCompartido(pacienteId: string): Promise<ServicioVisita[]> {
  const response = await apiFetch(`/api/pacientes-compartidos/${pacienteId}/servicios/`);
  if (!response.ok) throw new Error(`No se pudieron cargar los servicios (${response.status})`);
  const data: ApiServicioVisita[] = await response.json();
  return data.map(mapServicioVisita);
}

export async function getNotasConsultaCompartido(pacienteId: string): Promise<NotaConsulta[]> {
  const response = await apiFetch(`/api/pacientes-compartidos/${pacienteId}/notas-consulta/`);
  if (!response.ok) throw new Error(`No se pudieron cargar las transcripciones (${response.status})`);
  const data: ApiNotaConsulta[] = await response.json();
  return data.map(mapNotaConsulta);
}
