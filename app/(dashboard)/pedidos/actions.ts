"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";
import type { EstadoPedido } from "@/lib/data/types";

export async function cambiarEstadoPedido(id: string, estado: EstadoPedido): Promise<{ ok: boolean }> {
  if (!esIdValido(id)) return { ok: false };
  const response = await apiFetch(`/api/pedidos/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });
  return { ok: response.ok };
}
