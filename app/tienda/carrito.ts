"use client";

import type { LineaCarrito } from "@/lib/data/pedidos";

const CARRITO_KEY = "vera-tienda-carrito";

export type ItemCarrito = LineaCarrito;

export function leerCarrito(): ItemCarrito[] {
  if (typeof window === "undefined") return [];
  try {
    const datos = JSON.parse(localStorage.getItem(CARRITO_KEY) || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export function guardarCarrito(items: ItemCarrito[]): void {
  try {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
  } catch {
    // Navegación privada o almacenamiento lleno: el carrito vive solo en esta pantalla.
  }
}

export function vaciarCarrito(): void {
  try {
    localStorage.removeItem(CARRITO_KEY);
  } catch {
    // Igual que arriba.
  }
}
