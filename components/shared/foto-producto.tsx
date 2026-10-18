"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Foto de un producto (inventario y tienda) o, si no tiene o no carga, su inicial: nunca una
 * imagen rota. Mismo criterio que AvatarPaciente.
 */
export function FotoProducto({ nombre, fotoUrl, className }: { nombre: string; fotoUrl?: string | null; className?: string }) {
  const [fallo, setFallo] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFallo(false);
    // Si la imagen falló antes de hidratar, React no llega a ver el onError.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFallo(true);
  }, [fotoUrl]);

  if (fotoUrl && !fallo) {
    return (
      <img
        ref={imgRef} src={fotoUrl} alt={nombre} onError={() => setFallo(true)}
        className={cn("h-12 w-12 shrink-0 rounded-xl object-cover", className)}
      />
    );
  }
  return (
    <div
      role="img" aria-label={nombre}
      className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-vera-menta-suave font-display text-lg font-bold text-vera-verde", className)}
    >
      {nombre.trim().charAt(0).toUpperCase()}
    </div>
  );
}
