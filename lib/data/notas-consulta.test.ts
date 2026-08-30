import { describe, expect, it } from "vitest";
import { mapNotaConsulta } from "./notas-consulta";
import type { ApiNotaConsulta } from "@/lib/api/types";

describe("mapNotaConsulta", () => {
  it("maps snake_case API fields to camelCase", () => {
    const api: ApiNotaConsulta = {
      id: 1, paciente: 10, empleado: 2, empleado_nombre: "Dra. Ramírez",
      fecha_hora: "2026-08-30T15:45:00Z", transcripcion: "El paciente presenta buen estado general.",
      servicio_visita: null,
    };
    expect(mapNotaConsulta(api)).toEqual({
      id: "1", pacienteId: "10", empleadoId: "2", empleadoNombre: "Dra. Ramírez",
      fechaHora: "2026-08-30T15:45:00Z", transcripcion: "El paciente presenta buen estado general.",
      servicioVisitaId: undefined,
    });
  });

  it("maps a linked servicio_visita id when present", () => {
    const api: ApiNotaConsulta = {
      id: 2, paciente: 10, empleado: 2, empleado_nombre: "Dra. Ramírez",
      fecha_hora: "2026-08-30T15:45:00Z", transcripcion: "Texto.",
      servicio_visita: 7,
    };
    expect(mapNotaConsulta(api).servicioVisitaId).toBe("7");
  });
});
