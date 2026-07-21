"use client";

import { useState } from "react";
import { Bug, Check, Scissors, Shield, Stethoscope, Syringe, X } from "lucide-react";
import type { Paciente } from "@/lib/data/types";
import type { ServicioTipo } from "@/lib/data/types";
import { Textarea } from "@/components/ui/textarea";

const TIPOS: { key: ServicioTipo; label: string; icon: typeof Syringe; productos: string[] }[] = [
  { key: "vacuna", label: "Vacuna", icon: Syringe, productos: ["Séxtuple", "Rabia", "Triple felina", "Refuerzo anual"] },
  { key: "desparasitacion", label: "Desparasitación", icon: Bug, productos: ["Ivermectina", "Praziquantel"] },
  { key: "preventivo", label: "Preventivo", icon: Shield, productos: ["Antipulgas mensual"] },
  { key: "consulta", label: "Consulta", icon: Stethoscope, productos: ["General", "Dermatológica"] },
  { key: "cirugia", label: "Cirugía", icon: Scissors, productos: ["Esterilización", "Extracción dental"] },
];

export function RegistrarClient({ pacientes }: { pacientes: Paciente[] }) {
  const [selectedId, setSelectedId] = useState(pacientes[0]?.id ?? "");
  const [tipo, setTipo] = useState<ServicioTipo | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);
  const paciente = pacientes.find((p) => p.id === selectedId);
  const tipoObj = TIPOS.find((t) => t.key === tipo);

  function registrar(producto: string) {
    if (!paciente) return;
    setConfirmacion(`${paciente.nombre} · ${producto}. Vera programó el recordatorio automáticamente.`);
    setTipo(null);
    setTimeout(() => setConfirmacion(null), 6000);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {pacientes.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={
              p.id === selectedId
                ? "flex items-center gap-2 rounded-full bg-vera-forest px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                : "flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
            }
          >
            <img src={p.fotoUrl} alt={p.nombre} className="h-5 w-5 rounded-full object-cover" />
            {p.nombre}
          </button>
        ))}
      </div>

      {paciente && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section>
            {!tipo ? (
              <>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">¿Qué se hizo?</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TIPOS.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTipo(key)}
                      className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left hover:border-vera-emerald"
                    >
                      <Icon size={20} className="text-vera-emerald" />
                      <span className="font-display text-sm font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-2.5 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tipoObj?.label}: elige el producto</h3>
                  <button onClick={() => setTipo(null)} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <X size={13} /> Cancelar
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {tipoObj?.productos.map((prod) => (
                    <button
                      key={prod}
                      onClick={() => registrar(prod)}
                      className="rounded-xl bg-vera-emerald px-4 py-3 text-left text-sm font-semibold text-white"
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nota clínica (opcional)</label>
              <Textarea rows={3} placeholder="Escribe la nota…" className="mt-2" />
            </div>
          </section>

          <aside className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display text-sm font-bold">¿Qué hará Vera?</h3>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
              <li>Guarda la visita en el expediente.</li>
              <li>Programa el próximo recordatorio automáticamente.</li>
              <li>Envía el aviso por WhatsApp cuando toque.</li>
            </ul>
          </aside>
        </div>
      )}

      {confirmacion && (
        <div className="fixed bottom-24 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-2xl bg-vera-emerald p-4 text-white shadow-[var(--shadow-elevated)] lg:bottom-8">
          <Check size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{confirmacion}</p>
        </div>
      )}
    </div>
  );
}
