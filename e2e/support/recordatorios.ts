import { djangoShell, PRELUDE } from "./django";

// Helpers de e2e/recordatorios.spec.ts, en su propio archivo para no chocar con los que otros
// specs agregan al final de django.ts.

/** Un recordatorio pendiente de Rocky (San Rafael) con un texto único; devuelve su id. */
export function recordatorioPendiente(mensaje: string): number {
  return djangoShell<number>(`${PRELUDE}
import datetime
from django.utils import timezone
from apps.recordatorios.models import Recordatorio
rocky = Paciente.objects.filter(clinica__nombre__icontains="San Rafael", nombre="Rocky").order_by("id").first()
r = Recordatorio.objects.create(paciente=rocky, tipo="vacuna", mensaje=${JSON.stringify(mensaje)},
                                programado_para=timezone.now() + datetime.timedelta(days=3))
print(json.dumps(r.id))
`);
}

export function datosRecordatorio(id: number): { estado: string; mensaje: string } {
  return djangoShell<{ estado: string; mensaje: string }>(`${PRELUDE}
from apps.recordatorios.models import Recordatorio
r = Recordatorio.objects.get(id=${id})
print(json.dumps({"estado": r.estado, "mensaje": r.mensaje}))
`);
}
