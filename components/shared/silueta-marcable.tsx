"use client";

import { useState, type MouseEvent } from "react";
import { X } from "lucide-react";
import type { DiagramaTipo, Marca } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface Props {
  diagramaTipo: DiagramaTipo;
  marcas: Marca[];
  modo: "interactivo" | "lectura";
  onAgregarMarca?: (marca: Omit<Marca, "id">) => void;
  onEliminarMarca?: (id: string) => void;
}

function Diagrama({ tipo }: { tipo: DiagramaTipo }) {
  // Silueta sólida (un solo color de relleno, sin contorno): un color plano
  // se lee como "forma de animal" de inmediato; el contorno pálido de la
  // versión anterior se veía como un blob irreconocible.
  const fill = "var(--vera-verde)";
  const resalte = "var(--card)"; // punto de brillo del ojo, contrasta contra el relleno sólido

  if (tipo === "ojo") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d="M5 50 Q50 15 95 50 Q50 85 5 50 Z" fill="var(--vera-menta-suave)" stroke={fill} strokeWidth={2} />
        <circle cx="50" cy="50" r="16" fill="var(--vera-verde-profundo)" stroke={fill} strokeWidth={2} />
        <circle cx="50" cy="50" r="7" fill="var(--vera-tinta)" />
      </svg>
    );
  }

  if (tipo === "gato") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* cola, fina y curvada hacia arriba */}
        <path d="M82 58 Q100 50 96 22 Q94 15 89 19" fill="none" stroke={fill} strokeWidth={6} strokeLinecap="round" />
        {/* orejas puntiagudas */}
        <path d="M11 31 L5 13 L21 27 Z" fill={fill} />
        <path d="M25 27 L28 9 L37 29 Z" fill={fill} />
        {/* cuerpo y cabeza (se solapan generosamente, sin huecos) */}
        <ellipse cx="57" cy="62" rx="29" ry="15" fill={fill} />
        <circle cx="23" cy="40" r="16" fill={fill} />
        {/* patas */}
        <rect x="33" y="69" width="8" height="20" rx="4" fill={fill} />
        <rect x="47" y="71" width="8" height="22" rx="4" fill={fill} />
        <rect x="65" y="71" width="8" height="22" rx="4" fill={fill} />
        <rect x="79" y="69" width="8" height="20" rx="4" fill={fill} />
        <circle cx="18" cy="38" r="2.2" fill={resalte} />
      </svg>
    );
  }

  if (tipo === "otro") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* silueta genérica de mamífero pequeño: cuerpo redondeado, orejas cortas */}
        <path d="M80 60 Q93 57 91 44" fill="none" stroke={fill} strokeWidth={6} strokeLinecap="round" />
        <circle cx="16" cy="31" r="7" fill={fill} />
        <circle cx="31" cy="29" r="7" fill={fill} />
        <ellipse cx="55" cy="63" rx="27" ry="16" fill={fill} />
        <circle cx="26" cy="46" r="15" fill={fill} />
        <rect x="35" y="71" width="8" height="18" rx="4" fill={fill} />
        <rect x="49" y="73" width="8" height="18" rx="4" fill={fill} />
        <rect x="66" y="73" width="8" height="18" rx="4" fill={fill} />
        <rect x="77" y="71" width="8" height="18" rx="4" fill={fill} />
        <circle cx="22" cy="44" r="2.2" fill={resalte} />
      </svg>
    );
  }

  // perro (default): hocico alargado, oreja caída, cola curva, cuerpo sobre 4 patas
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {/* cola */}
      <path d="M80 55 Q98 45 92 24" fill="none" stroke={fill} strokeWidth={7} strokeLinecap="round" />
      {/* oreja caída */}
      <ellipse cx="17" cy="37" rx="8" ry="12" fill={fill} transform="rotate(-18 17 37)" />
      {/* cuerpo, cabeza y hocico (se solapan generosamente) */}
      <ellipse cx="55" cy="60" rx="32" ry="18" fill={fill} />
      <circle cx="24" cy="46" r="16" fill={fill} />
      <ellipse cx="8" cy="50" rx="9" ry="7" fill={fill} />
      {/* patas */}
      <rect x="30" y="66" width="9" height="22" rx="4.5" fill={fill} />
      <rect x="46" y="68" width="9" height="24" rx="4.5" fill={fill} />
      <rect x="66" y="68" width="9" height="24" rx="4.5" fill={fill} />
      <rect x="80" y="66" width="9" height="22" rx="4.5" fill={fill} />
      <circle cx="20" cy="42" r="2.2" fill={resalte} />
    </svg>
  );
}

export function SiluetaMarcable({ diagramaTipo, marcas, modo, onAgregarMarca, onEliminarMarca }: Props) {
  const [pendiente, setPendiente] = useState<{ x: number; y: number } | null>(null);
  const [nota, setNota] = useState("");

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (modo !== "interactivo") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPendiente({ x, y });
    setNota("");
  }

  function confirmarPendiente() {
    if (!pendiente || !nota.trim() || !onAgregarMarca) return;
    onAgregarMarca({ x: pendiente.x, y: pendiente.y, nota: nota.trim() });
    setPendiente(null);
    setNota("");
  }

  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        className={cn(
          "relative aspect-square w-full max-w-[280px] rounded-2xl border border-border bg-card p-4",
          modo === "interactivo" && "cursor-crosshair",
        )}
      >
        <Diagrama tipo={diagramaTipo} />
        {marcas.map((marca) => (
          <button
            key={marca.id}
            type="button"
            title={marca.nota}
            onClick={(e) => {
              e.stopPropagation();
              if (modo === "interactivo") onEliminarMarca?.(marca.id);
            }}
            className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-vera-coral-fuerte text-white shadow-[var(--shadow-card)]"
            style={{ left: `${marca.x}%`, top: `${marca.y}%` }}
          >
            <span className="h-2 w-2 rounded-full bg-white" />
          </button>
        ))}
        {pendiente && (
          <span
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-vera-coral"
            style={{ left: `${pendiente.x}%`, top: `${pendiente.y}%` }}
          />
        )}
      </div>

      {modo === "interactivo" && pendiente && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
          <input
            autoFocus
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmarPendiente()}
            placeholder="Nota corta (ej. fractura, aplicación)…"
            className="min-h-11 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-muted-foreground md:text-sm"
          />
          <button
            type="button"
            onClick={confirmarPendiente}
            className="min-h-11 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setPendiente(null)}
            aria-label="Cancelar"
            className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-border text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {modo === "interactivo" && (
        <p className="text-xs text-muted-foreground">Toca la silueta para agregar una marca. Toca una marca existente para quitarla.</p>
      )}
    </div>
  );
}
