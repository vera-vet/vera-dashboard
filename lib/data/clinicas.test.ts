import { describe, expect, it } from "vitest";
import { clinicasDisponiblesParaCompartir, mapClinica } from "./clinicas";
import type { ApiClinica } from "@/lib/api/types";
import type { Comparticion } from "@/lib/data/types";

describe("mapClinica", () => {
  it("maps id to string and keeps nombre", () => {
    const api: ApiClinica = { id: 3, nombre: "Clínica Oftalmológica del Valle" };
    expect(mapClinica(api)).toEqual({ id: "3", nombre: "Clínica Oftalmológica del Valle" });
  });
});

function comparticion(clinicaId: string, activo: boolean): Comparticion {
  return {
    id: `s-${clinicaId}`, pacienteId: "5", clinicaId, clinicaNombre: `Clínica ${clinicaId}`,
    otorgadoPorNombre: "Dra. Ramírez", otorgadoEn: "2026-08-30T10:00:00-06:00",
    revocadoEn: activo ? null : "2026-08-31T10:00:00-06:00", activo,
  };
}

describe("clinicasDisponiblesParaCompartir", () => {
  const resultados = [
    { id: "2", nombre: "Clínica del Valle" },
    { id: "3", nombre: "Clínica Los Álamos" },
  ];

  it("hides clinics the patient is already actively shared with", () => {
    expect(clinicasDisponiblesParaCompartir(resultados, [comparticion("2", true)])).toEqual([
      { id: "3", nombre: "Clínica Los Álamos" },
    ]);
  });

  it("offers again a clinic whose share was revoked", () => {
    expect(clinicasDisponiblesParaCompartir(resultados, [comparticion("2", false)])).toEqual(resultados);
  });
});
