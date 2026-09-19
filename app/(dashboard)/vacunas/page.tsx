import { MessageCircle } from "lucide-react";
import { getPendientesVacunas } from "@/lib/data/pacientes";
import { UrgencyBadge } from "@/components/shared/urgency-badge";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";

export default async function VacunasPage() {
  const pendientes = await getPendientesVacunas();

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">A quién le toca</h1>
        <p className="mt-1 text-sm text-muted-foreground">La memoria automática de Vera, priorizada por urgencia.</p>
      </header>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {pendientes.map((paciente) => (
          <li key={paciente.id} className="flex items-center gap-4 px-5 py-4">
            <AvatarPaciente nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={48} />
            <div className="min-w-0 flex-1">
              <div className="font-display text-base font-bold">{paciente.nombre}</div>
              <div className="truncate text-xs text-muted-foreground">{paciente.duenoNombre}</div>
            </div>
            <UrgencyBadge estado={paciente.estadoEsquema} texto={paciente.faltaTexto} />
            <button className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-whatsapp px-3 text-xs font-semibold text-white">
              <MessageCircle size={13} /> Avisar
            </button>
          </li>
        ))}
        {pendientes.length === 0 && (
          <li className="p-10 text-center">
            <p className="font-display text-lg font-bold">Todos al día</p>
            <p className="mt-1 text-sm text-muted-foreground">No hay vacunas pendientes esta semana.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
