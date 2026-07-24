"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

function ChipList({
  titulo,
  items,
  onAdd,
  onRemove,
  placeholder,
  tono,
}: {
  titulo: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  tono: "coral" | "sage";
}) {
  const [valor, setValor] = useState("");
  const chipClass = tono === "coral" ? "bg-vera-coral-soft text-vera-coral" : "bg-vera-sage text-vera-emerald";

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{titulo}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${chipClass}`}>
            {item}
            <button type="button" onClick={() => onRemove(item)} aria-label={`Quitar ${item}`} className="ml-0.5">
              <X size={11} />
            </button>
          </span>
        ))}
        {items.length === 0 && <span className="text-xs text-muted-foreground">Ninguno registrado.</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && valor.trim()) {
              onAdd(valor.trim());
              setValor("");
            }
          }}
          placeholder={placeholder}
          className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary md:text-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (valor.trim()) {
              onAdd(valor.trim());
              setValor("");
            }
          }}
          className="grid min-h-11 min-w-11 place-items-center rounded-lg bg-vera-emerald text-white"
          aria-label="Agregar"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function DatosClinicos({ alergiasIniciales, notasIniciales }: { alergiasIniciales: string[]; notasIniciales: string[] }) {
  const [alergias, setAlergias] = useState(alergiasIniciales);
  const [notas, setNotas] = useState(notasIniciales);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-bold">Datos clínicos</h2>
      <div className="space-y-5">
        <ChipList
          titulo="Alergias"
          items={alergias}
          onAdd={(v) => setAlergias((prev) => [...prev, v])}
          onRemove={(v) => setAlergias((prev) => prev.filter((x) => x !== v))}
          placeholder="Ej. amoxicilina"
          tono="coral"
        />
        <ChipList
          titulo="Notas de comportamiento"
          items={notas}
          onAdd={(v) => setNotas((prev) => [...prev, v])}
          onRemove={(v) => setNotas((prev) => prev.filter((x) => x !== v))}
          placeholder="Ej. se pone nervioso con otros perros"
          tono="sage"
        />
      </div>
    </div>
  );
}
