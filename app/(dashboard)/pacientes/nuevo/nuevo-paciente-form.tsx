"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hoyISOElSalvador } from "@/lib/date";
import { SelectorFoto } from "@/components/shared/selector-foto";
import { buscarDueno, crearDueno, crearPaciente } from "./actions";

const ESPECIE_OPCIONES = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "otro", label: "Otro" },
];

export function NuevoPacienteForm() {
  const router = useRouter();
  const [paso, setPaso] = useState<"dueno" | "paciente">("dueno");
  const [whatsapp, setWhatsapp] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [whatsappBuscado, setWhatsappBuscado] = useState<string | null>(null);
  const [duenoId, setDuenoId] = useState<string | null>(null);
  const [duenoNombreExistente, setDuenoNombreExistente] = useState<string | null>(null);
  const [duenoNombreNuevo, setDuenoNombreNuevo] = useState("");
  // WhatsApp exige el consentimiento del dueño para mandarle recordatorios.
  const [aceptaWhatsapp, setAceptaWhatsapp] = useState(true);
  const [guardandoDueno, setGuardandoDueno] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState(ESPECIE_OPCIONES[0].value);
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState<"M" | "H">("M");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [esterilizado, setEsterilizado] = useState(false);
  const [vacunasCompletas, setVacunasCompletas] = useState(0);
  const [vacunasTotal, setVacunasTotal] = useState(0);
  const [fotoUrl, setFotoUrl] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function buscar() {
    if (!whatsapp.trim()) return;
    setBuscando(true);
    try {
      const dueno = await buscarDueno(whatsapp);
      if (dueno) {
        setDuenoId(dueno.id);
        setDuenoNombreExistente(dueno.nombre);
      } else {
        setDuenoId(null);
        setDuenoNombreExistente(null);
      }
      setWhatsappBuscado(whatsapp.trim());
    } catch {
      setMensaje("No se pudo buscar. Intenta de nuevo.");
    } finally {
      setBuscando(false);
    }
  }

  async function continuarConDueno() {
    if (whatsappBuscado !== whatsapp.trim()) {
      setMensaje("Busca el número primero.");
      return;
    }
    if (duenoId) {
      setPaso("paciente");
      return;
    }
    if (!duenoNombreNuevo.trim()) {
      setMensaje("Escribe el nombre del dueño.");
      return;
    }
    if (guardandoDueno) return;
    setGuardandoDueno(true);
    try {
      const resultado = await crearDueno({ nombre: duenoNombreNuevo, whatsapp, aceptaWhatsapp });
      if (!resultado.ok || !resultado.id) {
        setMensaje(resultado.mensaje ?? "No se pudo crear el dueño. Intenta de nuevo.");
        return;
      }
      setDuenoId(resultado.id);
      setPaso("paciente");
    } finally {
      setGuardandoDueno(false);
    }
  }

  async function guardarPaciente(e: React.FormEvent) {
    e.preventDefault();
    if (guardando || !duenoId) return;
    if (!nombre.trim() || !raza.trim() || !fechaNacimiento) {
      setMensaje("Completa nombre, raza y fecha de nacimiento.");
      return;
    }
    setGuardando(true);
    try {
      const resultado = await crearPaciente({
        duenoId, nombre, especie, raza, sexo, fechaNacimiento,
        esterilizado, vacunasCompletas, vacunasTotal, fotoUrl,
      });
      if (resultado.ok && resultado.id) {
        router.push(`/pacientes/${resultado.id}`);
      } else {
        setMensaje(resultado.mensaje ?? "No se pudo crear el paciente. Intenta de nuevo.");
      }
    } catch {
      setMensaje("No se pudo crear el paciente. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  if (paso === "dueno") {
    return (
      <div className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Dueño</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              setDuenoId(null);
              setDuenoNombreExistente(null);
              setWhatsappBuscado(null);
              setDuenoNombreNuevo("");
              setMensaje(null);
            }}
            placeholder="WhatsApp del dueño"
            aria-label="WhatsApp del dueño"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={buscar}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary/50"
          >
            {buscando ? "Buscando…" : "Buscar"}
          </button>
        </div>

        {duenoNombreExistente && (
          <p className="text-sm text-vera-apoyo">Encontrado: {duenoNombreExistente}</p>
        )}

        {whatsappBuscado === whatsapp.trim() && !duenoId && !buscando && (
          <input
            type="text"
            value={duenoNombreNuevo}
            onChange={(e) => setDuenoNombreNuevo(e.target.value)}
            placeholder="Nombre del dueño (no encontrado, se creará uno nuevo)"
            aria-label="Nombre del dueño"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        )}

        {whatsappBuscado === whatsapp.trim() && !duenoId && !buscando && (
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox" checked={aceptaWhatsapp} onChange={(e) => setAceptaWhatsapp(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-vera-verde"
            />
            <span>
              Acepta recibir recordatorios por WhatsApp
              <span className="block text-xs text-muted-foreground">Confírmalo con el dueño. Puede darse de baja cuando quiera respondiendo BAJA.</span>
            </span>
          </label>
        )}

        {mensaje && <p className="text-xs text-vera-coral-fuerte">{mensaje}</p>}

        <button
          type="button"
          onClick={continuarConDueno}
          disabled={guardandoDueno}
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {guardandoDueno ? "Guardando…" : "Continuar"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={guardarPaciente} className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-bold">Paciente</h2>

      <input
        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre" aria-label="Nombre del paciente" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <select aria-label="Especie" value={especie} onChange={(e) => setEspecie(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
        {ESPECIE_OPCIONES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <input
        type="text" value={raza} onChange={(e) => setRaza(e.target.value)}
        placeholder="Raza" aria-label="Raza" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <select aria-label="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value as "M" | "H")} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
        <option value="M">Macho</option>
        <option value="H">Hembra</option>
      </select>

      <div>
        <label htmlFor="paciente-fecha-nacimiento" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fecha de nacimiento</label>
        <input
          id="paciente-fecha-nacimiento" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)}
          max={hoyISOElSalvador()}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={esterilizado} onChange={(e) => setEsterilizado(e.target.checked)} />
        Esterilizado
      </label>

      <SelectorFoto valor={fotoUrl} onCambio={setFotoUrl} etiqueta="Foto (opcional)" inicial={nombre} />

      <div className="flex gap-2">
        <div className="w-1/2">
          <label htmlFor="paciente-vacunas-completas" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vacunas completas</label>
          <input
            id="paciente-vacunas-completas" type="number" min={0} value={vacunasCompletas} onChange={(e) => setVacunasCompletas(Number(e.target.value))}
            placeholder="Vacunas completas" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="paciente-vacunas-totales" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vacunas totales</label>
          <input
            id="paciente-vacunas-totales" type="number" min={0} value={vacunasTotal} onChange={(e) => setVacunasTotal(Number(e.target.value))}
            placeholder="Vacunas totales" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {mensaje && <p className="text-xs text-vera-coral-fuerte">{mensaje}</p>}

      <button
        type="submit" disabled={guardando}
        className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {guardando ? "Guardando…" : "Crear paciente"}
      </button>
    </form>
  );
}
