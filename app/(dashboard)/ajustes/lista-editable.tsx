"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

export interface ItemEditable {
  id: string;
  nombre: string;
  categoria: string;
}

interface Props {
  titulo: string;
  /** "Integrante", "Consultorio": para los botones y mensajes. */
  singular: string;
  etiquetaCategoria: string;
  opciones: { value: string; label: string }[];
  items: ItemEditable[];
  esAdmin: boolean;
  textoVacio: string;
  guardar: (id: string | null, datos: { nombre: string; categoria: string }) => Promise<{ ok: boolean; mensaje?: string }>;
  borrar: (id: string) => Promise<{ ok: boolean; mensaje?: string }>;
  /** Qué se pierde al borrar, para la confirmación. */
  avisoAlBorrar: string;
}

const CAMPO = "min-h-11 rounded-xl border border-border bg-background px-3 text-base md:text-sm";

function Formulario({
  inicial, opciones, etiquetaCategoria, singular, onGuardar, onCancelar,
}: {
  inicial?: ItemEditable;
  opciones: Props["opciones"];
  etiquetaCategoria: string;
  singular: string;
  onGuardar: (datos: { nombre: string; categoria: string }) => Promise<string | null>;
  onCancelar: () => void;
}) {
  const id = useId();
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [categoria, setCategoria] = useState(inicial?.categoria ?? opciones[0].value);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (!nombre.trim()) {
      setError("Escribe el nombre.");
      return;
    }
    setGuardando(true);
    setError(await onGuardar({ nombre: nombre.trim(), categoria }));
    setGuardando(false);
  }

  return (
    <form onSubmit={enviar} className="flex flex-wrap items-end gap-2 px-5 py-4">
      <div className="min-w-48 flex-1">
        <label htmlFor={`${id}-nombre`} className="text-xs font-semibold text-muted-foreground">Nombre</label>
        <input id={`${id}-nombre`} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={150} className={`mt-1 w-full ${CAMPO}`} />
      </div>
      <div>
        <label htmlFor={`${id}-categoria`} className="text-xs font-semibold text-muted-foreground">{etiquetaCategoria}</label>
        <select id={`${id}-categoria`} value={categoria} onChange={(e) => setCategoria(e.target.value)} className={`mt-1 block ${CAMPO}`}>
          {opciones.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <button type="submit" disabled={guardando} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {guardando ? "Guardando…" : inicial ? "Guardar" : `Agregar ${singular.toLowerCase()}`}
      </button>
      <button type="button" onClick={onCancelar} disabled={guardando} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">
        Cancelar
      </button>
      {error && <p role="alert" className="w-full text-xs text-vera-coral-fuerte">{error}</p>}
    </form>
  );
}

export function ListaEditable(props: Props) {
  const { titulo, singular, etiquetaCategoria, opciones, items, esAdmin, textoVacio, guardar, borrar, avisoAlBorrar } = props;
  const router = useRouter();
  const [editando, setEditando] = useState<string | "nuevo" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const etiqueta = (valor: string) => opciones.find((o) => o.value === valor)?.label ?? valor;

  async function onGuardar(id: string | null, datos: { nombre: string; categoria: string }): Promise<string | null> {
    try {
      const resultado = await guardar(id, datos);
      if (!resultado.ok) return resultado.mensaje ?? "No se pudo guardar. Intenta de nuevo.";
      setEditando(null);
      router.refresh();
      return null;
    } catch {
      return "No se pudo guardar. Intenta de nuevo.";
    }
  }

  async function onBorrar(item: ItemEditable) {
    if (!window.confirm(`¿Borrar ${item.nombre}? ${avisoAlBorrar}`)) return;
    setError(null);
    try {
      const resultado = await borrar(item.id);
      if (resultado.ok) router.refresh();
      else setError(resultado.mensaje ?? "No se pudo borrar. Intenta de nuevo.");
    } catch {
      setError("No se pudo borrar. Intenta de nuevo.");
    }
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">{titulo}</h2>
        {esAdmin && editando === null && (
          <button
            type="button"
            onClick={() => setEditando("nuevo")}
            className="min-h-11 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-secondary"
          >
            + Agregar
          </button>
        )}
      </div>
      {error && <p role="alert" className="mb-2 text-sm text-vera-coral-fuerte">{error}</p>}
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {editando === "nuevo" && (
          <li>
            <Formulario
              opciones={opciones} etiquetaCategoria={etiquetaCategoria} singular={singular}
              onGuardar={(datos) => onGuardar(null, datos)} onCancelar={() => setEditando(null)}
            />
          </li>
        )}
        {items.map((item) =>
          editando === item.id ? (
            <li key={item.id}>
              <Formulario
                inicial={item} opciones={opciones} etiquetaCategoria={etiquetaCategoria} singular={singular}
                onGuardar={(datos) => onGuardar(item.id, datos)} onCancelar={() => setEditando(null)}
              />
            </li>
          ) : (
            <li key={item.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{item.nombre}</div>
                <div className="text-xs text-muted-foreground">{etiqueta(item.categoria)}</div>
              </div>
              {esAdmin && (
                <>
                  <button
                    type="button" onClick={() => setEditando(item.id)} aria-label={`Editar ${item.nombre}`}
                    className="min-h-10 rounded-lg px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Editar
                  </button>
                  <button
                    type="button" onClick={() => onBorrar(item)} aria-label={`Borrar ${item.nombre}`}
                    className="min-h-10 rounded-lg px-2 text-xs font-semibold text-muted-foreground hover:text-vera-coral-fuerte"
                  >
                    Borrar
                  </button>
                </>
              )}
            </li>
          ),
        )}
        {items.length === 0 && editando !== "nuevo" && <li className="p-8 text-center text-sm text-muted-foreground">{textoVacio}</li>}
      </ul>
    </section>
  );
}
