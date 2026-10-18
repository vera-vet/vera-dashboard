"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Paciente } from "@/lib/data/types";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";
import { buscarPacientes } from "./actions";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

function FilaPaciente({ paciente, onElegir }: { paciente: Paciente; onElegir: (p: Paciente) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onElegir(paciente)}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-secondary/60"
      >
        <AvatarPaciente nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={36} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{paciente.nombre}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {paciente.duenoNombre}
          </span>
        </span>
      </button>
    </li>
  );
}

export function SelectorPaciente({ enSala, onElegir }: { enSala: Paciente[]; onElegir: (p: Paciente) => void }) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ultimaRef = useRef("");

  function buscar(texto: string) {
    setQuery(texto);
    ultimaRef.current = texto;
    setError(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (texto.trim().length < 2) {
      setResultados([]);
      setBuscando(false);
      return;
    }
    setBuscando(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const encontrados = await buscarPacientes(texto);
        if (ultimaRef.current !== texto) return; // respuesta obsoleta
        setResultados(encontrados);
      } catch {
        if (ultimaRef.current === texto) setError(true);
      } finally {
        if (ultimaRef.current === texto) setBuscando(false);
      }
    }, 250);
  }

  const sinResultados = !buscando && !error && query.trim().length >= 2 && resultados.length === 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <label htmlFor="registrar-buscar" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        ¿A quién atendiste?
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3">
        <Search size={16} className="shrink-0 text-muted-foreground" aria-hidden />
        <input
          id="registrar-buscar"
          type="search"
          value={query}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Mascota, dueño o teléfono"
          autoComplete="off"
          className="min-h-11 flex-1 bg-transparent text-base outline-none md:text-sm"
        />
      </div>

      {buscando && <p className="mt-3 text-xs text-muted-foreground">Buscando…</p>}
      {error && <p className="mt-3 text-xs text-vera-coral-fuerte">No se pudo buscar. Intenta de nuevo.</p>}
      {sinResultados && (
        <p className="mt-3 text-xs text-muted-foreground">
          Ningún paciente coincide. Si es nuevo, dalo de alta en{" "}
          <Link href="/pacientes/nuevo" className="font-semibold text-vera-apoyo underline">Nuevo paciente</Link>.
        </p>
      )}
      {resultados.length > 0 && (
        <ul className="mt-2 space-y-0.5" aria-label="Resultados de la búsqueda">
          {resultados.map((p) => (
            <FilaPaciente key={p.id} paciente={p} onElegir={onElegir} />
          ))}
        </ul>
      )}

      {query.trim().length < 2 && enSala.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">En sala ahora</p>
          <ul className="mt-1 space-y-0.5">
            {enSala.map((p) => (
              <FilaPaciente key={p.id} paciente={p} onElegir={onElegir} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
