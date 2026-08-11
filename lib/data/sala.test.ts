import { describe, expect, it } from "vitest";
import { mapEmpleado, mapEstacion, mapSalaEsperaItem, mapSesionActiva } from "./sala";

describe("mapEmpleado", () => {
  it("maps snake_case API fields to the frontend shape", () => {
    expect(mapEmpleado({ id: 1, nombre: "Dra. Ramírez", rol: "vet", inicial: "R" })).toEqual({
      id: "1", nombre: "Dra. Ramírez", rol: "vet", inicial: "R",
    });
  });
});

describe("mapEstacion", () => {
  it("maps snake_case API fields to the frontend shape", () => {
    expect(mapEstacion({ id: 2, nombre: "Consultorio 1", tipo: "consultorio" })).toEqual({
      id: "2", nombre: "Consultorio 1", tipo: "consultorio",
    });
  });
});

describe("mapSesionActiva", () => {
  it("renames FK fields to *Id and stringifies all ids", () => {
    const result = mapSesionActiva({
      id: 3, paciente: 10, empleado: 1, estacion: 2, motivo: "Consulta general", inicio: "09:40", tipo: "consulta",
    });
    expect(result).toEqual({
      id: "3", pacienteId: "10", empleadoId: "1", estacionId: "2", motivo: "Consulta general", inicio: "09:40", tipo: "consulta",
    });
  });
});

describe("mapSalaEsperaItem", () => {
  it("maps snake_case API fields to the frontend shape", () => {
    expect(mapSalaEsperaItem({ id: 4, paciente: 10, hora: "10:15", motivo: "Vacuna" })).toEqual({
      pacienteId: "10", hora: "10:15", motivo: "Vacuna",
    });
  });
});
