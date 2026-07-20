import { RECORDATORIOS } from "@/lib/data/seed/recordatorios";
import { CONVERSACIONES } from "@/lib/data/seed/conversaciones";
import type { Recordatorio, Conversacion } from "@/lib/data/types";

export async function getRecordatoriosProgramados(): Promise<Recordatorio[]> {
  return RECORDATORIOS;
}

export async function getConversaciones(): Promise<Conversacion[]> {
  return CONVERSACIONES;
}

export async function getConversacion(id: string): Promise<Conversacion | undefined> {
  return CONVERSACIONES.find((c) => c.id === id);
}
