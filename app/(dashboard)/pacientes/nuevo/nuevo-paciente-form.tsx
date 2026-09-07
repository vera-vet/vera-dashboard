"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [duenoId, setDuenoId] = useState<string | null>(null);
  const [duenoNombreExistente, setDuenoNombreExistente] = useState<string | null>(null);
  const [duenoNombreNuevo, setDuenoNombreNuevo] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState(ESPECIE_OPCIONES[0].value);
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState<"M" | "H">("M");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [esterilizado, setEsterilizado] = useState(false);
  const [vacunasCompletas, setVacunasCompletas] = useState(0);
  const [vacunasTotal, setVacunasTotal] = useState(0);
  const [guardando, setGuardando] = useState(false);

  async function buscar() {
    if (!whatsapp.trim()) return;
    setBuscando(true);
    const dueno = await buscarDueno(whatsapp);
    if (dueno) {
      setDuenoId(dueno.id);
      setDuenoNombreExistente(dueno.nombre);
    } else {
      setDuenoId(null);
      setDuenoNombreExistente(null);
    }
    setBuscando(false);
  }

  async function continuarConDueno() {
    if (duenoId) {
      setPaso("paciente");
      return;
    }
    if (!duenoNombreNuevo.trim()) {
      setMensaje("Escribe el nombre del dueño.");
      return;
    }
    const resultado = await crearDueno({ nombre: duenoNombreNuevo, whatsapp });
    if (!resultado.ok || !resultado.id) {
      setMensaje("No se pudo crear el dueño. Intenta de nuevo.");
      return;
    }
    setDuenoId(resultado.id);
    setPaso("paciente");
  }

  async function guardarPaciente(e: React.FormEvent) {
    e.preventDefault();
    if (guardando || !duenoId) return;
    if (!nombre.trim() || !raza.trim() || !fechaNacimiento) {
      setMensaje("Completa nombre, raza y fecha de nacimiento.");
      return;
    }
    setGuardando(true);
    const resultado = await crearPaciente({
      duenoId, nombre, especie, raza, sexo, fechaNacimiento,
      esterilizado, vacunasCompletas, vacunasTotal,
    });
    setGuardando(false);
    if (resultado.ok && resultado.id) {
      router.push(`/pacientes/${resultado.id}`);
    } else {
      setMensaje("No se pudo crear el paciente. Intenta de nuevo.");
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
              setMensaje(null);
            }}
            placeholder="WhatsApp del dueño"
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
          <p className="text-sm text-vera-emerald">Encontrado: {duenoNombreExistente}</p>
        )}

        {!duenoId && whatsapp.trim() && !buscando && (
          <input
            type="text"
            value={duenoNombreNuevo}
            onChange={(e) => setDuenoNombreNuevo(e.target.value)}
            placeholder="Nombre del dueño (no encontrado, se creará uno nuevo)"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        )}

        {mensaje && <p className="text-xs text-vera-coral">{mensaje}</p>}

        <button
          type="button"
          onClick={continuarConDueno}
          className="w-full rounded-xl bg-vera-emerald px-4 py-2 text-sm font-semibold text-white"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={guardarPaciente} className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-bold">Paciente</h2>

      <input
        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <select value={especie} onChange={(e) => setEspecie(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
        {ESPECIE_OPCIONES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <input
        type="text" value={raza} onChange={(e) => setRaza(e.target.value)}
        placeholder="Raza" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <select value={sexo} onChange={(e) => setSexo(e.target.value as "M" | "H")} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
        <option value="M">Macho</option>
        <option value="H">Hembra</option>
      </select>

      <input
        type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={esterilizado} onChange={(e) => setEsterilizado(e.target.checked)} />
        Esterilizado
      </label>

      <div className="flex gap-2">
        <input
          type="number" min={0} value={vacunasCompletas} onChange={(e) => setVacunasCompletas(Number(e.target.value))}
          placeholder="Vacunas completas" className="w-1/2 rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="number" min={0} value={vacunasTotal} onChange={(e) => setVacunasTotal(Number(e.target.value))}
          placeholder="Vacunas totales" className="w-1/2 rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {mensaje && <p className="text-xs text-vera-coral">{mensaje}</p>}

      <button
        type="submit" disabled={guardando}
        className="w-full rounded-xl bg-vera-emerald px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {guardando ? "Guardando…" : "Crear paciente"}
      </button>
    </form>
  );
}
