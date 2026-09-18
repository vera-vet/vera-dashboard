import { describe, expect, it } from "vitest";
import { mapEspecialidad } from "./especialidades";
import { resolverDiagramaTipo } from "./diagrama";
import type { ApiEspecialidad } from "@/lib/api/types";
import type { Especialidad } from "@/lib/data/types";

describe("mapEspecialidad", () => {
  it("maps snake_case API fields to the frontend shape", () => {
    const api: ApiEspecialidad = {
      id: 1, nombre: "Oftalmología", tipos_servicio_asociados: ["consulta_oftalmologica"], diagrama_id: "ojo",
    };
    expect(mapEspecialidad(api)).toEqual({
      id: "1", nombre: "Oftalmología", tiposServicioAsociados: ["consulta_oftalmologica"], diagramaId: "ojo",
    });
  });
});

const especialidades: Especialidad[] = [
  { id: "1", nombre: "Oftalmología", tiposServicioAsociados: ["consulta_oftalmologica"], diagramaId: "ojo" },
];

describe("resolverDiagramaTipo", () => {
  it("returns the specialty diagram when the tipo servicio matches one", () => {
    expect(resolverDiagramaTipo("consulta_oftalmologica", especialidades, "perro")).toBe("ojo");
  });

  it("falls back to the patient's species when no specialty matches", () => {
    expect(resolverDiagramaTipo("vacuna", especialidades, "gato")).toBe("gato");
  });

  it("falls back to species when there are no especialidades at all", () => {
    expect(resolverDiagramaTipo("consulta_oftalmologica", [], "otro")).toBe("otro");
  });
});
