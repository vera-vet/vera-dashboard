"use client";

import { useState } from "react";
import { Bug, Check, Eye, Scissors, Shield, Stethoscope, Syringe, X } from "lucide-react";
import type { Paciente, ServicioTipo, Especialidad, Marca } from "@/lib/data/types";
import { resolverDiagramaTipo } from "@/lib/data/especialidades";
import { SiluetaMarcable } from "@/components/shared/silueta-marcable";
import { Textarea } from "@/components/ui/textarea";

interface Producto {
  nombre: string;
  compuestos?: string[];
}

const TIPOS: { key: ServicioTipo; label: string; icon: typeof Syringe; productos: Producto[] }[] = [
  {
    key: "vacuna", label: "Vacuna", icon: Syringe,
    productos: [{ nombre: "Séxtuple" }, { nombre: "Rabia" }, { nombre: "Triple felina" }, { nombre: "Refuerzo anual" }],
  },
  {
    key: "desparasitacion", label: "Desparasitación", icon: Bug,
    productos: [{ nombre: "Ivermectina" }, { nombre: "Praziquantel" }],
  },
  {
    key: "preventivo", label: "Preventivo", icon: Shield,
    productos: [{ nombre: "Antipulgas mensual" }],
  },
  {
    key: "consulta", label: "Consulta", icon: Stethoscope,
    productos: [
      { nombre: "General" },
      { nombre: "Dermatológica" },
      { nombre: "Amoxicilina + Ácido Clavulánico", compuestos: ["amoxicilina"] },
    ],
  },
  {
    key: "consulta_oftalmologica", label: "Consulta oftalmológica", icon: Eye,
    productos: [{ nombre: "Revisión oftalmológica" }],
  },
  {
    key: "cirugia", label: "Cirugía", icon: Scissors,
    productos: [{ nombre: "Esterilización" }, { nombre: "Extracción dental" }],
  },
];

export function RegistrarClient({ pacientes, especialidades }: { pacientes: Paciente[]; especialidades: Especialidad[] }) {
  const [selectedId, setSelectedId] = useState(pacientes[0]?.id ?? "");
  const [tipo, setTipo] = useState<ServicioTipo | null>(null);
  const [productoElegido, setProductoElegido] = useState<Producto | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [fotos, setFotos] = useState<string[]>([]);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  const paciente = pacientes.find((p) => p.id === selectedId);
  const tipoObj = TIPOS.find((t) => t.key === tipo);

  function resetPasoFinal() {
    setProductoElegido(null);
    setMarcas([]);
    setFotos([]);
  }

  function registrar(nombreProducto: string) {
    if (!paciente) return;
    setConfirmacion(`${paciente.nombre} · ${nombreProducto}. Vera programó el recordatorio automáticamente.`);
    setTipo(null);
    resetPasoFinal();
    setTimeout(() => setConfirmacion(null), 6000);
  }

  const alergiaEnConflicto =
    paciente && productoElegido?.compuestos?.find((c) => paciente.alergias.includes(c));

  function handleFotoChange(files: FileList | null) {
    if (!files) return;
    const nuevas = Array.from(files).map((f) => URL.createObjectURL(f));
    setFotos((prev) => [...prev, ...nuevas]);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {pacientes.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedId(p.id);
              setTipo(null);
              resetPasoFinal();
            }}
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
            ) : !productoElegido ? (
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
                      key={prod.nombre}
                      onClick={() => setProductoElegido(prod)}
                      className="rounded-xl bg-vera-emerald px-4 py-3 text-left text-sm font-semibold text-white"
                    >
                      {prod.nombre}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{productoElegido.nombre} — reporte de la visita (opcional)</h3>
                  <button onClick={resetPasoFinal} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <X size={13} /> Cancelar
                  </button>
                </div>

                {alergiaEnConflicto && (
                  <div className="mb-4 rounded-xl border border-vera-coral bg-vera-coral-soft p-3 text-sm text-vera-coral">
                    <strong className="font-semibold">Alerta de alergia:</strong> {paciente.nombre} tiene registrada una alergia a{" "}
                    <strong className="font-semibold">{alergiaEnConflicto}</strong>, presente en este producto.
                  </div>
                )}

                <SiluetaMarcable
                  diagramaTipo={resolverDiagramaTipo(tipo!, especialidades, paciente.especie)}
                  marcas={marcas}
                  modo="interactivo"
                  onAgregarMarca={(m) => setMarcas((prev) => [...prev, { ...m, id: crypto.randomUUID() }])}
                  onEliminarMarca={(id) => setMarcas((prev) => prev.filter((m) => m.id !== id))}
                />

                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fotos</label>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {fotos.map((url, i) => (
                      <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    ))}
                    <label className="grid h-16 w-16 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFotoChange(e.target.files)} />
                      + Foto
                    </label>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => registrar(productoElegido.nombre)}
                    className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Omitir y confirmar
                  </button>
                  <button
                    onClick={() => registrar(productoElegido.nombre)}
                    className="min-h-11 rounded-xl bg-vera-emerald px-4 text-sm font-semibold text-white"
                  >
                    Guardar reporte y confirmar
                  </button>
                </div>
              </>
            )}

            {!tipo && (
              <>
                <div className="mb-2 mt-8 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Servicios frecuentes · {paciente.nombre}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tipo: "vacuna" as ServicioTipo, prod: "Séxtuple 1ª dosis" },
                    { tipo: "vacuna" as ServicioTipo, prod: "Rabia" },
                    { tipo: "preventivo" as ServicioTipo, prod: "Antipulgas mensual" },
                  ].map(({ tipo: t, prod }) => (
                    <button
                      key={prod}
                      onClick={() => {
                        setTipo(t);
                        registrar(prod);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold text-white"
                      style={{ backgroundColor: "var(--vera-emerald)", borderColor: "var(--vera-emerald)" }}
                    >
                      <Check size={13} /> {prod}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Nota clínica (opcional)</label>
              <Textarea rows={3} placeholder="Escribe la nota…" className="mt-2" />
            </div>
          </section>

          <aside className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-display text-[14px] font-bold">¿Qué hará Vera?</h3>
            <ul className="mt-3 space-y-2.5 text-[12px] text-muted-foreground">
              <li>Guarda la visita en el expediente.</li>
              <li>Programa el próximo recordatorio automáticamente.</li>
              <li>Envía el aviso por WhatsApp cuando toque.</li>
            </ul>
          </aside>
        </div>
      )}

      {confirmacion && (
        <div
          className="fixed bottom-24 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl border p-4 shadow-lg lg:bottom-8"
          style={{ backgroundColor: "var(--vera-emerald)", borderColor: "var(--vera-emerald)", color: "white" }}
          role="status"
        >
          <Check size={18} className="mt-0.5 shrink-0" />
          <p className="text-[13px]">{confirmacion}</p>
        </div>
      )}
    </div>
  );
}
