"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import type { Clinica, Comparticion } from "@/lib/data/types";
import { buscarClinicas, compartirPaciente, revocarComparticion } from "./actions";

export function CompartirPanel({ pacienteId, comparticionesIniciales }: { pacienteId: string; comparticionesIniciales: Comparticion[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Clinica[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ultimaQueryRef = useRef("");

  function mostrarError(mensaje: string) {
    setMensajeError(mensaje);
    setTimeout(() => setMensajeError(null), 5000);
  }

  async function ejecutarBusqueda(texto: string) {
    const clinicas = await buscarClinicas(texto);
    if (ultimaQueryRef.current !== texto) return; // respuesta obsoleta, se descarta
    setResultados(clinicas);
    setBuscando(false);
  }

  function buscar(texto: string) {
    setQuery(texto);
    ultimaQueryRef.current = texto;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (texto.trim().length < 2) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    setBuscando(true);
    debounceRef.current = setTimeout(() => {
      ejecutarBusqueda(texto);
    }, 250);
  }

  async function compartir(clinicaId: string) {
    const resultado = await compartirPaciente(pacienteId, clinicaId);
    if (resultado.ok) {
      setQuery("");
      setResultados([]);
      router.refresh();
    } else {
      mostrarError("No se pudo compartir. Intenta de nuevo.");
    }
  }

  async function revocar(shareId: string) {
    const resultado = await revocarComparticion(pacienteId, shareId);
    if (resultado.ok) {
      router.refresh();
    } else {
      mostrarError("No se pudo revocar. Intenta de nuevo.");
    }
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

      {mensajeError && <p className="mt-2 text-xs text-vera-coral">{mensajeError}</p>}

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
