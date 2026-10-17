import Link from "next/link";
import { ReminderQueueItem } from "@/components/shared/reminder-queue-item";
import type { Recordatorio } from "@/lib/data/types";

export function ProgramadosTab({ recordatorios }: { recordatorios: Recordatorio[] }) {
  // La API ya trae solo lo que no ha salido (pendientes y pausados).
  const porSalir = recordatorios.filter((r) => r.estado === "pendiente" || r.estado === "pausado");

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Estos son los recordatorios que Vera enviará por WhatsApp, a las 9:00 a. m. del día que toca. Puedes pausarlos
        o editar el mensaje antes de que salgan.
      </p>
      {porSalir.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No hay recordatorios por salir. Se crean solos al registrar una vacuna, una desparasitación o un control en{" "}
          <Link href="/registrar" className="font-semibold text-vera-apoyo underline">Registrar visita</Link>.
        </div>
      ) : (
        <ul className="space-y-3">
          {porSalir.map((recordatorio) => (
            <ReminderQueueItem key={recordatorio.id} recordatorio={recordatorio} />
          ))}
        </ul>
      )}
    </div>
  );
}
