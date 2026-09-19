import { ReminderQueueItem } from "@/components/shared/reminder-queue-item";
import type { Recordatorio } from "@/lib/data/types";

interface Props {
  recordatorios: Recordatorio[];
}

export function ProgramadosTab({ recordatorios }: Props) {
  // La API devuelve todos; aquí solo van los que todavía no salen (pendientes o pausados).
  const porSalir = recordatorios.filter((r) => r.estado === "pendiente" || r.estado === "pausado");

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Estos son los recordatorios que Vera enviará. Puedes pausarlos o editarlos antes de que salgan.
      </p>
      <ul className="space-y-3">
        {porSalir.length === 0 && <li className="text-sm text-muted-foreground">No hay recordatorios por salir.</li>}
        {porSalir.map((recordatorio) => (
          <ReminderQueueItem
            key={recordatorio.id}
            recordatorio={recordatorio}
            pacienteNombre={recordatorio.pacienteNombre}
            fotoUrl={recordatorio.pacienteFotoUrl}
          />
        ))}
      </ul>
    </div>
  );
}
