"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductoForm } from "./producto-form";
import { borrarProducto } from "./actions";
import type { Producto } from "@/lib/data/types";

const CATEGORIA_LABEL = { medicina: "Medicina", alimento: "Alimento", accesorio: "Accesorio" } as const;

export function ProductoCard({ producto, esAdmin }: { producto: Producto; esAdmin: boolean }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  async function borrar() {
    if (borrando) return;
    if (!window.confirm(`¿Borrar "${producto.nombre}"?`)) return;
    setBorrando(true);
    const resultado = await borrarProducto(producto.id);
    setBorrando(false);
    if (resultado.ok) {
      router.refresh();
    }
  }

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
        <div className="flex gap-2">
          <button
            type="button" onClick={() => setEditando(true)}
            className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/50"
          >
            Editar
          </button>
          <button
            type="button" onClick={borrar} disabled={borrando}
            className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/50 disabled:opacity-60"
          >
            {borrando ? "Borrando…" : "Borrar"}
          </button>
        </div>
      )}
    </li>
  );
}
