"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { actualizarDatosClinicos } from "./actions";

function ChipList({
  titulo,
  singular,
  items,
  onAdd,
  onRemove,
  placeholder,
  tono,
}: {
  titulo: string;
  /** "alergia", "nota de comportamiento": para nombrar el campo y el botón. */
  singular: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  tono: "coral" | "sage";
}) {
  const [valor, setValor] = useState("");
  const chipClass = tono === "coral" ? "bg-vera-coral-soft text-vera-coral-fuerte" : "bg-vera-menta-suave text-vera-apoyo";

  function agregar() {
    const nuevo = valor.trim();
    if (!nuevo) return;
    // Sin duplicados ("Amoxicilina" y "amoxicilina" son la misma alergia).
    if (!items.some((i) => i.toLowerCase() === nuevo.toLowerCase())) onAdd(nuevo);
    setValor("");
  }

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
            if (e.key === "Enter") {
              e.preventDefault();
              agregar();
            }
          }}
          aria-label={`Nueva ${singular}`}
          maxLength={titulo === "Alergias" ? 100 : 300}
          placeholder={placeholder}
          className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary md:text-sm"
        />
        <button
          type="button"
          onClick={agregar}
          className="grid min-h-11 min-w-11 place-items-center rounded-lg bg-primary text-primary-foreground"
          aria-label={`Agregar ${singular}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function DatosClinicos({
  pacienteId,
  alergiasIniciales,
  notasIniciales,
}: {
  pacienteId: string;
  alergiasIniciales: string[];
  notasIniciales: string[];
}) {
  const [alergias, setAlergias] = useState(alergiasIniciales);
  const [notas, setNotas] = useState(notasIniciales);
  const [error, setError] = useState(false);

  // Se muestra el cambio al instante; si la API no lo guarda, se vuelve atrás y se avisa.
  async function guardar(nuevasAlergias: string[], nuevasNotas: string[]) {
    setError(false);
    let ok = false;
    try {
      ok = (await actualizarDatosClinicos(pacienteId, { alergias: nuevasAlergias, notasComportamiento: nuevasNotas })).ok;
    } catch {
      ok = false;
    }
    if (!ok) {
      setAlergias(alergias);
      setNotas(notas);
      setError(true);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-bold">Datos clínicos</h2>
      {error && <p role="alert" className="mb-3 text-xs text-vera-coral-fuerte">No se pudo guardar el cambio. Intenta de nuevo.</p>}
      <div className="space-y-5">
        <ChipList
          titulo="Alergias"
          singular="alergia"
          items={alergias}
          onAdd={(v) => {
            const next = [...alergias, v];
            setAlergias(next);
            guardar(next, notas);
          }}
          onRemove={(v) => {
            const next = alergias.filter((x) => x !== v);
            setAlergias(next);
            guardar(next, notas);
          }}
          placeholder="Ej. amoxicilina"
          tono="coral"
        />
        <ChipList
          titulo="Notas de comportamiento"
          singular="nota de comportamiento"
          items={notas}
          onAdd={(v) => {
            const next = [...notas, v];
            setNotas(next);
            guardar(alergias, next);
          }}
          onRemove={(v) => {
            const next = notas.filter((x) => x !== v);
            setNotas(next);
            guardar(alergias, next);
          }}
          placeholder="Ej. se pone nervioso con otros perros"
          tono="sage"
        />
      </div>
    </div>
  );
}
