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
  it("renames FK fields to *Id, stringifies all ids, and maps denormalized names", () => {
    const result = mapSesionActiva({
      id: 3, paciente: 10, paciente_nombre: "Rocky", paciente_foto_url: "https://example.com/rocky.jpg",
      dueno_nombre: "María López", empleado: 1, empleado_nombre: "Dr. Martínez", estacion: 2,
      motivo: "Consulta general", inicio: "09:40", tipo: "consulta",
    });
    expect(result).toEqual({
      id: "3", pacienteId: "10", pacienteNombre: "Rocky", pacienteFotoUrl: "https://example.com/rocky.jpg",
      duenoNombre: "María López", empleadoId: "1", empleadoNombre: "Dr. Martínez", estacionId: "2",
      motivo: "Consulta general", inicio: "09:40", tipo: "consulta",
    });
  });
});

describe("mapSalaEsperaItem", () => {
  it("maps snake_case API fields to the frontend shape", () => {
    expect(mapSalaEsperaItem({
      id: 4, paciente: 10, paciente_nombre: "Rocky", paciente_foto_url: "https://example.com/rocky.jpg",
      hora: "10:15", motivo: "Vacuna",
    })).toEqual({
      pacienteId: "10", pacienteNombre: "Rocky", pacienteFotoUrl: "https://example.com/rocky.jpg",
      hora: "10:15", motivo: "Vacuna",
    });
  });
});
