import { ReminderQueueItem } from "@/components/shared/reminder-queue-item";
import type { Recordatorio } from "@/lib/data/types";

interface Props {
  recordatorios: Recordatorio[];
}

export function ProgramadosTab({ recordatorios }: Props) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Estos son los recordatorios que Vera enviará. Puedes pausarlos o editarlos antes de que salgan.
      </p>
      <ul className="space-y-3">
        {recordatorios.map((recordatorio) => (
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
