import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPacienteCompartido, getServiciosCompartido, getNotasConsultaCompartido } from "@/lib/data/comparticiones";
import { edadTexto, formatFechaCorta, formatFechaHoraCorta } from "@/lib/date";
import { RegistrarVisitaForm } from "./registrar-visita-form";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

export default async function PacienteCompartidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await getPacienteCompartido(id);
  if (!paciente) notFound();

  const servicios = await getServiciosCompartido(id);
  const notas = await getNotasConsultaCompartido(id);

  return (
    <div>
      <Link href="/compartidos" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeft size={14} /> Compartidos
      </Link>

      <h1 className="font-display text-3xl font-bold text-vera-forest">{paciente.nombre}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {edadTexto(paciente.fechaNacimiento)} · {paciente.sexo === "M" ? "Macho" : "Hembra"}
      </p>
      {paciente.alergias.length > 0 && (
        <p className="mt-2 text-sm"><span className="font-semibold">Alergias:</span> {paciente.alergias.join(", ")}</p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Historial clínico</h2>
          <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {servicios.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Sin visitas registradas.</li>}
            {servicios.map((s) => (
              <li key={s.id} className="p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold">{s.tipo}</span>
                  <span>{formatFechaCorta(s.fecha)}</span>
                </div>
                <p className="mt-1 text-sm">{s.producto} · {s.vet}</p>
              </li>
            ))}
          </ol>

          <h2 className="mb-3 mt-8 font-display text-lg font-bold">Transcripciones</h2>
          <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {notas.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Sin transcripciones registradas.</li>}
            {[...notas].reverse().map((n) => (
              <li key={n.id} className="p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold">{n.empleadoNombre}</span>
                  <span>{formatFechaHoraCorta(n.fechaHora)}</span>
                </div>
                <p className="mt-2 text-sm">{n.transcripcion}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside>
          <RegistrarVisitaForm pacienteId={paciente.id} />
        </aside>
      </div>
    </div>
  );
}
