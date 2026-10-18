"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import type { Empleado, Estacion, Paciente, SalaEsperaItem } from "@/lib/data/types";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";
import { formatHora } from "@/lib/date";
import { useBusquedaPacientes } from "@/hooks/use-busqueda-pacientes";
import { agregarASalaDeEspera, quitarDeSalaDeEspera } from "./actions";
import { NuevaSesionForm } from "./nueva-sesion-form";

const CAMPO = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm";

function AgregarALaEspera({ onCerrar }: { onCerrar: () => void }) {
  const router = useRouter();
  const id = useId();
  const busqueda = useBusquedaPacientes();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [motivo, setMotivo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (!paciente || !motivo.trim()) {
      setError("Elige el paciente y escribe el motivo.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const resultado = await agregarASalaDeEspera(paciente.id, motivo.trim());
      if (resultado.ok) {
        router.refresh();
        onCerrar();
      } else {
        setError(resultado.mensaje ?? "No se pudo agregar. Intenta de nuevo.");
      }
    } catch {
      setError("No se pudo agregar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      {paciente ? (
        <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
          <span className="font-semibold">{paciente.nombre} · <span className="font-normal text-muted-foreground">{paciente.duenoNombre}</span></span>
          <button type="button" onClick={() => setPaciente(null)} className="text-xs font-semibold text-muted-foreground underline">
            Cambiar
          </button>
        </div>
      ) : (
        <div>
          <label htmlFor={`${id}-paciente`} className="text-xs font-semibold text-muted-foreground">¿Quién llegó?</label>
          <input
            id={`${id}-paciente`} type="search" value={busqueda.query} onChange={(e) => busqueda.buscar(e.target.value)}
            placeholder="Mascota, dueño o teléfono" autoComplete="off" className={CAMPO}
          />
          {busqueda.sinResultados && <p className="mt-1 text-xs text-muted-foreground">Ningún paciente coincide.</p>}
          {busqueda.resultados.length > 0 && (
            <ul className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-border" aria-label="Pacientes encontrados">
              {busqueda.resultados.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => setPaciente(p)} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/50">
                    <span className="font-semibold">{p.nombre}</span> · {p.duenoNombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div>
        <label htmlFor={`${id}-motivo`} className="text-xs font-semibold text-muted-foreground">Motivo</label>
        <input id={`${id}-motivo`} type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={200} className={CAMPO} />
      </div>
      {error && <p role="alert" className="text-xs text-vera-coral-fuerte">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className="min-h-11 flex-1 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {guardando ? "Agregando…" : "Agregar a la espera"}
        </button>
        <button type="button" onClick={onCerrar} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function ItemEspera({ item, libres, empleados }: { item: SalaEsperaItem; libres: Estacion[]; empleados: Empleado[] }) {
  const router = useRouter();
  const [estacionId, setEstacionId] = useState<string | null>(null);
  const [quitando, setQuitando] = useState(false);
  const estacion = libres.find((e) => e.id === estacionId);

  async function quitar() {
    if (quitando) return;
    setQuitando(true);
    try {
      const resultado = await quitarDeSalaDeEspera(item.id);
      if (resultado.ok) router.refresh();
    } finally {
      setQuitando(false);
    }
  }

  return (
    <li className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-vera-menta-suave px-2.5 py-1.5 text-center font-display text-sm font-bold text-vera-apoyo">
          {formatHora(item.hora)}
        </div>
        <AvatarPaciente nombre={item.pacienteNombre} fotoUrl={item.pacienteFotoUrl} tamano={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{item.pacienteNombre}</div>
          <div className="truncate text-xs text-muted-foreground">{item.motivo}</div>
        </div>
        {libres.length > 0 && !estacion && (
          <label className="text-xs">
            <span className="sr-only">Pasar a {item.pacienteNombre} a un consultorio</span>
            <select
              value=""
              onChange={(e) => setEstacionId(e.target.value || null)}
              className="min-h-10 rounded-lg border border-border bg-background px-2 text-xs font-semibold"
            >
              <option value="">Pasar a…</option>
              {libres.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </label>
        )}
        <button
          type="button"
          onClick={quitar}
          disabled={quitando}
          aria-label={`Quitar a ${item.pacienteNombre} de la sala de espera`}
          className="min-h-10 rounded-lg px-2 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-60"
        >
          Quitar
        </button>
      </div>
      {estacion && (
        <div className="mt-2 rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-semibold">Pasar a {estacion.nombre}</p>
          <NuevaSesionForm
            estacion={estacion}
            empleados={empleados}
            paciente={{ id: item.pacienteId, nombre: item.pacienteNombre }}
            motivo={item.motivo}
            onCerrar={() => setEstacionId(null)}
          />
        </div>
      )}
    </li>
  );
}

export function SalaEspera({ espera, libres, empleados }: { espera: SalaEsperaItem[]; libres: Estacion[]; empleados: Empleado[] }) {
  const [agregando, setAgregando] = useState(false);

  return (
    <section aria-labelledby="sala-espera-titulo">
      <div className="mb-3 mt-8 flex items-center justify-between">
        <h2 id="sala-espera-titulo" className="font-display text-lg font-bold">Sala de espera</h2>
        {!agregando && (
          <button
            type="button"
            onClick={() => setAgregando(true)}
            className="min-h-11 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-secondary"
          >
            + Llegó alguien
          </button>
        )}
      </div>
      {agregando && (
        <div className="mb-3 max-w-xl">
          <AgregarALaEspera onCerrar={() => setAgregando(false)} />
        </div>
      )}
      {espera.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nadie esperando ahora.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {espera.map((item) => (
            <ItemEspera key={item.id} item={item} libres={libres} empleados={empleados} />
          ))}
        </ul>
      )}
    </section>
  );
}
