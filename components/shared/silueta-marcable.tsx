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
  const stroke = "var(--vera-forest)";
  const fill = "var(--vera-sage)";
  if (tipo === "ojo") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d="M5 50 Q50 15 95 50 Q50 85 5 50 Z" fill={fill} stroke={stroke} strokeWidth={2} />
        <circle cx="50" cy="50" r="16" fill="var(--vera-forest-deep)" stroke={stroke} strokeWidth={2} />
        <circle cx="50" cy="50" r="7" fill="black" />
      </svg>
    );
  }
  if (tipo === "gato") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <ellipse cx="55" cy="60" rx="30" ry="15" fill={fill} stroke={stroke} strokeWidth={2} />
        <circle cx="22" cy="46" r="11" fill={fill} stroke={stroke} strokeWidth={2} />
        <path d="M14 38 L18 26 L24 37 Z" fill={fill} stroke={stroke} strokeWidth={2} />
        <path d="M22 36 L28 24 L32 36 Z" fill={fill} stroke={stroke} strokeWidth={2} />
        <path d="M83 55 Q95 40 88 25" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <rect x="35" y="72" width="6" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
        <rect x="70" y="72" width="6" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      </svg>
    );
  }
  if (tipo === "otro") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <ellipse cx="55" cy="58" rx="28" ry="16" fill={fill} stroke={stroke} strokeWidth={2} />
        <circle cx="24" cy="48" r="12" fill={fill} stroke={stroke} strokeWidth={2} />
        <rect x="38" y="74" width="6" height="14" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
        <rect x="70" y="74" width="6" height="14" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      </svg>
    );
  }
  // perro (default)
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <ellipse cx="58" cy="58" rx="32" ry="16" fill={fill} stroke={stroke} strokeWidth={2} />
      <circle cx="20" cy="46" r="13" fill={fill} stroke={stroke} strokeWidth={2} />
      <path d="M10 38 Q4 24 16 30 Z" fill={fill} stroke={stroke} strokeWidth={2} />
      <path d="M84 58 Q98 50 92 38" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
      <rect x="36" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      <rect x="52" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      <rect x="70" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      <rect x="80" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
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
            className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-vera-coral text-white shadow-[var(--shadow-card)]"
            style={{ left: `${marca.x}%`, top: `${marca.y}%` }}
          >
            <span className="h-2 w-2 rounded-full bg-white" />
          </button>
        ))}
        {pendiente && (
          <span
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-vera-honey"
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
            className="min-h-11 rounded-lg bg-vera-emerald px-3 text-sm font-semibold text-white"
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
