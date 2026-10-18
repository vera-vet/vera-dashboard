"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import type { Paciente } from "@/lib/data/types";
import { hoyISOElSalvador } from "@/lib/date";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";
import { SelectorPaciente } from "../registrar/selector-paciente";
import { crearCita, moverCita } from "./actions";

const MOTIVOS_FRECUENTES = ["Vacuna", "Control", "Consulta", "Desparasitación", "Baño"];
const CAMPO = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm";

interface Props {
  /** Sin `cita`: cita nueva. Con `cita`: mover o cambiar el motivo de una existente. */
  cita?: { id: string; fecha: string; hora?: string; motivo: string; pacienteNombre: string };
  fechaInicial?: string;
  pacienteInicial?: Paciente | null;
  onCerrar: () => void;
}

export function CitaForm({ cita, fechaInicial, pacienteInicial, onCerrar }: Props) {
  const router = useRouter();
  const id = useId();
  const hoy = hoyISOElSalvador();
  const [paciente, setPaciente] = useState<Paciente | null>(pacienteInicial ?? null);
  const [fecha, setFecha] = useState(cita?.fecha ?? fechaInicial ?? hoy);
  const [hora, setHora] = useState(cita?.hora?.slice(0, 5) ?? "");
  const [motivo, setMotivo] = useState(cita?.motivo ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (!cita && !paciente) {
      setError("Elige el paciente.");
      return;
    }
    if (!motivo.trim()) {
      setError("Escribe el motivo de la cita.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const datos = { fecha, hora, motivo: motivo.trim() };
      const resultado = cita ? await moverCita(cita.id, datos) : await crearCita({ ...datos, pacienteId: paciente!.id });
      if (!resultado.ok) {
        setError(resultado.mensaje ?? "No se pudo guardar la cita. Intenta de nuevo.");
        return;
      }
      router.refresh();
      onCerrar();
    } catch {
      setError("No se pudo guardar la cita. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <h2 className="font-display text-lg font-bold">{cita ? `Mover la cita de ${cita.pacienteNombre}` : "Nueva cita"}</h2>

      {!cita &&
        (paciente ? (
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <AvatarPaciente nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={36} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{paciente.nombre}</div>
              <div className="truncate text-xs text-muted-foreground">{paciente.duenoNombre}</div>
            </div>
            <button
              type="button"
              onClick={() => setPaciente(null)}
              className="min-h-11 rounded-xl border border-border px-3 text-xs font-semibold text-muted-foreground"
            >
              Cambiar
            </button>
          </div>
        ) : (
          <SelectorPaciente enSala={[]} onElegir={setPaciente} etiqueta="¿Para quién es la cita?" />
        ))}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-fecha`} className="text-xs font-semibold text-muted-foreground">Fecha</label>
          <input
            id={`${id}-fecha`} type="date" required value={fecha} min={hoy} onChange={(e) => setFecha(e.target.value)}
            className={CAMPO}
          />
        </div>
        <div>
          <label htmlFor={`${id}-hora`} className="text-xs font-semibold text-muted-foreground">Hora (opcional)</label>
          <input id={`${id}-hora`} type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={CAMPO} />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-motivo`} className="text-xs font-semibold text-muted-foreground">Motivo</label>
        <input
          id={`${id}-motivo`} type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={200}
          className={CAMPO}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MOTIVOS_FRECUENTES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMotivo(m)}
              aria-pressed={motivo === m}
              className="min-h-9 rounded-full border border-border px-3 text-xs font-semibold hover:bg-secondary"
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Vera le recordará la cita al dueño por WhatsApp a las 9:00 a. m. del día anterior y le pedirá que la confirme.
      </p>

      {error && (
        <p role="alert" className="text-sm text-vera-coral-fuerte">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={guardando}
          className="min-h-11 flex-1 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {guardando ? "Guardando…" : cita ? "Guardar cambios" : "Agendar cita"}
        </button>
        <button
          type="button"
          onClick={onCerrar}
          disabled={guardando}
          className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
