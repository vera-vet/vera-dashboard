"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearProducto, actualizarProducto } from "./actions";
import type { Producto, ProductoCategoria } from "@/lib/data/types";

const CATEGORIA_OPCIONES: { value: ProductoCategoria; label: string }[] = [
  { value: "medicina", label: "Medicina" },
  { value: "alimento", label: "Alimento" },
  { value: "accesorio", label: "Accesorio" },
];

export function ProductoForm({ producto, onCerrar }: { producto?: Producto; onCerrar: () => void }) {
  const router = useRouter();
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [categoria, setCategoria] = useState<ProductoCategoria>(producto?.categoria ?? "medicina");
  const [precio, setPrecio] = useState(producto ? String(producto.precio) : "");
  const [cantidad, setCantidad] = useState(producto ? String(producto.cantidad) : "");
  const [fotoUrl, setFotoUrl] = useState(producto?.fotoUrl ?? "");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (!nombre.trim()) {
      setMensaje("Escribe el nombre del producto.");
      return;
    }
    if (!precio || Number.isNaN(Number(precio)) || Number(precio) < 0) {
      setMensaje("Escribe un precio válido.");
      return;
    }
    setGuardando(true);
    const datos = { nombre, categoria, precio: Number(precio), cantidad: Number(cantidad) || 0, fotoUrl };
    const resultado = producto ? await actualizarProducto(producto.id, datos) : await crearProducto(datos);
    setGuardando(false);
    if (resultado.ok) {
      router.refresh();
      onCerrar();
    } else {
      setMensaje("No se pudo guardar. Intenta de nuevo.");
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <input
        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <select
        value={categoria} onChange={(e) => setCategoria(e.target.value as ProductoCategoria)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      >
        {CATEGORIA_OPCIONES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Precio</label>
          <input
            type="number" min={0} step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="w-1/2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cantidad en stock</label>
          <input
            type="number" min={0} value={cantidad} onChange={(e) => setCantidad(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <input
        type="text" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)}
        placeholder="URL de la foto (opcional)" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      {mensaje && <p className="text-xs text-vera-coral">{mensaje}</p>}

      <div className="flex gap-2">
        <button
          type="submit" disabled={guardando}
          className="flex-1 rounded-xl bg-vera-emerald px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {guardando ? "Guardando…" : producto ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button" onClick={onCerrar}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary/50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
