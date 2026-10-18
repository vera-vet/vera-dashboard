"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bug, CalendarCheck, Check, ClipboardList, Eye, FlaskConical, Scissors, Shield, Syringe, X,
} from "lucide-react";
import type { Especialidad, Marca, Paciente, ServicioTipo } from "@/lib/data/types";
import { resolverDiagramaTipo } from "@/lib/data/diagrama";
import {
  OPCIONES_PLAZO, TIPO_SERVICIO_LABEL, alergiaEnConflicto, anunciaElProducto, plazoPorDefecto, productosSugeridos,
  serviciosFrecuentes, type RecordatorioAbierto,
} from "@/lib/data/registro";
import { SiluetaMarcable } from "@/components/shared/silueta-marcable";
import { SelectorFotos } from "@/components/shared/selector-fotos";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";
import { Textarea } from "@/components/ui/textarea";
import { buscarNotaConsultaSinConectar, recordatoriosAbiertos, registrarServicio } from "./actions";
import { SelectorPaciente } from "./selector-paciente";

// Íconos de línea, sin estetoscopios ni huellas (manual de marca).
const TIPOS: { key: ServicioTipo; icon: typeof Syringe }[] = [
  { key: "vacuna", icon: Syringe },
  { key: "desparasitacion", icon: Bug },
  { key: "preventivo", icon: Shield },
  { key: "consulta", icon: ClipboardList },
  { key: "consulta_oftalmologica", icon: Eye },
  { key: "cirugia", icon: Scissors },
  { key: "examen", icon: FlaskConical },
  { key: "control", icon: CalendarCheck },
];

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

interface Props {
  especialidades: Especialidad[];
  pacienteInicial: Paciente | null;
  enSala: Paciente[];
}

