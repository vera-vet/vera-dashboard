"use client";

const CARRITO_KEY = "vera-tienda-carrito";

export interface ItemCarrito {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export function leerCarrito(): ItemCarrito[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CARRITO_KEY) || "[]");
  } catch {
    return [];
  }
}

export function guardarCarrito(items: ItemCarrito[]): void {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
}

export function vaciarCarrito(): void {
  localStorage.removeItem(CARRITO_KEY);
}
