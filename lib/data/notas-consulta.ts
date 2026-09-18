import { apiFetch } from "@/lib/api/client";
import type { ApiNotaConsulta } from "@/lib/api/types";
import type { NotaConsulta } from "@/lib/data/types";

export function mapNotaConsulta(api: ApiNotaConsulta): NotaConsulta {
  return {
    id: String(api.id),
    pacienteId: String(api.paciente),
    empleadoId: String(api.empleado),
    empleadoNombre: api.empleado_nombre,
    fechaHora: api.fecha_hora,
    transcripcion: api.transcripcion,
    servicioVisitaId: api.servicio_visita ? String(api.servicio_visita) : undefined,
  };
}

export async function getNotasConsultaPorPaciente(pacienteId: string): Promise<NotaConsulta[]> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/notas-consulta/`);
  if (!response.ok) throw new Error(`No se pudieron cargar las notas de consulta (${response.status})`);
  const data: ApiNotaConsulta[] = await response.json();
  return data.map(mapNotaConsulta);
}
