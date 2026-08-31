import { describe, expect, it } from "vitest";
import { mapComparticion } from "./comparticiones";
import type { ApiPacienteCompartido } from "@/lib/api/types";

describe("mapComparticion", () => {
  it("maps an active share", () => {
    const api: ApiPacienteCompartido = {
      id: 1, paciente: 5, clinica: 2, clinica_nombre: "Clínica del Valle",
      otorgado_por: 7, otorgado_por_nombre: "Dra. Ramírez",
      otorgado_en: "2026-08-30T10:00:00-06:00", revocado_en: null, activo: true,
    };
    expect(mapComparticion(api)).toEqual({
      id: "1", pacienteId: "5", clinicaId: "2", clinicaNombre: "Clínica del Valle",
      otorgadoPorNombre: "Dra. Ramírez", otorgadoEn: "2026-08-30T10:00:00-06:00",
      revocadoEn: null, activo: true,
    });
  });

  it("maps a revoked share", () => {
    const api: ApiPacienteCompartido = {
      id: 2, paciente: 5, clinica: 2, clinica_nombre: "Clínica del Valle",
      otorgado_por: 7, otorgado_por_nombre: "Dra. Ramírez",
      otorgado_en: "2026-08-30T10:00:00-06:00", revocado_en: "2026-08-31T10:00:00-06:00", activo: false,
    };
    expect(mapComparticion(api).activo).toBe(false);
    expect(mapComparticion(api).revocadoEn).toBe("2026-08-31T10:00:00-06:00");
  });
});
