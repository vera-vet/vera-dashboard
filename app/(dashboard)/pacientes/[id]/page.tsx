import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Download, ExternalLink, MessageCircle, PlusCircle } from "lucide-react";
import { getPaciente, getDueno, getServiciosPorPaciente } from "@/lib/data/pacientes";
import { getVisitasPorPaciente } from "@/lib/data/visitas";
import { getNotasConsultaPorPaciente } from "@/lib/data/notas-consulta";
import { getComparticionesPorPaciente } from "@/lib/data/comparticiones";
import { VaccineTimeline } from "@/components/shared/vaccine-timeline";
import { edadTexto, formatFechaCorta, formatFechaHoraCorta, formatHora, hoyISOElSalvador } from "@/lib/date";
import { DatosClinicos } from "./datos-clinicos";
import { HistorialItem } from "@/components/shared/historial-item";
import { getMe } from "@/lib/data/usuario";
import { linkWhatsApp, primerNombre } from "@/lib/whatsapp";
import { EditarDatos } from "./editar-datos";
import { CompartirPanel } from "./compartir-panel";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

export default async function ExpedientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await getPaciente(id);
  if (!paciente) notFound();

  const [dueno, servicios, visitas, notas, comparticiones, usuario] = await Promise.all([
    getDueno(paciente.duenoId),
    getServiciosPorPaciente(paciente.id),
    getVisitasPorPaciente(paciente.id),
    getNotasConsultaPorPaciente(paciente.id),
    getComparticionesPorPaciente(paciente.id),
    getMe(),
  ]);
  const proximas = visitas.filter((v) => v.fecha >= hoyISOElSalvador());
  const sinVisita = notas.filter((n) => !n.servicioVisitaId);
  // Antes este botón no hacía nada: abre WhatsApp con el saludo de la clínica ya escrito.
  const escribir = dueno
    ? linkWhatsApp(dueno.whatsapp, `Hola, ${primerNombre(dueno.nombre)}. Te escribimos de ${usuario.clinicaNombre} sobre ${paciente.nombre}.`)
    : null;

  return (
    <div>
      <Link href="/pacientes" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeft size={14} /> Pacientes
      </Link>

      <section className="flex flex-wrap items-center gap-6 pb-6">
        <AvatarPaciente nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={96} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold text-vera-verde">{paciente.nombre}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {edadTexto(paciente.fechaNacimiento)} · {paciente.sexo === "M" ? "Macho" : "Hembra"}
          </p>
          <p className="mt-2 text-sm">
            Dueño: <span className="font-semibold">{dueno?.nombre}</span>{" "}
            <span className="text-muted-foreground">· {dueno?.whatsapp}</span>
          </p>
          {dueno && !dueno.aceptaWhatsapp && (
            <p className="mt-1 text-xs font-semibold text-vera-coral-fuerte">No recibe recordatorios por WhatsApp (no lo aceptó o respondió BAJA).</p>
          )}
        </div>
        {escribir && (
          <a
            href={escribir}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-whatsapp-foreground"
          >
            <MessageCircle size={16} aria-hidden /> Escribir a {primerNombre(dueno!.nombre)}
          </a>
        )}
        <Link
          href={`/registrar?paciente=${paciente.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <PlusCircle size={16} aria-hidden /> Registrar visita
        </Link>
        <a
          href={`/api/pacientes/${paciente.id}/expediente-pdf/`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-secondary/50"
        >
          <Download size={16} aria-hidden /> Descargar PDF
        </a>
        <EditarDatos paciente={paciente} dueno={dueno} />
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Ciclo de vacunación</h2>
          <div className="rounded-2xl border border-border bg-card p-6">
            <VaccineTimeline servicios={servicios} vacunasCompletas={paciente.vacunasCompletas} vacunasTotal={paciente.vacunasTotal} />
          </div>

          <h2 className="mb-3 mt-8 font-display text-lg font-bold">Historial clínico</h2>
          <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {servicios.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Sin visitas registradas.</li>}
            {servicios.map((s) => (
              <HistorialItem key={s.id} servicio={s} />
            ))}
          </ol>

          {/* Las notas y transcripciones conectadas a una visita se ven dentro de esa visita; aquí
              quedan las grabaciones que todavía no se conectaron a ninguna. */}
          {sinVisita.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 font-display text-lg font-bold">Transcripciones sin visita</h2>
              <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {[...sinVisita].reverse().map((n) => (
                  <li key={n.id} className="p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold">{n.empleadoNombre}</span>
                      <span>{formatFechaHoraCorta(n.fechaHora)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm">{n.transcripcion}</p>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold">Próximas citas</h3>
              <Link href={`/agenda?paciente=${paciente.id}`} className="text-xs font-semibold text-vera-apoyo underline">
                Agendar cita
              </Link>
            </div>
            {proximas.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">Sin citas programadas.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {proximas.slice(0, 5).map((v) => (
                  <li key={v.id} className="text-sm">
                    <div className="font-medium">{v.motivo}</div>
                    <div className="text-xs text-muted-foreground">{formatFechaCorta(v.fecha)}{v.hora ? ` · ${formatHora(v.hora)}` : ""}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DatosClinicos pacienteId={paciente.id} alergiasIniciales={paciente.alergias} notasIniciales={paciente.notasComportamiento} />

          <CompartirPanel pacienteId={paciente.id} comparticionesIniciales={comparticiones} />

          <Link
            href={`/carnet/${paciente.carnetToken}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:bg-secondary/50"
          >
            <div>
              <div className="font-display text-sm font-bold">Carnet del dueño</div>
              <div className="text-xs text-muted-foreground">Lo que ve {dueno?.nombre.split(" ")[0]}</div>
            </div>
            <ExternalLink size={16} className="text-vera-apoyo" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
