import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getPendientesVacunas } from "@/lib/data/pacientes";
import { getMe } from "@/lib/data/usuario";
import type { Paciente } from "@/lib/data/types";
import { UrgencyBadge } from "@/components/shared/urgency-badge";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";
import { linkWhatsApp, primerNombre } from "@/lib/whatsapp";

/** Mensaje con la estructura de la marca: saludo, la clínica, la mascota por su nombre y una acción. */
function mensajeAviso(paciente: Paciente, clinica: string): string {
  const queLeToca = paciente.estadoEsquema === "vencido" ? "ponerse al día con su vacuna" : "su próxima vacuna";
  return `Hola, ${primerNombre(paciente.duenoNombre)}. Te escribimos de ${clinica}: a ${paciente.nombre} le toca ${queLeToca}. ¿Te agendamos una cita?`;
}

export default async function VacunasPage() {
  const [pendientes, usuario] = await Promise.all([getPendientesVacunas(), getMe()]);

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">A quién le toca</h1>
        <p className="mt-1 text-sm text-muted-foreground">La memoria automática de Vera, priorizada por urgencia.</p>
      </header>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {pendientes.map((paciente) => {
          const aviso = linkWhatsApp(paciente.duenoWhatsapp, mensajeAviso(paciente, usuario.clinicaNombre));
          return (
            <li key={paciente.id} className="flex items-center gap-4 px-5 py-4">
              <AvatarPaciente nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={48} />
              <Link href={`/pacientes/${paciente.id}`} className="min-w-0 flex-1">
                <div className="font-display text-base font-bold">{paciente.nombre}</div>
                <div className="truncate text-xs text-muted-foreground">{paciente.duenoNombre}</div>
              </Link>
              <UrgencyBadge estado={paciente.estadoEsquema} texto={paciente.faltaTexto} />
              {aviso && (
                <a
                  href={aviso}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Avisar a ${paciente.duenoNombre} por WhatsApp`}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-whatsapp px-3 text-xs font-semibold text-whatsapp-foreground"
                >
                  <MessageCircle size={13} aria-hidden /> Avisar
                </a>
              )}
            </li>
          );
        })}
        {pendientes.length === 0 && (
          <li className="p-10 text-center">
            <p className="font-display text-lg font-bold">Todos al día</p>
            <p className="mt-1 text-sm text-muted-foreground">Ningún paciente tiene vacunas pendientes ni vencidas.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
