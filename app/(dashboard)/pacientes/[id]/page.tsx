import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, MessageCircle } from "lucide-react";
import { getPaciente, getDueno, getServiciosPorPaciente } from "@/lib/data/pacientes";
import { getVisitasPorPaciente } from "@/lib/data/visitas";
import { getNotasConsultaPorPaciente } from "@/lib/data/notas-consulta";
import { VaccineTimeline } from "@/components/shared/vaccine-timeline";
import { edadTexto, formatFechaCorta, formatFechaHoraCorta, hoyISO } from "@/lib/date";
import { DatosClinicos } from "./datos-clinicos";
import { HistorialItem } from "./historial-item";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

export default async function ExpedientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await getPaciente(id);
  if (!paciente) notFound();

  const dueno = await getDueno(paciente.duenoId);
  const servicios = await getServiciosPorPaciente(paciente.id);
  const proximas = (await getVisitasPorPaciente(paciente.id)).filter((v) => v.fecha >= hoyISO());
  const notas = await getNotasConsultaPorPaciente(paciente.id);

  return (
    <div>
      <Link href="/pacientes" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeft size={14} /> Pacientes
      </Link>

      <section className="flex flex-wrap items-center gap-6 pb-6">
        <img src={paciente.fotoUrl} alt={paciente.nombre} className="h-24 w-24 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold text-vera-forest">{paciente.nombre}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {edadTexto(paciente.fechaNacimiento)} · {paciente.sexo === "M" ? "Macho" : "Hembra"}
          </p>
          <p className="mt-2 text-sm">
            Dueño: <span className="font-semibold">{dueno?.nombre}</span>{" "}
            <span className="text-muted-foreground">· {dueno?.whatsapp}</span>
          </p>
        </div>
        <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-white">
          <MessageCircle size={16} /> Escribir a {dueno?.nombre.split(" ")[0]}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Ciclo de vacunación</h2>
          <div className="rounded-2xl border border-border bg-card p-6">
            <VaccineTimeline servicios={servicios} vacunasCompletas={paciente.vacunasCompletas} vacunasTotal={paciente.vacunasTotal} />
          </div>

          <h2 className="mb-3 mt-8 font-display text-lg font-bold">Historial clínico</h2>
          <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {servicios.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Sin visitas registradas.</li>}
            {servicios.map((s) => (
              <HistorialItem key={s.id} servicio={s} reporte={s.reporte} />
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
                {n.servicioVisitaId && <p className="mt-2 text-xs text-vera-emerald">Conectada a un servicio registrado</p>}
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display text-sm font-bold">Próximas visitas</h3>
            {proximas.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">Sin visitas programadas.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {proximas.slice(0, 5).map((v) => (
                  <li key={v.id} className="text-sm">
                    <div className="font-medium">{v.motivo}</div>
                    <div className="text-xs text-muted-foreground">{formatFechaCorta(v.fecha)}{v.hora ? ` · ${v.hora}` : ""}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DatosClinicos pacienteId={paciente.id} alergiasIniciales={paciente.alergias} notasIniciales={paciente.notasComportamiento} />

          <Link
            href={`/carnet/${paciente.carnetToken}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:bg-secondary/50"
          >
            <div>
              <div className="font-display text-sm font-bold">Carnet del dueño</div>
              <div className="text-xs text-muted-foreground">Lo que ve {dueno?.nombre.split(" ")[0]}</div>
            </div>
            <ExternalLink size={16} className="text-vera-emerald" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
