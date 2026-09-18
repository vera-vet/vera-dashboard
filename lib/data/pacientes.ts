import { apiFetch } from "@/lib/api/client";
import type { ApiDueno, ApiMarca, ApiPaciente, ApiReporte, ApiServicioVisita } from "@/lib/api/types";
import type { Dueno, DiagramaTipo, EstadoEsquema, Especie, Marca, Paciente, Reporte, ServicioTipo, ServicioVisita } from "@/lib/data/types";

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
    duenoNombre: api.dueno_nombre,
    esterilizado: api.esterilizado,
    vacunasCompletas: api.vacunas_completas,
    vacunasTotal: api.vacunas_total,
    estadoEsquema: api.estado_esquema as EstadoEsquema,
    faltaTexto: api.falta_texto || undefined,
    alergias: api.alergias,
    notasComportamiento: api.notas_comportamiento,
    carnetToken: api.carnet_token,
  };
}

export function mapMarca(api: ApiMarca): Marca {
  return { id: String(api.id), x: api.x, y: api.y, nota: api.nota };
}

export function mapReporte(api: ApiReporte, servicioVisitaId: string): Reporte {
  return {
    id: String(api.id),
    servicioVisitaId,
    diagramaTipo: api.diagrama_tipo as DiagramaTipo,
    marcas: api.marcas.map(mapMarca),
    fotos: api.fotos,
  };
}

export function mapServicioVisita(api: ApiServicioVisita): ServicioVisita {
  return {
    id: String(api.id),
    pacienteId: String(api.paciente),
    tipo: api.tipo as ServicioTipo,
    producto: api.producto,
    fecha: api.fecha,
    vet: api.vet,
    aplicada: api.aplicada,
    reporte: api.reporte ? mapReporte(api.reporte, String(api.id)) : undefined,
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
  const response = await apiFetch(`/api/pacientes/${pacienteId}/servicios/`);
  if (!response.ok) throw new Error(`No se pudieron cargar los servicios del paciente ${pacienteId} (${response.status})`);
  const data: ApiServicioVisita[] = await response.json();
  return data.map(mapServicioVisita);
}

export async function getPendientesVacunas(): Promise<Paciente[]> {
  const response = await apiFetch("/api/pacientes/pendientes-vacunas/");
  if (!response.ok) throw new Error(`No se pudieron cargar los pendientes de vacunas (${response.status})`);
  const data: ApiPaciente[] = await response.json();
  return data.map(mapPaciente);
}

export async function buscarDuenoPorWhatsapp(whatsapp: string): Promise<Dueno | undefined> {
  const response = await apiFetch(`/api/duenos/?whatsapp=${encodeURIComponent(whatsapp)}`);
  if (!response.ok) throw new Error(`No se pudo buscar el dueño (${response.status})`);
  const data: ApiDueno[] = await response.json();
  return data.length > 0 ? mapDueno(data[0]) : undefined;
}
