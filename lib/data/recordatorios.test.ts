import { describe, expect, it, vi } from "vitest";
import { mapRecordatorio } from "./recordatorios";
import type { ApiRecordatorio } from "@/lib/api/types";

describe("mapRecordatorio", () => {
  it("maps snake_case API fields, renaming paciente to pacienteId and formatting programado_para as cuando", () => {
    const hoy5pm = new Date();
    hoy5pm.setHours(17, 0, 0, 0);
    const api: ApiRecordatorio = {
      id: 1, paciente: 10, tipo: "Recordatorio de cita", programado_para: hoy5pm.toISOString(),
      mensaje: "Le recordamos la cita de Rocky.", estado: "pendiente",
    };
    const result = mapRecordatorio(api);
    expect(result.id).toBe("1");
    expect(result.pacienteId).toBe("10");
    expect(result.tipo).toBe("Recordatorio de cita");
    expect(result.mensaje).toBe("Le recordamos la cita de Rocky.");
    expect(result.estado).toBe("pendiente");
    // Node's full-ICU es-SV locale renders the meridiem as "p. m." (CLDR-standard
    // Spanish), not English "PM" — accept either, matching lib/data/format.test.ts.
    expect(result.cuando).toMatch(/5:00\s*p\.?\s*m\.?/i);
  });
});
