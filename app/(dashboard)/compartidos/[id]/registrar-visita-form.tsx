"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarVisitaCompartida } from "./actions";

const TIPO_OPCIONES = [
  { value: "consulta", label: "Consulta" },
  { value: "consulta_oftalmologica", label: "Consulta oftalmológica" },
  { value: "cirugia", label: "Cirugía" },
  { value: "examen", label: "Examen" },
  { value: "control", label: "Control" },
];

export function RegistrarVisitaForm({ pacienteId }: { pacienteId: string }) {
  const router = useRouter();
  const [tipo, setTipo] = useState(TIPO_OPCIONES[0].value);
  const [producto, setProducto] = useState("");
  const [vet, setVet] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    if (!producto.trim() || !vet.trim()) return;

    setEnviando(true);
    try {
      const resultado = await registrarVisitaCompartida(pacienteId, { tipo, producto, vet });
      if (resultado.ok) {
        setMensaje("Visita registrada.");
        setProducto("");
        setVet("");
        router.refresh();
      } else {
        setMensaje("No se pudo registrar. Intenta de nuevo.");
      }
    } finally {
      setEnviando(false);
    }
    setTimeout(() => setMensaje(null), 5000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <h3 className="font-display text-sm font-bold">Registrar visita</h3>

      <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
        {TIPO_OPCIONES.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <input
        type="text"
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
        placeholder="Producto/procedimiento"
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <input
        type="text"
        value={vet}
        onChange={(e) => setVet(e.target.value)}
        placeholder="Veterinario"
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-xl bg-vera-emerald px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Registrando…" : "Registrar"}
      </button>

      {mensaje && <p className="text-xs text-muted-foreground">{mensaje}</p>}
    </form>
  );
}
