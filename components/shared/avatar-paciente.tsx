"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarPacienteProps {
  nombre: string;
  fotoUrl?: string | null;
  /** Lado en px. */
  tamano: number;
  className?: string;
}

export function inicialDe(nombre: string): string {
  return nombre.trim().charAt(0).toLocaleUpperCase("es") || "?";
}

/**
 * Foto del paciente o, si no tiene o no carga, su inicial en Verde Vera sobre un fondo claro.
 * Nada de caricaturas ni huellas (manual de marca). Las fotos son URLs arbitrarias, por eso
 * se usa <img> y no next/image, que exige declarar los dominios.
 */
export function AvatarPaciente({ nombre, fotoUrl, tamano, className }: AvatarPacienteProps) {
  const [fallo, setFallo] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFallo(false);
    // Si la imagen falló antes de hidratar, React no llega a ver el onError.
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFallo(true);
  }, [fotoUrl]);

  const estilo = { width: tamano, height: tamano };

  if (fotoUrl && !fallo) {
    return (
      <img
        ref={imgRef}
        src={fotoUrl}
        alt={nombre}
        onError={() => setFallo(true)}
        style={estilo}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={nombre}
      style={{ ...estilo, fontSize: Math.round(tamano * 0.42) }}
      className={cn("grid shrink-0 place-items-center rounded-full bg-vera-menta-suave font-display font-bold text-vera-verde", className)}
    >
      {inicialDe(nombre)}
    </span>
  );
}
