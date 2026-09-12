import { redirect } from "next/navigation";
import { apiFetch, apiFetchTienda } from "@/lib/api/client";
import type { ApiPedido, ApiPedidoItem, ApiProducto } from "@/lib/api/types";
import { mapProducto } from "@/lib/data/productos";
import type { EstadoPedido, Pedido, PedidoItem, Producto, TipoEntrega } from "@/lib/data/types";

export function mapPedidoItem(api: ApiPedidoItem): PedidoItem {
  return {
    id: String(api.id),
    productoId: api.producto !== null ? String(api.producto) : null,
    productoNombre: api.producto_nombre,
    cantidad: api.cantidad,
    precioUnitario: Number(api.precio_unitario),
  };
}

export function mapPedido(api: ApiPedido): Pedido {
  return {
    id: String(api.id),
    duenoId: String(api.dueno),
    duenoNombre: api.dueno_nombre,
    tipoEntrega: api.tipo_entrega as TipoEntrega,
    direccionEntrega: api.direccion_entrega,
    estado: api.estado as EstadoPedido,
    creadoEn: api.creado_en,
    items: api.items.map(mapPedidoItem),
  };
}

export async function getCatalogoTienda(): Promise<Producto[]> {
  const response = await apiFetchTienda("/api/tienda/productos/");
  if (response.status === 401) redirect("/tienda");
  if (!response.ok) throw new Error(`No se pudo cargar el catálogo (${response.status})`);
  const data: ApiProducto[] = await response.json();
  return data.map(mapProducto);
}

export async function getMisPedidos(): Promise<Pedido[]> {
  const response = await apiFetchTienda("/api/tienda/mis-pedidos/");
  if (response.status === 401) redirect("/tienda");
  if (!response.ok) throw new Error(`No se pudieron cargar tus pedidos (${response.status})`);
  const data: ApiPedido[] = await response.json();
  return data.map(mapPedido);
}

export async function getPedidos(): Promise<Pedido[]> {
  const response = await apiFetch("/api/pedidos/");
  if (!response.ok) throw new Error(`No se pudieron cargar los pedidos (${response.status})`);
  const data: ApiPedido[] = await response.json();
  return data.map(mapPedido);
}
