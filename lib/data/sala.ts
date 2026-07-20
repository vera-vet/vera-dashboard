import { SESIONES_ACTIVAS, SALA_ESPERA } from "@/lib/data/seed/sala";
import { ESTACIONES } from "@/lib/data/seed/estaciones";
import { EMPLEADOS } from "@/lib/data/seed/empleados";
import type { SesionActiva, SalaEsperaItem, Estacion, Empleado } from "@/lib/data/types";

export async function getSesionesActivas(): Promise<SesionActiva[]> {
  return SESIONES_ACTIVAS;
}

export async function getSalaEspera(): Promise<SalaEsperaItem[]> {
  return SALA_ESPERA;
}

export async function getEstaciones(): Promise<Estacion[]> {
  return ESTACIONES;
}

export async function getEstacion(id: string): Promise<Estacion | undefined> {
  return ESTACIONES.find((e) => e.id === id);
}

export async function getEmpleados(): Promise<Empleado[]> {
  return EMPLEADOS;
}

export async function getEmpleado(id: string): Promise<Empleado | undefined> {
  return EMPLEADOS.find((e) => e.id === id);
}
