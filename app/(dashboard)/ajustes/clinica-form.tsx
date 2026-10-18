"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MiClinica } from "@/lib/data/types";
import { actualizarClinica } from "./actions";

const CAMPO = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base disabled:opacity-70 md:text-sm";

export function ClinicaForm({ clinica, esAdmin }: { clinica: MiClinica; esAdmin: boolean }) {
  const router = useRouter();
  const [nombre, setNombre] = useState(clinica.nombre);
  const [whatsapp, setWhatsapp] = useState(clinica.whatsapp);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; error: boolean } | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    setMensaje(null);
    try {
      const resultado = await actualizarClinica({ nombre: nombre.trim(), whatsapp: whatsapp.trim() });
      if (resultado.ok) {
        setMensaje({ texto: "Guardado.", error: false });
        router.refresh();
      } else {
        setMensaje({ texto: resultado.mensaje ?? "No se pudo guardar. Intenta de nuevo.", error: true });
      }
    } catch {
      setMensaje({ texto: "No se pudo guardar. Intenta de nuevo.", error: true });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <div>
        <label htmlFor="clinica-nombre" className="text-xs font-semibold text-muted-foreground">Nombre de la clínica</label>
        <input
          id="clinica-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={200}
          disabled={!esAdmin} className={CAMPO}
        />
        <p className="mt-1 text-xs text-muted-foreground">Así se presenta Vera en cada WhatsApp: &ldquo;Soy Vera, la asistente de {nombre || "tu clínica"}&rdquo;.</p>
      </div>
      <div>
        <label htmlFor="clinica-whatsapp" className="text-xs font-semibold text-muted-foreground">WhatsApp de la clínica</label>
        <input
          id="clinica-whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={30}
          placeholder="Ej. 2222 3333" disabled={!esAdmin} className={CAMPO}
        />
        <p className="mt-1 text-xs text-muted-foreground">Aparece en el carnet digital para que el dueño agende escribiéndoles.</p>
      </div>
      {esAdmin ? (
        <div className="flex items-center gap-3">
          <button type="submit" disabled={guardando} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {guardando ? "Guardando…" : "Guardar"}
          </button>
          {mensaje && (
            <p role={mensaje.error ? "alert" : "status"} className={mensaje.error ? "text-sm text-vera-coral-fuerte" : "text-sm text-vera-apoyo"}>
              {mensaje.texto}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Solo el administrador de la clínica puede cambiar estos datos.</p>
      )}
    </form>
  );
}
