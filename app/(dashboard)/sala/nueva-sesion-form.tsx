"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Empleado, Estacion, Paciente } from "@/lib/data/types";
import { useBusquedaPacientes } from "@/hooks/use-busqueda-pacientes";
import { crearSesionActiva } from "./actions";

const CAMPO = "mt-1 min-h-10 w-full rounded-lg border border-border bg-background px-2 text-base md:text-xs";

interface Props {
  estacion: Estacion;
  empleados: Empleado[];
  /** Desde la sala de espera llega con el paciente y el motivo puestos. */
  paciente?: { id: string; nombre: string } | null;
  motivo?: string;
  onCerrar: () => void;
}

/** Hora local del navegador, "HH:MM": la sesión empieza cuando se inicia. */
function horaActual(): string {
  const ahora = new Date();
  return `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
}

export function NuevaSesionForm({ estacion, empleados, paciente: pacienteInicial = null, motivo: motivoInicial = "", onCerrar }: Props) {
  const router = useRouter();
  const id = useId();
  const busqueda = useBusquedaPacientes();
  const [paciente, setPaciente] = useState<{ id: string; nombre: string } | null>(pacienteInicial);
  const [empleadoId, setEmpleadoId] = useState(empleados[0]?.id ?? "");
  const [motivo, setMotivo] = useState(motivoInicial);
  const [tipo, setTipo] = useState<"consulta" | "grooming">(estacion.tipo === "bano" ? "grooming" : "consulta");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (empleados.length === 0) {
    return (
      <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        Para iniciar una sesión primero agrega a tu equipo en{" "}
        <Link href="/ajustes" className="font-semibold text-vera-apoyo underline">Ajustes</Link>.
      </p>
    );
  }

  function elegir(p: Paciente) {
    setPaciente({ id: p.id, nombre: p.nombre });
    busqueda.limpiar();
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (!paciente || !motivo.trim()) {
      setMensaje("Elige un paciente y escribe el motivo.");
      return;
    }
    setGuardando(true);
    setMensaje(null);
    try {
      const resultado = await crearSesionActiva({
        pacienteId: paciente.id, empleadoId, estacionId: estacion.id, motivo: motivo.trim(), tipo, inicio: horaActual(),
      });
      if (resultado.ok) {
        router.refresh();
        onCerrar();
      } else {
        setMensaje(resultado.mensaje ?? "No se pudo iniciar la sesión. Intenta de nuevo.");
      }
    } catch {
      setMensaje("No se pudo iniciar la sesión. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="mt-3 space-y-2 border-t border-border/60 pt-3">
      {paciente ? (
        <div className="flex items-center justify-between rounded-lg border border-border px-2 py-1.5 text-xs">
          <span className="font-semibold">{paciente.nombre}</span>
          <button type="button" onClick={() => setPaciente(null)} className="font-semibold text-muted-foreground underline">
            Cambiar
          </button>
        </div>
      ) : (
        <div>
          <label htmlFor={`${id}-paciente`} className="text-[11px] font-semibold text-muted-foreground">Paciente</label>
          <input
            id={`${id}-paciente`}
            type="search"
            value={busqueda.query}
            onChange={(e) => busqueda.buscar(e.target.value)}
            placeholder="Mascota, dueño o teléfono"
            autoComplete="off"
            className={CAMPO}
          />
          {busqueda.buscando && <p className="mt-1 text-[11px] text-muted-foreground">Buscando…</p>}
          {busqueda.sinResultados && <p className="mt-1 text-[11px] text-muted-foreground">Ningún paciente coincide.</p>}
          {busqueda.resultados.length > 0 && (
            <ul className="mt-1 max-h-36 overflow-y-auto rounded-lg border border-border" aria-label="Pacientes encontrados">
              {busqueda.resultados.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => elegir(p)} className="w-full px-2 py-1.5 text-left text-xs hover:bg-secondary/50">
                    <span className="font-semibold">{p.nombre}</span> · {p.duenoNombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <label htmlFor={`${id}-empleado`} className="text-[11px] font-semibold text-muted-foreground">Quién atiende</label>
        <select id={`${id}-empleado`} value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className={CAMPO}>
          {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-tipo`} className="text-[11px] font-semibold text-muted-foreground">Tipo</label>
        <select id={`${id}-tipo`} value={tipo} onChange={(e) => setTipo(e.target.value as "consulta" | "grooming")} className={CAMPO}>
          <option value="consulta">Consulta</option>
          <option value="grooming">Grooming</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-motivo`} className="text-[11px] font-semibold text-muted-foreground">Motivo</label>
        <input id={`${id}-motivo`} type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={200} className={CAMPO} />
      </div>

      {mensaje && <p role="alert" className="text-[11px] text-vera-coral-fuerte">{mensaje}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className="min-h-10 flex-1 rounded-lg bg-primary px-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">
          {guardando ? "Guardando…" : "Iniciar"}
        </button>
        <button type="button" onClick={onCerrar} className="min-h-10 rounded-lg border border-border px-3 text-xs">
          Cancelar
        </button>
      </div>
    </form>
  );
}
