import type { DiagramaTipo, Especialidad, Especie, ServicioTipo } from "@/lib/data/types";

export function resolverDiagramaTipo(
  tipoServicio: ServicioTipo,
  especialidades: Especialidad[],
  especiePaciente: Especie,
): DiagramaTipo {
  const especialidad = especialidades.find((e) => e.tiposServicioAsociados.includes(tipoServicio));
  return especialidad?.diagramaId ?? especiePaciente;
}