export function RegistrarClient({ especialidades, pacienteInicial, enSala }: Props) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(pacienteInicial);
  const [tipo, setTipo] = useState<ServicioTipo | null>(null);
  const [producto, setProducto] = useState("");
  const [plazo, setPlazo] = useState<number | null>(null);
  const [plazoElegido, setPlazoElegido] = useState(false);
  const [abiertos, setAbiertos] = useState<RecordatorioAbierto[]>([]);
  const [cumple, setCumple] = useState<Set<string>>(new Set());
  const [cumpleElegido, setCumpleElegido] = useState(false);
  const [nota, setNota] = useState("");
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [fotos, setFotos] = useState<string[]>([]);
  const [transcripcion, setTranscripcion] = useState<{ id: string; hora: string } | null>(null);
  const [conectarTranscripcion, setConectarTranscripcion] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  // La transcripción de hoy sin conectar se ofrece al registrar (antes, con un window.confirm).
  useEffect(() => {
    setTranscripcion(null);
    if (!paciente) return;
    let vigente = true;
    buscarNotaConsultaSinConectar(paciente.id).then((t) => vigente && setTranscripcion(t)).catch(() => {});
    return () => {
      vigente = false;
    };
  }, [paciente]);

  // Los recordatorios abiertos de este tipo: la visita puede darlos por cumplidos.
  useEffect(() => {
    setAbiertos([]);
    if (!paciente || !tipo) return;
    let vigente = true;
    recordatoriosAbiertos(paciente.id, tipo).then((r) => vigente && setAbiertos(r)).catch(() => {});
    return () => {
      vigente = false;
    };
  }, [paciente, tipo]);

  // Mientras quien registra no los toque, el plazo y los "cumple" siguen al producto.
  useEffect(() => {
    if (tipo && !plazoElegido) setPlazo(plazoPorDefecto(tipo, producto));
  }, [tipo, producto, plazoElegido]);
  useEffect(() => {
    if (!cumpleElegido) setCumple(new Set(abiertos.filter((r) => anunciaElProducto(r, producto)).map((r) => r.id)));
  }, [abiertos, producto, cumpleElegido]);

  function elegirTipo(nuevo: ServicioTipo | null, productoInicial = "") {
    setTipo(nuevo);
    setProducto(productoInicial);
    setPlazoElegido(false);
    setCumpleElegido(false);
    setMarcas([]);
    setFotos([]);
    setNota("");
    setConectarTranscripcion(true);
    setError(null);
  }

  function elegirPaciente(nuevo: Paciente | null) {
    setPaciente(nuevo);
    elegirTipo(null);
  }

  function alternarCumple(id: string) {
    setCumpleElegido(true);
    setCumple((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  }

  async function registrar(e: React.FormEvent) {
    e.preventDefault();
    // Un doble clic no debe registrar la visita (ni su recordatorio) dos veces.
    if (guardando || !paciente || !tipo) return;
    const nombreProducto = producto.trim();
    if (!nombreProducto) {
      setError("Escribe o elige el producto o procedimiento.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const resultado = await registrarServicio(paciente.id, {
        tipo,
        producto: nombreProducto,
        marcas: marcas.map(({ x, y, nota: textoMarca }) => ({ x, y, nota: textoMarca })),
        fotos,
        diagramaTipo: resolverDiagramaTipo(tipo, especialidades, paciente.especie),
        notaConsultaId: transcripcion && conectarTranscripcion ? transcripcion.id : undefined,
        nota,
        proximoEnDias: plazo,
        cumpleRecordatorios: [...cumple],
      });
      if (!resultado.ok) {
        setError(resultado.mensaje ?? "No se pudo registrar. Intenta de nuevo.");
        return;
      }
      setConfirmacion(
        `${paciente.nombre} · ${nombreProducto}. ` +
          (resultado.proximoRecordatorio
            ? `Vera le escribirá a ${paciente.duenoNombre.split(" ")[0]} el ${resultado.proximoRecordatorio}.`
            : "Sin recordatorio programado."),
      );
      setTimeout(() => setConfirmacion(null), 6000);
      // Se queda en el mismo paciente: es común registrar varias cosas de la misma visita.
      elegirTipo(null);
      setTranscripcion(null);
      router.refresh();
    } catch {
      setError("No se pudo registrar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  const sugeridos = paciente && tipo ? productosSugeridos(tipo, paciente.especie) : [];
  const conflicto = paciente && tipo ? alergiaEnConflicto(producto, tipo, paciente.alergias) : undefined;
  const diagrama = paciente && tipo ? resolverDiagramaTipo(tipo, especialidades, paciente.especie) : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-5">
        {!paciente ? (
          <SelectorPaciente enSala={enSala} onElegir={elegirPaciente} />
        ) : (
          <section className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <AvatarPaciente nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={48} />
            <div className="min-w-0 flex-1">
              <div className="font-display text-base font-bold">{paciente.nombre}</div>
              <div className="truncate text-xs text-muted-foreground">
                {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {paciente.duenoNombre}
              </div>
              {paciente.alergias.length > 0 && (
                <div className="mt-1 text-xs font-semibold text-vera-coral-fuerte">Alergias: {paciente.alergias.join(", ")}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => elegirPaciente(null)}
              className="min-h-11 rounded-xl border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-secondary"
            >
              Cambiar
            </button>
          </section>
        )}

        {paciente && !tipo && (
          <section>
            <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">¿Qué se hizo?</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TIPOS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => elegirTipo(key)}
                  className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left hover:border-vera-apoyo"
                >
                  <Icon size={20} strokeWidth={1.5} className="text-vera-apoyo" aria-hidden />
                  <span className="font-display text-sm font-bold">{TIPO_SERVICIO_LABEL[key]}</span>
                </button>
              ))}
            </div>

            <h2 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Frecuentes · {paciente.nombre}
            </h2>
            <div className="flex flex-wrap gap-2">
              {serviciosFrecuentes(paciente.especie).map(({ tipo: t, producto: p }) => (
                <button
                  key={`${t}-${p}`}
                  type="button"
                  onClick={() => elegirTipo(t, p)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] font-semibold hover:border-vera-apoyo"
                >
                  {p}
                </button>
              ))}
            </div>
          </section>
        )}

        {paciente && tipo && (
          <form onSubmit={registrar} className="space-y-5 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{TIPO_SERVICIO_LABEL[tipo]}</h2>
              <button
                type="button"
                onClick={() => elegirTipo(null)}
                className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-muted-foreground"
              >
                <X size={13} aria-hidden /> Cambiar tipo
              </button>
            </div>

            <div>
              <label htmlFor="registrar-producto" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Producto o procedimiento
              </label>
              {sugeridos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {sugeridos.map((s) => (
                    <button
                      key={s.nombre}
                      type="button"
                      onClick={() => setProducto(s.nombre)}
                      aria-pressed={producto === s.nombre}
                      className={
                        producto === s.nombre
                          ? "min-h-11 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground"
                          : "min-h-11 rounded-xl border border-border px-3.5 text-sm font-semibold hover:bg-secondary"
                      }
                    >
                      {s.nombre}
                    </button>
                  ))}
                </div>
              )}
              <input
                id="registrar-producto"
                type="text"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                maxLength={150}
                placeholder="O escribe otro"
                className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base outline-none focus:border-primary md:text-sm"
              />
            </div>

            {conflicto && (
              <div role="alert" className="rounded-xl border border-vera-coral bg-vera-coral-soft p-3 text-sm text-vera-coral-fuerte">
                <strong className="font-semibold">Alerta de alergia:</strong> {paciente.nombre} tiene registrada una alergia a{" "}
                <strong className="font-semibold">{conflicto}</strong>, presente en este producto.
              </div>
            )}

            <div>
              <label htmlFor="registrar-plazo" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Próximo recordatorio
              </label>
              <select
                id="registrar-plazo"
                value={plazo === null ? "" : String(plazo)}
                onChange={(e) => {
                  setPlazoElegido(true);
                  setPlazo(e.target.value === "" ? null : Number(e.target.value));
                }}
                className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm"
              >
                {OPCIONES_PLAZO.map((o) => (
                  <option key={o.label} value={o.dias === null ? "" : String(o.dias)}>
                    {o.label}
                  </option>
                ))}
                {plazo !== null && !OPCIONES_PLAZO.some((o) => o.dias === plazo) && <option value={String(plazo)}>En {plazo} días</option>}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                {plazo === null
                  ? "Vera no programará ningún recordatorio por esta visita."
                  : `Vera le escribirá a ${paciente.duenoNombre.split(" ")[0]} por WhatsApp ese día a las 9:00 a. m.`}
              </p>
            </div>

            {abiertos.length > 0 && (
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Esta visita cumple</legend>
                <ul className="mt-2 space-y-2">
                  {abiertos.map((r) => (
                    <li key={r.id}>
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={cumple.has(r.id)}
                          onChange={() => alternarCumple(r.id)}
                          className="mt-1 h-4 w-4 accent-vera-verde"
                        />
                        <span>
                          {r.mensaje} <span className="text-xs text-muted-foreground">· {r.cuando}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-xs text-muted-foreground">Los marcados ya no saldrán: esta visita los cumple.</p>
              </fieldset>
            )}

            {transcripcion && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={conectarTranscripcion}
                  onChange={(e) => setConectarTranscripcion(e.target.checked)}
                  className="h-4 w-4 accent-vera-verde"
                />
                Conectar la transcripción de las {transcripcion.hora}
              </label>
            )}

            <div>
              <label htmlFor="registrar-nota" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nota clínica (opcional)
              </label>
              <Textarea
                id="registrar-nota"
                rows={3}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                maxLength={5000}
                placeholder="Hallazgos, indicaciones, tratamiento…"
                className="mt-2"
              />
            </div>

            <SelectorFotos fotos={fotos} onCambio={setFotos} />

            {diagrama && (
              <details className="rounded-xl border border-border p-3">
                <summary className="cursor-pointer text-sm font-semibold">
                  Marcar en el diagrama (opcional){marcas.length > 0 ? ` · ${marcas.length}` : ""}
                </summary>
                <div className="mt-3">
                  <SiluetaMarcable
                    diagramaTipo={diagrama}
                    marcas={marcas}
                    modo="interactivo"
                    onAgregarMarca={(m) => setMarcas((prev) => [...prev, { ...m, id: crypto.randomUUID() }])}
                    onEliminarMarca={(id) => setMarcas((prev) => prev.filter((m) => m.id !== id))}
                  />
                </div>
              </details>
            )}

            {error && (
              <p role="alert" className="text-sm text-vera-coral-fuerte">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={guardando}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                <Check size={15} aria-hidden /> {guardando ? "Registrando…" : "Registrar visita"}
              </button>
              <button
                type="button"
                onClick={() => elegirTipo(null)}
                disabled={guardando}
                className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      <aside className="h-fit rounded-xl border border-border bg-card p-4">
        <h2 className="font-display text-[14px] font-bold">¿Qué hará Vera?</h2>
        <ul className="mt-3 space-y-2.5 text-[12px] text-muted-foreground">
          <li>Guarda la visita y su nota en el expediente.</li>
          <li>Actualiza el esquema de vacunación.</li>
          <li>Programa el próximo recordatorio y da por cumplidos los que esta visita resuelve.</li>
          <li>Le escribe al dueño por WhatsApp cuando toque, en horario de la clínica.</li>
        </ul>
      </aside>

      {confirmacion && (
        <div
          className="fixed bottom-24 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl border border-primary bg-primary p-4 text-primary-foreground shadow-lg lg:bottom-8"
          role="status"
        >
          <Check size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p className="text-[13px]">{confirmacion}</p>
        </div>
      )}
    </div>
  );
}
