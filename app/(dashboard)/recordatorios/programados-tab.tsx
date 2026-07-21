import { ReminderQueueItem } from "@/components/shared/reminder-queue-item";
import type { Paciente, Recordatorio } from "@/lib/data/types";

interface Props {
  recordatorios: { recordatorio: Recordatorio; paciente: Paciente | undefined }[];
}

export function ProgramadosTab({ recordatorios }: Props) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Estos son los recordatorios que Vera enviará. Puedes pausarlos o editarlos antes de que salgan.
      </p>
      <ul className="space-y-3">
        {recordatorios.map(({ recordatorio, paciente }) => (
          <ReminderQueueItem
            key={recordatorio.id}
            recordatorio={recordatorio}
            pacienteNombre={paciente?.nombre ?? "—"}
            fotoUrl={paciente?.fotoUrl}
          />
        ))}
      </ul>
    </div>
  );
}
