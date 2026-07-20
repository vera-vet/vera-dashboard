import { describe, expect, it } from "vitest";
import { hoyISO } from "@/lib/date";
import { getVisitasHoy, getVisitasPorPaciente, getVisitasProximas } from "./visitas";

describe("getVisitasHoy", () => {
  it("only returns visits with offset 0, resolved to today's real date", async () => {
    const result = await getVisitasHoy();
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((v) => v.fecha === hoyISO())).toBe(true);
  });
});

describe("getVisitasProximas", () => {
  it("returns visits sorted chronologically", async () => {
    const result = await getVisitasProximas();
    const fechas = result.map((v) => v.fecha + (v.hora ?? ""));
    const sorted = [...fechas].sort();
    expect(fechas).toEqual(sorted);
  });
});

describe("getVisitasPorPaciente", () => {
  it("filters visits to a single patient", async () => {
    const result = await getVisitasPorPaciente("p1");
    expect(result.every((v) => v.pacienteId === "p1")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
