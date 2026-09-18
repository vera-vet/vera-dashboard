"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { ProductoForm } from "./producto-form";

export function NuevoProductoSection() {
  const [abierto, setAbierto] = useState(false);

  if (abierto) {
    return <ProductoForm onCerrar={() => setAbierto(false)} />;
  }

  return (
    <button
      type="button" onClick={() => setAbierto(true)}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-vera-emerald px-4 text-sm font-semibold text-white"
    >
      <PlusCircle size={16} /> Nuevo producto
    </button>
  );
}
