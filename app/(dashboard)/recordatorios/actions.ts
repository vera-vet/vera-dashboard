"use server";

import { getConversacion } from "@/lib/data/recordatorios";
import type { Mensaje } from "@/lib/data/types";

// La lista de conversaciones no trae los mensajes (solo el último): se piden al abrir una.
export async function cargarMensajes(conversacionId: string): Promise<{ ok: boolean; mensajes: Mensaje[] }> {
  try {
    const conversacion = await getConversacion(conversacionId);
    return conversacion ? { ok: true, mensajes: conversacion.mensajes } : { ok: false, mensajes: [] };
  } catch {
    return { ok: false, mensajes: [] };
  }
}
