import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { MetricHero } from "@/components/shared/metric-hero";
import { UrgencyBadge } from "@/components/shared/urgency-badge";
import { WhatsAppBubble } from "@/components/shared/whatsapp-bubble";
import { getVisitasHoy } from "@/lib/data/visitas";
import { getConversaciones } from "@/lib/data/recordatorios";
import { formatTasa, getResumenReportes } from "@/lib/data/reportes";
import { getMe } from "@/lib/data/usuario";
import { fechaLargaElSalvador, saludoSegunHora } from "@/lib/date";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";

export default async function InicioPage() {
  const [visitasHoy, conversaciones, resumen, usuario] = await Promise.all([
    getVisitasHoy(),
    getConversaciones(),
    getResumenReportes(),
    getMe(),
  ]);
  const conv = conversaciones[0];

  return (
    <div>
      <header className="pb-8">
        <p className="text-sm font-medium text-muted-foreground">
          {fechaLargaElSalvador()}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-vera-forest lg:text-4xl">
          {saludoSegunHora()}, {usuario.nombre || usuario.email}
        </h1>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricHero label="Recordatorios enviados" value={resumen.hoy.recordatoriosEnviados} hint="hoy" />
        <MetricHero label="Citas confirmadas" value={resumen.hoy.citasConfirmadas} hint={`de ${resumen.hoy.citas} hoy`} />
        <MetricHero label="Respuestas de dueños" value={resumen.mes.conversacionesRespondidas} hint="este mes" />
        <MetricHero label="Tasa de respuesta" value={formatTasa(resumen.mes.tasaRespuesta)} hint="este mes" />
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Pacientes que vuelven esta semana</h2>
          <ul className="space-y-3">
            {visitasHoy.map((visita) => (
              <li key={visita.id}>
                <Link
                  href={`/pacientes/${visita.pacienteId}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]"
                >
                  <AvatarPaciente nombre={visita.pacienteNombre} fotoUrl={visita.pacienteFotoUrl} tamano={56} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-base font-bold">{visita.pacienteNombre}</span>
                      <span className="truncate text-xs text-muted-foreground">· {visita.duenoNombre}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{visita.motivo}</p>
                  </div>
                  {visita.pacienteEstadoEsquema !== "al_dia" && (
                    <UrgencyBadge estado={visita.pacienteEstadoEsquema} texto={visita.pacienteFaltaTexto} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-whatsapp">
              <MessageCircle size={12} className="text-white" />
            </span>
            <h3 className="font-display text-sm font-bold">Vera responde</h3>
          </div>
          {conv ? (
            <>
              <p className="mb-2 text-xs text-muted-foreground">{conv.duenoNombre} · sobre {conv.pacienteNombre}</p>
              <div className="space-y-1.5">
                {conv.mensajes.map((m) => (
                  <WhatsAppBubble key={m.id} mensaje={m} />
                ))}
              </div>
            </>
          ) : (
            <p className="mb-2 text-xs text-muted-foreground">Sin conversaciones todavía.</p>
          )}
          <Link
            href="/recordatorios"
            className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-vera-emerald hover:bg-secondary"
          >
            Ver todas las conversaciones <ArrowUpRight size={13} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
