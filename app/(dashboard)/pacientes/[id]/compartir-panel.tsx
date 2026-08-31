"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import type { Clinica, Comparticion } from "@/lib/data/types";
import { buscarClinicas, compartirPaciente, revocarComparticion } from "./actions";

export function CompartirPanel({ pacienteId, comparticionesIniciales }: { pacienteId: string; comparticionesIniciales: Comparticion[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Clinica[]>([]);
  const [buscando, setBuscando] = useState(false);

  async function buscar(texto: string) {
    setQuery(texto);
    if (texto.trim().length < 2) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    const clinicas = await buscarClinicas(texto);
    setResultados(clinicas);
    setBuscando(false);
  }

  async function compartir(clinicaId: string) {
    const resultado = await compartirPaciente(pacienteId, clinicaId);
    if (resultado.ok) {
      setQuery("");
      setResultados([]);
      router.refresh();
    }
  }

  async function revocar(shareId: string) {
    const resultado = await revocarComparticion(pacienteId, shareId);
    if (resultado.ok) router.refresh();
  }

  const activas = comparticionesIniciales.filter((c) => c.activo);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="flex items-center gap-2 font-display text-sm font-bold">
        <Share2 size={14} /> Compartir con otra clínica
      </h3>

      <input
        type="text"
        value={query}
        onChange={(e) => buscar(e.target.value)}
        placeholder="Buscar clínica por nombre…"
        className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      {buscando && <p className="mt-2 text-xs text-muted-foreground">Buscando…</p>}

      {resultados.length > 0 && (
        <ul className="mt-2 space-y-1">
          {resultados.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => compartir(c.id)}
                className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary/50"
              >
                {c.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}

      {activas.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground">Compartido con:</p>
          {activas.map((c) => (
            <div key={c.id} className="flex items-center justify-between text-sm">
              <span>{c.clinicaNombre}</span>
              <button onClick={() => revocar(c.id)} className="text-xs font-semibold text-vera-coral hover:underline">
                Revocar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
