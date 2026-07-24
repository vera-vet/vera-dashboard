import { describe, expect, it } from "vitest";
import { resolverDiagramaTipo } from "./especialidades";
import type { Especialidad } from "@/lib/data/types";

const especialidades: Especialidad[] = [
  { id: "esp1", nombre: "Oftalmología", tiposServicioAsociados: ["consulta_oftalmologica"], diagramaId: "ojo" },
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
