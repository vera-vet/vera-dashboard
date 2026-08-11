import { apiFetch } from "@/lib/api/client";
import type { ApiEspecialidad } from "@/lib/api/types";
import type { DiagramaTipo, Especialidad, Especie, ServicioTipo } from "@/lib/data/types";

export function mapEspecialidad(api: ApiEspecialidad): Especialidad {
  return {
    id: String(api.id),
    nombre: api.nombre,
    tiposServicioAsociados: api.tipos_servicio_asociados as ServicioTipo[],
    diagramaId: api.diagrama_id as DiagramaTipo,
  };
}

export async function getEspecialidades(): Promise<Especialidad[]> {
  const response = await apiFetch("/api/especialidades/");
  if (!response.ok) throw new Error(`No se pudieron cargar las especialidades (${response.status})`);
  const data: ApiEspecialidad[] = await response.json();
  return data.map(mapEspecialidad);
}

export function resolverDiagramaTipo(
  tipoServicio: ServicioTipo,
  especialidades: Especialidad[],
  especiePaciente: Especie,
): DiagramaTipo {
  const especialidad = especialidades.find((e) => e.tiposServicioAsociados.includes(tipoServicio));
  return especialidad?.diagramaId ?? especiePaciente;
}
