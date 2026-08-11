import { describe, expect, it } from "vitest";
import { mapDueno, mapPaciente, getServiciosPorPaciente } from "./pacientes";
import type { ApiDueno, ApiPaciente } from "@/lib/api/types";

describe("mapDueno", () => {
  it("maps snake_case API fields to the frontend shape", () => {
    expect(mapDueno({ id: 1, nombre: "María López", whatsapp: "+503 7123 4567" })).toEqual({
      id: "1", nombre: "María López", whatsapp: "+503 7123 4567",
    });
  });
});

describe("mapPaciente", () => {
  it("maps snake_case API fields to camelCase, renaming dueno to duenoId", () => {
    const api: ApiPaciente = {
      id: 1, dueno: 5, nombre: "Rocky", especie: "perro", raza: "Labrador", sexo: "M",
      fecha_nacimiento: "2022-04-10", foto_url: "https://example.com/rocky.jpg", esterilizado: true,
      vacunas_completas: 5, vacunas_total: 5, estado_esquema: "al_dia", falta_texto: "",
      alergias: ["amoxicilina"], notas_comportamiento: ["Se pone nervioso"],
    };
    expect(mapPaciente(api)).toEqual({
      id: "1", nombre: "Rocky", especie: "perro", raza: "Labrador", sexo: "M",
      fechaNacimiento: "2022-04-10", fotoUrl: "https://example.com/rocky.jpg", duenoId: "5",
      esterilizado: true, vacunasCompletas: 5, vacunasTotal: 5, estadoEsquema: "al_dia",
      faltaTexto: undefined, alergias: ["amoxicilina"], notasComportamiento: ["Se pone nervioso"],
    });
  });

  it("omits faltaTexto when the API returns an empty string", () => {
    const api: ApiPaciente = {
      id: 2, dueno: 5, nombre: "Luna", especie: "gato", raza: "Persa", sexo: "H",
      fecha_nacimiento: "2025-04-20", foto_url: "", esterilizado: false,
      vacunas_completas: 1, vacunas_total: 3, estado_esquema: "al_dia", falta_texto: "",
      alergias: [], notas_comportamiento: [],
    };
    expect(mapPaciente(api).faltaTexto).toBeUndefined();
  });
});

describe("getServiciosPorPaciente", () => {
  it("returns only services for the requested patient", async () => {
    const result = await getServiciosPorPaciente("p1");
    expect(result.every((s) => s.pacienteId === "p1")).toBe(true);
  });
});
