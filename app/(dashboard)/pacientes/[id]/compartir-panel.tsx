"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import { clinicasDisponiblesParaCompartir } from "@/lib/data/clinicas";
import type { Clinica, Comparticion } from "@/lib/data/types";
import { buscarClinicas, compartirPaciente, revocarComparticion } from "./actions";

export function CompartirPanel({ pacienteId, comparticionesIniciales }: { pacienteId: string; comparticionesIniciales: Comparticion[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Clinica[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ultimaQueryRef = useRef("");

  function mostrarError(mensaje: string) {
    setMensajeError(mensaje);
    setTimeout(() => setMensajeError(null), 5000);
  }

  async function ejecutarBusqueda(texto: string) {
    let clinicas: Clinica[];
    try {
      clinicas = await buscarClinicas(texto);
    } catch {
      if (ultimaQueryRef.current !== texto) return;
      setBuscando(false);
      mostrarError("No se pudo buscar. Intenta de nuevo.");
      return;
    }
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

  // Un doble clic no debe mandar dos operaciones: mientras una está en curso, los botones se
  // deshabilitan y cualquier clic extra se ignora.
  async function compartir(clinicaId: string) {
    if (guardando) return;
    setGuardando(true);
    try {
      const resultado = await compartirPaciente(pacienteId, clinicaId);
      if (resultado.ok) {
        setQuery("");
        setResultados([]);
        router.refresh();
      } else {
        mostrarError(resultado.mensaje ?? "No se pudo compartir. Intenta de nuevo.");
      }
    } catch {
      mostrarError("No se pudo compartir. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  async function revocar(shareId: string) {
    if (guardando) return;
    setGuardando(true);
    try {
      const resultado = await revocarComparticion(pacienteId, shareId);
      if (resultado.ok) {
        router.refresh();
      } else {
        mostrarError("No se pudo revocar. Intenta de nuevo.");
      }
    } catch {
      mostrarError("No se pudo revocar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  const activas = comparticionesIniciales.filter((c) => c.activo);
  const disponibles = clinicasDisponiblesParaCompartir(resultados, comparticionesIniciales);
  const sinResultados = !buscando && query.trim().length >= 2 && disponibles.length === 0;

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
        aria-label="Buscar clínica por nombre"
        className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      {mensajeError && <p className="mt-2 text-xs text-vera-coral-fuerte">{mensajeError}</p>}

      {buscando && <p className="mt-2 text-xs text-muted-foreground">Buscando…</p>}

      {sinResultados && (
        <p className="mt-2 text-xs text-muted-foreground">No hay otra clínica con ese nombre para compartir.</p>
      )}

      {disponibles.length > 0 && (
        <ul className="mt-2 space-y-1">
          {disponibles.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => compartir(c.id)}
                disabled={guardando}
                aria-label={`Compartir con ${c.nombre}`}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary/50 disabled:opacity-60"
              >
                <span>{c.nombre}</span>
                <span className="text-xs font-semibold text-vera-apoyo">Compartir</span>
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
              <button
                type="button"
                onClick={() => revocar(c.id)}
                disabled={guardando}
                aria-label={`Revocar acceso de ${c.clinicaNombre}`}
                className="text-xs font-semibold text-vera-coral-fuerte hover:underline disabled:opacity-60"
              >
                Revocar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
