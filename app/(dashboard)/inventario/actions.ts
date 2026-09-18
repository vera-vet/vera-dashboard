"use server";

import { apiFetch } from "@/lib/api/client";
import { getMe } from "@/lib/data/usuario";

interface ProductoInput {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  fotoUrl: string;
}

export async function crearProducto(datos: ProductoInput): Promise<{ ok: boolean }> {
  const { esAdmin } = await getMe();
  if (!esAdmin) return { ok: false };
  const response = await apiFetch("/api/productos/", {
    method: "POST",
    body: JSON.stringify({
      nombre: datos.nombre,
      categoria: datos.categoria,
      precio: datos.precio,
      cantidad: datos.cantidad,
      foto_url: datos.fotoUrl,
    }),
  });
  return { ok: response.ok };
}

export async function actualizarProducto(id: string, datos: ProductoInput): Promise<{ ok: boolean }> {
  const { esAdmin } = await getMe();
  if (!esAdmin) return { ok: false };
  const response = await apiFetch(`/api/productos/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: datos.nombre,
      categoria: datos.categoria,
      precio: datos.precio,
      cantidad: datos.cantidad,
      foto_url: datos.fotoUrl,
    }),
  });
  return { ok: response.ok };
}

export async function borrarProducto(id: string): Promise<{ ok: boolean }> {
  const { esAdmin } = await getMe();
  if (!esAdmin) return { ok: false };
  const response = await apiFetch(`/api/productos/${id}/`, { method: "DELETE" });
  return { ok: response.ok };
}
