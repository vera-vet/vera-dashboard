import { apiFetch } from "@/lib/api/client";
import type { ApiEmpleado, ApiEstacion, ApiSalaEsperaItem, ApiSesionActiva } from "@/lib/api/types";
import type { Empleado, Estacion, Rol, SalaEsperaItem, SesionActiva } from "@/lib/data/types";

export function mapEmpleado(api: ApiEmpleado): Empleado {
  return { id: String(api.id), nombre: api.nombre, rol: api.rol as Rol, inicial: api.inicial };
}

export function mapEstacion(api: ApiEstacion): Estacion {
  return { id: String(api.id), nombre: api.nombre, tipo: api.tipo as "consultorio" | "bano" };
}

export function mapSesionActiva(api: ApiSesionActiva): SesionActiva {
  return {
    id: String(api.id),
    pacienteId: String(api.paciente),
    empleadoId: String(api.empleado),
    estacionId: String(api.estacion),
    motivo: api.motivo,
    inicio: api.inicio,
    tipo: api.tipo as "consulta" | "grooming",
  };
}

export function mapSalaEsperaItem(api: ApiSalaEsperaItem): SalaEsperaItem {
  return { pacienteId: String(api.paciente), hora: api.hora, motivo: api.motivo };
}

async function fetchList<A, T>(path: string, mapper: (api: A) => T): Promise<T[]> {
  const response = await apiFetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path} (${response.status})`);
  const data: A[] = await response.json();
  return data.map(mapper);
}

async function fetchOne<A, T>(path: string, mapper: (api: A) => T): Promise<T | undefined> {
  const response = await apiFetch(path);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`No se pudo cargar ${path} (${response.status})`);
  return mapper(await response.json());
}

export async function getSesionesActivas(): Promise<SesionActiva[]> {
  return fetchList("/api/sesiones-activas/", mapSesionActiva);
}

export async function getSalaEspera(): Promise<SalaEsperaItem[]> {
  return fetchList("/api/sala-espera/", mapSalaEsperaItem);
}

export async function getEstaciones(): Promise<Estacion[]> {
  return fetchList("/api/estaciones/", mapEstacion);
}

export async function getEstacion(id: string): Promise<Estacion | undefined> {
  return fetchOne(`/api/estaciones/${id}/`, mapEstacion);
}

export async function getEmpleados(): Promise<Empleado[]> {
  return fetchList("/api/empleados/", mapEmpleado);
}

export async function getEmpleado(id: string): Promise<Empleado | undefined> {
  return fetchOne(`/api/empleados/${id}/`, mapEmpleado);
}
