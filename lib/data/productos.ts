import { apiFetch } from "@/lib/api/client";
import type { ApiProducto } from "@/lib/api/types";
import type { Producto, ProductoCategoria } from "@/lib/data/types";

export function mapProducto(api: ApiProducto): Producto {
  return {
    id: String(api.id),
    nombre: api.nombre,
    categoria: api.categoria as ProductoCategoria,
    precio: Number(api.precio),
    cantidad: api.cantidad,
    fotoUrl: api.foto_url,
  };
}

export async function getProductos(): Promise<Producto[]> {
  const response = await apiFetch("/api/productos/");
  if (!response.ok) throw new Error(`No se pudieron cargar los productos (${response.status})`);
  const data: ApiProducto[] = await response.json();
  return data.map(mapProducto);
}
