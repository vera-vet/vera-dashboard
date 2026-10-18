"use client";

import { useId, useState } from "react";
import { Camera, X } from "lucide-react";
import { reducirImagen } from "@/lib/imagen-cliente";
import { subirImagen } from "@/app/(dashboard)/actions-imagenes";

const MAXIMO = 6;

/** Fotos del reporte de una visita: se suben al elegirlas; `fotos` son las rutas ya guardadas. */
export function SelectorFotos({ fotos, onCambio }: { fotos: string[]; onCambio: (fotos: string[]) => void }) {
  const id = useId();
  const [subiendo, setSubiendo] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function elegir(archivos: FileList | null) {
    const elegidos = Array.from(archivos ?? []).slice(0, MAXIMO - fotos.length);
    if (elegidos.length === 0) return;
    setError(null);
    setSubiendo(elegidos.length);
    const subidas: string[] = [];
    for (const archivo of elegidos) {
      const formData = new FormData();
      formData.append("archivo", await reducirImagen(archivo), "foto.jpg");
      const resultado = await subirImagen(formData);
      if (resultado.ok && resultado.url) subidas.push(resultado.url);
      else setError(resultado.mensaje ?? "Alguna foto no se pudo subir.");
      setSubiendo((n) => n - 1);
    }
    onCambio([...fotos, ...subidas]);
  }

  return (
    <div>
      <p id={`${id}-etiqueta`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fotos (opcional)</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {fotos.map((url, i) => (
          <div key={url} className="relative">
            <img src={url} alt={`Foto ${i + 1}`} className="h-16 w-16 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => onCambio(fotos.filter((f) => f !== url))}
              aria-label={`Quitar la foto ${i + 1}`}
              className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border border-border bg-card"
            >
              <X size={12} aria-hidden />
            </button>
          </div>
        ))}
        {fotos.length < MAXIMO && (
          <label className="grid h-16 w-16 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
            <input
              type="file" accept="image/*" multiple className="sr-only" aria-labelledby={`${id}-etiqueta`} disabled={subiendo > 0}
              onChange={(e) => {
                elegir(e.target.files);
                e.target.value = "";
              }}
            />
            {subiendo > 0 ? "Subiendo…" : <><Camera size={16} aria-hidden /><span className="sr-only">Agregar foto</span></>}
          </label>
        )}
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-vera-coral-fuerte">{error}</p>}
    </div>
  );
}
