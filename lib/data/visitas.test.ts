import { describe, expect, it } from "vitest";
import { mapVisita } from "./visitas";
import type { ApiVisita } from "@/lib/api/types";

describe("mapVisita", () => {
  it("maps snake_case API fields, renaming paciente to pacienteId", () => {
    const api: ApiVisita = {
      id: 1, paciente: 10, fecha: "2026-08-15", hora: "09:00", motivo: "Refuerzo anual", confirmada: true,
    };
    expect(mapVisita(api)).toEqual({
      id: "1", pacienteId: "10", fecha: "2026-08-15", hora: "09:00", motivo: "Refuerzo anual", confirmada: true,
    });
  });

  it("maps a null hora to undefined", () => {
    const api: ApiVisita = {
      id: 2, paciente: 10, fecha: "2026-08-15", hora: null, motivo: "Control", confirmada: false,
    };
    expect(mapVisita(api).hora).toBeUndefined();
  });
});
