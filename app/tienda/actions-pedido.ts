"use server";

import { apiFetchTienda } from "@/lib/api/client";
import { getMisPedidos } from "@/lib/data/tienda";
import type { TipoEntrega } from "@/lib/data/types";

interface ItemPedidoInput {
  productoId: string;
  cantidad: number;
}

export async function crearPedido(
  items: ItemPedidoInput[], tipoEntrega: TipoEntrega, direccionEntrega: string,
): Promise<{ ok: boolean; pedidoId?: string; urlPago?: string; error?: string }> {
  const response = await apiFetchTienda("/api/tienda/pedidos/", {
    method: "POST",
    body: JSON.stringify({
      items: items.map((i) => ({ producto_id: Number(i.productoId), cantidad: i.cantidad })),
      tipo_entrega: tipoEntrega,
      direccion_entrega: direccionEntrega,
    }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}) as { error?: string });
    return { ok: false, error: data.error || "No se pudo crear el pedido." };
  }
  const data = await response.json();
  return { ok: true, pedidoId: String(data.pedido_id), urlPago: data.url_pago };
}

export async function confirmarPagoSimulado(pedidoId: string): Promise<{ ok: boolean; estado?: string }> {
  const mios = await getMisPedidos();
  if (!mios.some((p) => p.id === pedidoId)) return { ok: false };

  const response = await apiFetchTienda("/api/tienda/pagos/webhook/", {
    method: "POST",
    body: JSON.stringify({ pedido_id: Number(pedidoId) }),
  });
  if (!response.ok) return { ok: false };
  const data = await response.json();
  return { ok: true, estado: data.estado };
}
