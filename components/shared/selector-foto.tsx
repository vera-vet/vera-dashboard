"use client";

import { useId, useState } from "react";
import { Camera } from "lucide-react";
import { reducirImagen } from "@/lib/imagen-cliente";
import { subirImagen } from "@/app/(dashboard)/actions-imagenes";

/**
 * Una foto (paciente o producto): se elige del teléfono o la computadora, se reduce y se sube a
 * Vera. `valor` es la ruta guardada ("/imagenes/<uuid>") o vacío.
 */
export function SelectorFoto({
  valor,
  onCambio,
  etiqueta,
  inicial,
}: {
  valor: string;
  onCambio: (url: string) => void;
  etiqueta: string;
  /** Letra de respaldo mientras no hay foto. */
  inicial: string;
}) {
  const id = useId();
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function elegir(archivos: FileList | null) {
    const archivo = archivos?.[0];
    if (!archivo) return;
    setSubiendo(true);
    setError(null);
    const formData = new FormData();
    formData.append("archivo", await reducirImagen(archivo), "foto.jpg");
    const resultado = await subirImagen(formData);
    setSubiendo(false);
    if (resultado.ok && resultado.url) onCambio(resultado.url);
    else setError(resultado.mensaje ?? "No se pudo subir la foto.");
  }

  return (
    <div>
      <p id={`${id}-etiqueta`} className="text-xs font-semibold text-muted-foreground">{etiqueta}</p>
      <div className="mt-1 flex items-center gap-3">
        {valor ? (
          <img src={valor} alt="" className="h-16 w-16 rounded-xl border border-border object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-xl border border-dashed border-border font-display text-xl font-bold text-vera-verde">
            {inicial.charAt(0).toUpperCase() || <Camera size={18} aria-hidden />}
          </div>
        )}
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-secondary">
          <input
            type="file" accept="image/*" className="sr-only" aria-labelledby={`${id}-etiqueta`} disabled={subiendo}
            onChange={(e) => {
              elegir(e.target.files);
              e.target.value = "";
            }}
          />
          <Camera size={15} aria-hidden /> {subiendo ? "Subiendo…" : valor ? "Cambiar foto" : "Subir foto"}
        </label>
        {valor && !subiendo && (
          <button type="button" onClick={() => onCambio("")} className="min-h-11 text-sm font-semibold text-muted-foreground underline">
            Quitar
          </button>
        )}
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-vera-coral-fuerte">{error}</p>}
    </div>
  );
}
