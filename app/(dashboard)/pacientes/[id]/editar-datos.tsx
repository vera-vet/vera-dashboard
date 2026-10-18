"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import type { Dueno, Paciente } from "@/lib/data/types";
import { hoyISOElSalvador } from "@/lib/date";
import { actualizarDueno, actualizarPaciente } from "./actions";

const CAMPO = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm";
const ETIQUETA = "text-xs font-semibold text-muted-foreground";

type Mensaje = { texto: string; error: boolean } | null;

function Aviso({ mensaje }: { mensaje: Mensaje }) {
  if (!mensaje) return null;
  return (
    <p role={mensaje.error ? "alert" : "status"} className={mensaje.error ? "text-sm text-vera-coral-fuerte" : "text-sm text-vera-apoyo"}>
      {mensaje.texto}
    </p>
  );
}

function FormularioPaciente({ paciente }: { paciente: Paciente }) {
  const router = useRouter();
  const id = useId();
  const [datos, setDatos] = useState({
    nombre: paciente.nombre,
    especie: paciente.especie as string,
    raza: paciente.raza,
    sexo: paciente.sexo as string,
    fechaNacimiento: paciente.fechaNacimiento,
    esterilizado: paciente.esterilizado,
    vacunasCompletas: paciente.vacunasCompletas,
    vacunasTotal: paciente.vacunasTotal,
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje>(null);
  const cambiar = (campo: keyof typeof datos, valor: string | number | boolean) => setDatos((d) => ({ ...d, [campo]: valor }));

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    setMensaje(null);
    try {
      const resultado = await actualizarPaciente(paciente.id, { ...datos, nombre: datos.nombre.trim(), raza: datos.raza.trim() });
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
    <form onSubmit={guardar} className="space-y-3">
      <h3 className="font-display text-base font-bold">Paciente</h3>
      <div>
        <label htmlFor={`${id}-nombre`} className={ETIQUETA}>Nombre</label>
        <input id={`${id}-nombre`} value={datos.nombre} onChange={(e) => cambiar("nombre", e.target.value)} maxLength={100} className={CAMPO} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-especie`} className={ETIQUETA}>Especie</label>
          <select id={`${id}-especie`} value={datos.especie} onChange={(e) => cambiar("especie", e.target.value)} className={CAMPO}>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-sexo`} className={ETIQUETA}>Sexo</label>
          <select id={`${id}-sexo`} value={datos.sexo} onChange={(e) => cambiar("sexo", e.target.value)} className={CAMPO}>
            <option value="M">Macho</option>
            <option value="H">Hembra</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-raza`} className={ETIQUETA}>Raza</label>
          <input id={`${id}-raza`} value={datos.raza} onChange={(e) => cambiar("raza", e.target.value)} maxLength={100} className={CAMPO} />
        </div>
        <div>
          <label htmlFor={`${id}-nacimiento`} className={ETIQUETA}>Fecha de nacimiento</label>
          <input
            id={`${id}-nacimiento`} type="date" value={datos.fechaNacimiento} max={hoyISOElSalvador()}
            onChange={(e) => cambiar("fechaNacimiento", e.target.value)} className={CAMPO}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-completas`} className={ETIQUETA}>Vacunas aplicadas</label>
          <input
            id={`${id}-completas`} type="number" min={0} value={datos.vacunasCompletas}
            onChange={(e) => cambiar("vacunasCompletas", Number(e.target.value))} className={CAMPO}
          />
        </div>
        <div>
          <label htmlFor={`${id}-total`} className={ETIQUETA}>Dosis del esquema</label>
          <input
            id={`${id}-total`} type="number" min={0} value={datos.vacunasTotal}
            onChange={(e) => cambiar("vacunasTotal", Number(e.target.value))} className={CAMPO}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={datos.esterilizado} onChange={(e) => cambiar("esterilizado", e.target.checked)} className="h-4 w-4 accent-vera-verde" />
        Esterilizado
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={guardando} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {guardando ? "Guardando…" : "Guardar paciente"}
        </button>
        <Aviso mensaje={mensaje} />
      </div>
    </form>
  );
}

function FormularioDueno({ dueno }: { dueno: Dueno }) {
  const router = useRouter();
  const id = useId();
  const [nombre, setNombre] = useState(dueno.nombre);
  const [whatsapp, setWhatsapp] = useState(dueno.whatsapp);
  const [acepta, setAcepta] = useState(dueno.aceptaWhatsapp);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    setMensaje(null);
    try {
      const resultado = await actualizarDueno(dueno.id, { nombre: nombre.trim(), whatsapp: whatsapp.trim(), aceptaWhatsapp: acepta });
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
    <form onSubmit={guardar} className="space-y-3">
      <h3 className="font-display text-base font-bold">Dueño</h3>
      <p className="text-xs text-muted-foreground">Cambia el contacto de todas sus mascotas.</p>
      <div>
        <label htmlFor={`${id}-nombre`} className={ETIQUETA}>Nombre</label>
        <input id={`${id}-nombre`} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={150} className={CAMPO} />
      </div>
      <div>
        <label htmlFor={`${id}-whatsapp`} className={ETIQUETA}>WhatsApp</label>
        <input id={`${id}-whatsapp`} type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={30} className={CAMPO} />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 h-4 w-4 accent-vera-verde" />
        <span>
          Acepta recibir recordatorios por WhatsApp
          <span className="block text-xs text-muted-foreground">Si respondió BAJA, aquí aparece desmarcado.</span>
        </span>
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={guardando} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {guardando ? "Guardando…" : "Guardar dueño"}
        </button>
        <Aviso mensaje={mensaje} />
      </div>
    </form>
  );
}

export function EditarDatos({ paciente, dueno }: { paciente: Paciente; dueno: Dueno | undefined }) {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-secondary/50"
      >
        <Pencil size={16} aria-hidden /> Editar datos
      </button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5">
      <div className="grid gap-8 md:grid-cols-2">
        <FormularioPaciente paciente={paciente} />
        {dueno && <FormularioDueno dueno={dueno} />}
      </div>
      <button type="button" onClick={() => setAbierto(false)} className="mt-4 min-h-11 text-sm font-semibold text-muted-foreground underline">
        Cerrar
      </button>
    </div>
  );
}
