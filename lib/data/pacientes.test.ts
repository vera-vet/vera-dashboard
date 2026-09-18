import { describe, expect, it } from "vitest";
import { mapDueno, mapPaciente, mapServicioVisita } from "./pacientes";
import type { ApiDueno, ApiPaciente, ApiServicioVisita } from "@/lib/api/types";

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
      id: 1, dueno: 5, dueno_nombre: "María López", nombre: "Rocky", especie: "perro", raza: "Labrador", sexo: "M",
      fecha_nacimiento: "2022-04-10", foto_url: "https://example.com/rocky.jpg", esterilizado: true,
      vacunas_completas: 5, vacunas_total: 5, estado_esquema: "al_dia", falta_texto: "",
      alergias: ["amoxicilina"], notas_comportamiento: ["Se pone nervioso"],
      carnet_token: "11111111-1111-1111-1111-111111111111",
    };
    expect(mapPaciente(api)).toEqual({
      id: "1", nombre: "Rocky", especie: "perro", raza: "Labrador", sexo: "M",
      fechaNacimiento: "2022-04-10", fotoUrl: "https://example.com/rocky.jpg", duenoId: "5",
      duenoNombre: "María López",
      esterilizado: true, vacunasCompletas: 5, vacunasTotal: 5, estadoEsquema: "al_dia",
      faltaTexto: undefined, alergias: ["amoxicilina"], notasComportamiento: ["Se pone nervioso"],
      carnetToken: "11111111-1111-1111-1111-111111111111",
    });
  });

  it("omits faltaTexto when the API returns an empty string", () => {
    const api: ApiPaciente = {
      id: 2, dueno: 5, dueno_nombre: "María López", nombre: "Luna", especie: "gato", raza: "Persa", sexo: "H",
      fecha_nacimiento: "2025-04-20", foto_url: "", esterilizado: false,
      vacunas_completas: 1, vacunas_total: 3, estado_esquema: "al_dia", falta_texto: "",
      alergias: [], notas_comportamiento: [],
      carnet_token: "22222222-2222-2222-2222-222222222222",
    };
    expect(mapPaciente(api).faltaTexto).toBeUndefined();
  });
});

describe("mapServicioVisita", () => {
  it("maps snake_case API fields and renames paciente to pacienteId", () => {
    const api: ApiServicioVisita = {
      id: 1, paciente: 10, tipo: "vacuna", producto: "Rabia", fecha: "2022-08-10", vet: "Dra. Ramírez",
      aplicada: true, reporte: null,
    };
    expect(mapServicioVisita(api)).toEqual({
      id: "1", pacienteId: "10", tipo: "vacuna", producto: "Rabia", fecha: "2022-08-10",
      vet: "Dra. Ramírez", aplicada: true, reporte: undefined,
    });
  });

  it("maps a nested reporte when present", () => {
    const api: ApiServicioVisita = {
      id: 1, paciente: 10, tipo: "vacuna", producto: "Rabia", fecha: "2022-08-10", vet: "Dra. Ramírez",
      aplicada: true,
      reporte: {
        id: 7, diagrama_tipo: "perro", fotos: [],
        marcas: [{ id: 1, x: 30, y: 60, nota: "Aplicada en el cuarto trasero izquierdo" }],
      },
    };
    const result = mapServicioVisita(api);
    expect(result.reporte).toEqual({
      id: "7", servicioVisitaId: "1", diagramaTipo: "perro", fotos: [],
      marcas: [{ id: "1", x: 30, y: 60, nota: "Aplicada en el cuarto trasero izquierdo" }],
    });
  });
});
