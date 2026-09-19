import Link from "next/link";
import { ChevronRight, Search, UserPlus } from "lucide-react";
import { getPacientes } from "@/lib/data/pacientes";
import { UrgencyBadge } from "@/components/shared/urgency-badge";
import { edadTexto } from "@/lib/date";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

export default async function PacientesPage() {
  const pacientes = await getPacientes();

  return (
    <div>
      <header className="flex items-center justify-between pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-vera-verde">Pacientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{pacientes.length} en la clínica</p>
        </div>
        <Link
          href="/pacientes/nuevo"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <UserPlus size={16} /> Nuevo paciente
        </Link>
      </header>

      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4">
        <Search size={16} className="text-muted-foreground" />
        <input
          placeholder="Buscar por paciente o dueño…"
          className="min-h-12 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {pacientes.map((paciente) => (
          <li key={paciente.id}>
            <Link
              href={`/pacientes/${paciente.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
            >
              <AvatarPaciente nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={48} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-base font-bold">{paciente.nombre}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {edadTexto(paciente.fechaNacimiento)} · {paciente.duenoNombre}
                </div>
              </div>
              {paciente.estadoEsquema !== "al_dia" && (
                <UrgencyBadge estado={paciente.estadoEsquema} texto={paciente.faltaTexto} />
              )}
              <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
