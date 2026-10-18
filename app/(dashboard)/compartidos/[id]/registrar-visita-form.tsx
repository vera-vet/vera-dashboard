"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIPO_SERVICIO_LABEL } from "@/lib/data/registro";
import type { ServicioTipo } from "@/lib/data/types";
import { Textarea } from "@/components/ui/textarea";
import { registrarVisitaCompartida } from "./actions";

// Una clínica receptora registra lo que hizo; las vacunas y la desparasitación las lleva la
// clínica dueña del expediente.
const TIPOS: ServicioTipo[] = ["consulta", "consulta_oftalmologica", "cirugia", "examen", "control"];

const CAMPO = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm";

export function RegistrarVisitaForm({ pacienteId }: { pacienteId: string }) {
  const router = useRouter();
  const [tipo, setTipo] = useState<ServicioTipo>(TIPOS[0]);
  const [producto, setProducto] = useState("");
  const [vet, setVet] = useState("");
  const [nota, setNota] = useState("");
  const [mensaje, setMensaje] = useState<{ texto: string; error: boolean } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    if (!producto.trim()) {
      setMensaje({ texto: "Escribe el producto o procedimiento.", error: true });
      return;
    }

    setEnviando(true);
    try {
      const resultado = await registrarVisitaCompartida(pacienteId, { tipo, producto: producto.trim(), vet, nota });
      if (resultado.ok) {
        setMensaje({ texto: "Visita registrada.", error: false });
        setProducto("");
        setVet("");
        setNota("");
        router.refresh();
      } else {
        setMensaje({ texto: resultado.mensaje ?? "No se pudo registrar. Intenta de nuevo.", error: true });
      }
    } catch {
      setMensaje({ texto: "No se pudo registrar. Intenta de nuevo.", error: true });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <h2 className="font-display text-sm font-bold">Registrar visita</h2>

      <div>
        <label htmlFor="compartido-tipo" className="text-xs font-semibold text-muted-foreground">Tipo</label>
        <select id="compartido-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as ServicioTipo)} className={CAMPO}>
          {TIPOS.map((t) => (
            <option key={t} value={t}>{TIPO_SERVICIO_LABEL[t]}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="compartido-producto" className="text-xs font-semibold text-muted-foreground">Producto o procedimiento</label>
        <input
          id="compartido-producto" type="text" value={producto} onChange={(e) => setProducto(e.target.value)} maxLength={150}
          className={CAMPO}
        />
      </div>

      <div>
        <label htmlFor="compartido-vet" className="text-xs font-semibold text-muted-foreground">Veterinario (opcional)</label>
        <input
          id="compartido-vet" type="text" value={vet} onChange={(e) => setVet(e.target.value)} maxLength={150}
          placeholder="Si lo dejas vacío, queda a tu nombre" className={CAMPO}
        />
      </div>

      <div>
        <label htmlFor="compartido-nota" className="text-xs font-semibold text-muted-foreground">Nota clínica (opcional)</label>
        <Textarea id="compartido-nota" rows={3} value={nota} onChange={(e) => setNota(e.target.value)} maxLength={5000} className="mt-1" />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Registrando…" : "Registrar"}
      </button>

      {mensaje && (
        <p role={mensaje.error ? "alert" : "status"} className={mensaje.error ? "text-xs text-vera-coral-fuerte" : "text-xs text-vera-apoyo"}>
          {mensaje.texto}
        </p>
      )}
    </form>
  );
}
