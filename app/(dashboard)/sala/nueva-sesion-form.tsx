"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Empleado, Paciente } from "@/lib/data/types";
import { crearSesionActiva } from "./actions";

export function NuevaSesionForm({
  estacionId,
  pacientes,
  empleados,
  onCerrar,
}: {
  estacionId: string;
  pacientes: Paciente[];
  empleados: Empleado[];
  onCerrar: () => void;
}) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [empleadoId, setEmpleadoId] = useState(empleados[0]?.id ?? "");
  const [motivo, setMotivo] = useState("");
  const [tipo, setTipo] = useState<"consulta" | "grooming">("consulta");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const coincidencias = busqueda.trim()
    ? pacientes.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : [];

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (!pacienteId || !motivo.trim()) {
      setMensaje("Selecciona un paciente y escribe el motivo.");
      return;
    }
    setGuardando(true);
    const inicio = new Date().toTimeString().slice(0, 5);
    const resultado = await crearSesionActiva({ pacienteId, empleadoId, estacionId, motivo, tipo, inicio });
    setGuardando(false);
    if (resultado.ok) {
      router.refresh();
      onCerrar();
    } else {
      setMensaje("No se pudo iniciar la sesión. Intenta de nuevo.");
    }
  }

  return (
    <form onSubmit={guardar} className="mt-3 space-y-2 border-t border-border/60 pt-3">
      <input
        type="text"
        value={pacienteId ? pacientes.find((p) => p.id === pacienteId)?.nombre ?? "" : busqueda}
        onChange={(e) => { setBusqueda(e.target.value); setPacienteId(null); }}
        placeholder="Buscar paciente…"
        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
      />
      {coincidencias.length > 0 && !pacienteId && (
        <ul className="max-h-32 overflow-y-auto rounded-lg border border-border">
          {coincidencias.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => { setPacienteId(p.id); setBusqueda(""); }}
                className="w-full px-2 py-1 text-left text-xs hover:bg-secondary/50"
              >
                {p.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}

      <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs">
        {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
      </select>

      <select value={tipo} onChange={(e) => setTipo(e.target.value as "consulta" | "grooming")} className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs">
        <option value="consulta">Consulta</option>
        <option value="grooming">Grooming</option>
      </select>

      <input
        type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)}
        placeholder="Motivo" className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
      />

      {mensaje && <p className="text-[11px] text-vera-coral">{mensaje}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className="flex-1 rounded-lg bg-vera-emerald px-2 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
          {guardando ? "Guardando…" : "Iniciar"}
        </button>
        <button type="button" onClick={onCerrar} className="rounded-lg border border-border px-2 py-1.5 text-xs">
          Cancelar
        </button>
      </div>
    </form>
  );
}
