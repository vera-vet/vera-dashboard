"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Producto } from "@/lib/data/types";
import { guardarCarrito, leerCarrito, type ItemCarrito } from "../carrito";

export function CatalogoClient({ productos }: { productos: Producto[] }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    setCarrito(leerCarrito());
  }, []);

  function agregar(producto: Producto) {
    const existente = carrito.find((i) => i.productoId === producto.id);
    const actualizado = existente
      ? carrito.map((i) => (i.productoId === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i))
      : [...carrito, { productoId: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    setCarrito(actualizado);
    guardarCarrito(actualizado);
  }

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <div className="space-y-4">
      {totalItems > 0 && (
        <Link
          href="/tienda/checkout"
          className="block rounded-xl bg-vera-emerald px-4 py-2 text-center text-sm font-semibold text-white"
        >
          Ver carrito ({totalItems})
        </Link>
      )}
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {productos.map((producto) => (
          <li key={producto.id} className="flex items-center gap-4 px-5 py-4">
            <img src={producto.fotoUrl || undefined} alt={producto.nombre} className="h-12 w-12 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-base font-bold">{producto.nombre}</div>
              <div className="text-xs text-muted-foreground">${producto.precio.toFixed(2)}</div>
            </div>
            <button
              type="button" onClick={() => agregar(producto)} disabled={producto.cantidad === 0}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/50 disabled:opacity-40"
            >
              {producto.cantidad === 0 ? "Agotado" : "Agregar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
