"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarPlus, Check, Plus } from "lucide-react";
import type { Paciente, Visita } from "@/lib/data/types";
import { formatHora } from "@/lib/date";
import { CitaForm } from "./cita-form";
import { cancelarCita, confirmarCita } from "./actions";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface Props {
  dias: string[];
  hoy: string;
  visitas: Visita[];
  pacienteInicial: Paciente | null;
}

type Formulario = { tipo: "nueva"; fecha?: string } | { tipo: "mover"; visita: Visita } | null;

function TarjetaCita({ visita, editable, onMover }: { visita: Visita; editable: boolean; onMover: () => void }) {
  const router = useRouter();
  const [abierta, setAbierta] = useState(false);
  const [ocupada, setOcupada] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ejecutar(accion: () => Promise<{ ok: boolean; mensaje?: string }>) {
    if (ocupada) return;
    setOcupada(true);
    setError(null);
    try {
      const resultado = await accion();
      if (resultado.ok) router.refresh();
      else setError(resultado.mensaje ?? "No se pudo guardar. Intenta de nuevo.");
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setOcupada(false);
    }
  }

  function cancelar() {
    if (window.confirm(`¿Cancelar la cita de ${visita.pacienteNombre}? Su recordatorio pendiente también se cancela.`)) {
      ejecutar(() => cancelarCita(visita.id));
    }
  }

  return (
    <li className={visita.confirmada ? "rounded-xl bg-vera-menta-suave text-xs" : "rounded-xl border border-dashed border-border text-xs"}>
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className="w-full p-2 text-left"
      >
        <span className="flex items-center gap-1 font-semibold">
          {visita.hora ? formatHora(visita.hora) : "Sin hora"}
          {visita.confirmada && <Check size={12} className="text-vera-apoyo" aria-label="Confirmada" />}
        </span>
        <span className="block truncate">{visita.pacienteNombre} · {visita.duenoNombre}</span>
        <span className="block truncate text-muted-foreground">{visita.motivo}</span>
      </button>
      {abierta && (
        <div className="space-y-1 border-t border-border/60 p-2">
          <Link href={`/pacientes/${visita.pacienteId}`} className="block font-semibold text-vera-apoyo underline">
            Ver expediente
          </Link>
          {editable && (
            <div className="flex flex-wrap gap-1">
              {!visita.confirmada && (
                <button
                  type="button"
                  onClick={() => ejecutar(() => confirmarCita(visita.id))}
                  disabled={ocupada}
                  className="min-h-9 rounded-lg bg-primary px-2 font-semibold text-primary-foreground disabled:opacity-60"
                >
                  Confirmar
                </button>
              )}
              <button type="button" onClick={onMover} disabled={ocupada} className="min-h-9 rounded-lg border border-border px-2 font-semibold">
                Mover
              </button>
              <button
                type="button"
                onClick={cancelar}
                disabled={ocupada}
                className="min-h-9 rounded-lg border border-border px-2 font-semibold text-vera-coral-fuerte"
              >
                Cancelar cita
              </button>
            </div>
          )}
          {error && <p role="alert" className="text-vera-coral-fuerte">{error}</p>}
        </div>
      )}
    </li>
  );
}

export function AgendaSemana({ dias, hoy, visitas, pacienteInicial }: Props) {
  // Desde el expediente ("Agendar cita") se llega con el paciente elegido y el formulario abierto.
  const [formulario, setFormulario] = useState<Formulario>(pacienteInicial ? { tipo: "nueva" } : null);

  const porFecha = new Map<string, Visita[]>();
  for (const v of visitas) porFecha.set(v.fecha, [...(porFecha.get(v.fecha) ?? []), v]);

  return (
    <div className="space-y-4">
      {formulario === null ? (
        <button
          type="button"
          onClick={() => setFormulario({ tipo: "nueva" })}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <CalendarPlus size={16} aria-hidden /> Nueva cita
        </button>
      ) : (
        <div className="max-w-xl">
          {formulario.tipo === "nueva" ? (
            <CitaForm
              key={formulario.fecha ?? "nueva"}
              fechaInicial={formulario.fecha}
              pacienteInicial={pacienteInicial}
              onCerrar={() => setFormulario(null)}
            />
          ) : (
            <CitaForm key={formulario.visita.id} cita={formulario.visita} onCerrar={() => setFormulario(null)} />
          )}
        </div>
      )}

      {visitas.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay citas esta semana. Agenda la primera con <strong className="font-semibold">Nueva cita</strong>: Vera le
          recordará al dueño el día anterior.
        </p>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-7">
        {dias.map((fecha, i) => {
          const citas = porFecha.get(fecha) ?? [];
          const futura = fecha >= hoy;
          return (
            <section key={fecha} aria-label={`${DIAS[i]} ${Number(fecha.slice(8))}`} className="rounded-2xl border border-border bg-card p-3">
              <div className={citas.length ? "mb-2 flex items-center justify-between lg:flex-col" : "flex items-center justify-between lg:mb-2 lg:flex-col"}>
                <div className="flex items-baseline gap-2 lg:flex-col lg:items-center lg:gap-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{DIAS[i]}</div>
                  <div className={fecha === hoy ? "font-display text-lg font-bold text-vera-apoyo" : "font-display text-lg font-bold"}>
                    {Number(fecha.slice(8))}
                  </div>
                  {/* En móvil los días van apilados: un día vacío ocupa una sola línea. */}
                  {citas.length === 0 && <span className="text-xs text-muted-foreground lg:hidden">Sin citas</span>}
                </div>
                {futura && (
                  <button
                    type="button"
                    onClick={() => setFormulario({ tipo: "nueva", fecha })}
                    aria-label={`Nueva cita el ${DIAS[i]} ${Number(fecha.slice(8))}`}
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-vera-apoyo"
                  >
                    <Plus size={16} aria-hidden />
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {citas.map((visita) => (
                  <TarjetaCita
                    key={visita.id}
                    visita={visita}
                    editable={futura}
                    onMover={() => setFormulario({ tipo: "mover", visita })}
                  />
                ))}
                {citas.length === 0 && <li className="hidden py-3 text-center text-[11px] text-muted-foreground lg:block">—</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
