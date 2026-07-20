import { describe, expect, it } from "vitest";
import { getPaciente, getPacientes, getPendientesVacunas, getServiciosPorPaciente } from "./pacientes";

describe("getPacientes", () => {
  it("returns all seeded patients", async () => {
    const result = await getPacientes();
    expect(result.length).toBeGreaterThan(0);
    expect(result.find((p) => p.nombre === "Rocky")).toBeDefined();
  });
});

describe("getPaciente", () => {
  it("finds a patient by id", async () => {
    const result = await getPaciente("p1");
    expect(result?.nombre).toBe("Rocky");
  });

  it("returns undefined for an unknown id", async () => {
    const result = await getPaciente("does-not-exist");
    expect(result).toBeUndefined();
  });
});

describe("getServiciosPorPaciente", () => {
  it("returns only services for the requested patient", async () => {
    const result = await getServiciosPorPaciente("p1");
    expect(result.every((s) => s.pacienteId === "p1")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns an empty array for a patient with no services", async () => {
    const result = await getServiciosPorPaciente("p6");
    expect(result).toEqual([]);
  });
});

describe("getPendientesVacunas", () => {
  it("excludes patients who are al_dia", async () => {
    const result = await getPendientesVacunas();
    expect(result.every((p) => p.estadoEsquema !== "al_dia")).toBe(true);
  });

  it("sorts vencido before falta", async () => {
    const result = await getPendientesVacunas();
    const indices = result.map((p) => p.estadoEsquema);
    const firstFalta = indices.indexOf("falta");
    const firstVencido = indices.indexOf("vencido");
    if (firstFalta !== -1 && firstVencido !== -1) {
      expect(firstVencido).toBeLessThan(firstFalta);
    }
  });
});
