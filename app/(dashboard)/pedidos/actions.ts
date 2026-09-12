"use server";

import { apiFetch } from "@/lib/api/client";
import type { EstadoPedido } from "@/lib/data/types";

export async function cambiarEstadoPedido(id: string, estado: EstadoPedido): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/pedidos/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });
  return { ok: response.ok };
}
