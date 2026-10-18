"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Producto } from "@/lib/data/types";
import { formatoDolares } from "@/lib/data/pedidos";
import { FotoProducto } from "@/components/shared/foto-producto";
import { guardarCarrito, leerCarrito, type ItemCarrito } from "../carrito";

export function CatalogoClient({ productos }: { productos: Producto[] }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    setCarrito(leerCarrito());
  }, []);

  function agregar(producto: Producto) {
    const existente = carrito.find((i) => i.productoId === producto.id);
    if (existente && existente.cantidad >= producto.cantidad) {
      setAviso(`No hay más ${producto.nombre} disponibles.`);
      return;
    }
    const actualizado = existente
      ? carrito.map((i) => (i.productoId === producto.id ? { ...i, cantidad: i.cantidad + 1, disponible: producto.cantidad } : i))
      : [...carrito, { productoId: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1, disponible: producto.cantidad }];
    setCarrito(actualizado);
    guardarCarrito(actualizado);
    setAviso(`${producto.nombre} agregado al carrito.`);
  }

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <div className="space-y-4">
      {totalItems > 0 && (
        <Link
          href="/tienda/checkout"
          className="block min-h-11 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
        >
          Ver carrito ({totalItems})
        </Link>
      )}
      {aviso && <p role="status" className="text-sm text-vera-apoyo">{aviso}</p>}
      {productos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          La clínica todavía no tiene productos en la tienda.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {productos.map((producto) => (
            <li key={producto.id} className="flex items-center gap-4 px-5 py-4">
              <FotoProducto nombre={producto.nombre} fotoUrl={producto.fotoUrl} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-base font-bold">{producto.nombre}</div>
                <div className="text-xs text-muted-foreground">{formatoDolares(producto.precio)}</div>
              </div>
              <button
                type="button" onClick={() => agregar(producto)} disabled={producto.cantidad === 0}
                aria-label={producto.cantidad === 0 ? `${producto.nombre} agotado` : `Agregar ${producto.nombre}`}
                className="min-h-11 rounded-xl border border-border px-3 text-xs font-semibold hover:bg-secondary/50 disabled:opacity-40"
              >
                {producto.cantidad === 0 ? "Agotado" : "Agregar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
