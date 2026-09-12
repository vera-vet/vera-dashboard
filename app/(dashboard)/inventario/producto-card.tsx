"use client";

import { useState } from "react";
import { ProductoForm } from "./producto-form";
import type { Producto } from "@/lib/data/types";

const CATEGORIA_LABEL = { medicina: "Medicina", alimento: "Alimento", accesorio: "Accesorio" } as const;

export function ProductoCard({ producto, esAdmin }: { producto: Producto; esAdmin: boolean }) {
  const [editando, setEditando] = useState(false);

  if (editando) {
    return <ProductoForm producto={producto} onCerrar={() => setEditando(false)} />;
  }

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <img src={producto.fotoUrl || undefined} alt={producto.nombre} className="h-12 w-12 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <div className="font-display text-base font-bold">{producto.nombre}</div>
        <div className="truncate text-xs text-muted-foreground">
          {CATEGORIA_LABEL[producto.categoria]} · ${producto.precio.toFixed(2)} · {producto.cantidad} en stock
        </div>
      </div>
      {esAdmin && (
        <button
          type="button" onClick={() => setEditando(true)}
          className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/50"
        >
          Editar
        </button>
      )}
    </li>
  );
}
