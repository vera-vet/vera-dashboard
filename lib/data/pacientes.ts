import { PACIENTES } from "@/lib/data/seed/pacientes";
import { DUENOS } from "@/lib/data/seed/duenos";
import { SERVICIOS } from "@/lib/data/seed/servicios";
import type { Paciente, Dueno, ServicioVisita } from "@/lib/data/types";

export async function getPacientes(): Promise<Paciente[]> {
  return PACIENTES;
}

export async function getPaciente(id: string): Promise<Paciente | undefined> {
  return PACIENTES.find((p) => p.id === id);
}

export async function getDueno(id: string): Promise<Dueno | undefined> {
  return DUENOS.find((d) => d.id === id);
}

export async function getServiciosPorPaciente(pacienteId: string): Promise<ServicioVisita[]> {
  return SERVICIOS.filter((s) => s.pacienteId === pacienteId);
}

const URGENCIA_ORDEN = { vencido: 0, falta: 1, al_dia: 2 } as const;

export async function getPendientesVacunas(): Promise<Paciente[]> {
  return [...PACIENTES]
    .filter((p) => p.estadoEsquema !== "al_dia")
    .sort((a, b) => URGENCIA_ORDEN[a.estadoEsquema] - URGENCIA_ORDEN[b.estadoEsquema]);
}
