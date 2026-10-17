"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";
import { getConversacion } from "@/lib/data/recordatorios";
import type { Mensaje } from "@/lib/data/types";

// La lista de conversaciones no trae los mensajes (solo el último): se piden al abrir una.
export async function cargarMensajes(conversacionId: string): Promise<{ ok: boolean; mensajes: Mensaje[] }> {
  if (!esIdValido(conversacionId)) return { ok: false, mensajes: [] };
  try {
    const conversacion = await getConversacion(conversacionId);
    return conversacion ? { ok: true, mensajes: conversacion.mensajes } : { ok: false, mensajes: [] };
  } catch {
    return { ok: false, mensajes: [] };
  }
}

async function actualizarRecordatorio(
  id: string,
  cambios: { estado?: "pendiente" | "pausado"; mensaje?: string },
): Promise<{ ok: boolean; mensaje?: string }> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Recordatorio inválido." };
  const response = await apiFetch(`/api/recordatorios/${id}/`, { method: "PATCH", body: JSON.stringify(cambios) });
  if (response.ok) return { ok: true };
  // La API explica por qué (p. ej. "ya salió"): se muestra tal cual.
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const detalle = Object.values(data).flat().find((v) => typeof v === "string") as string | undefined;
  return { ok: false, mensaje: detalle };
}

/** Pausado no sale aunque llegue su fecha; reanudado vuelve a la cola. */
export async function cambiarPausaRecordatorio(id: string, pausar: boolean): Promise<{ ok: boolean; mensaje?: string }> {
  return actualizarRecordatorio(id, { estado: pausar ? "pausado" : "pendiente" });
}

export async function editarMensajeRecordatorio(id: string, mensaje: string): Promise<{ ok: boolean; mensaje?: string }> {
  return actualizarRecordatorio(id, { mensaje });
}
