import { describe, expect, it } from "vitest";
import {
  alergiaEnConflicto,
  anunciaElProducto,
  etiquetaTipo,
  normalizarProducto,
  plazoPorDefecto,
  productosSugeridos,
  serviciosFrecuentes,
} from "./registro";

describe("normalizarProducto", () => {
  it("ignores accents, case and dose suffixes like the API", () => {
    expect(normalizarProducto("Séxtuple 1ª dosis")).toBe("sextuple");
    expect(normalizarProducto("séxtuple")).toBe("sextuple");
    expect(normalizarProducto("Sextuple - 2ª dosis")).toBe("sextuple");
    expect(normalizarProducto("Triple felina - 2ª dosis")).toBe("triple felina");
    expect(normalizarProducto("Refuerzo anual")).toBe("refuerzo anual");
  });
});

describe("productosSugeridos", () => {
  it("offers each species its own vaccines", () => {
    expect(productosSugeridos("vacuna", "perro").map((p) => p.nombre)).toEqual(["Séxtuple", "Rabia", "Refuerzo anual"]);
    expect(productosSugeridos("vacuna", "gato").map((p) => p.nombre)).toEqual(["Triple felina", "Rabia", "Refuerzo anual"]);
  });
});

describe("serviciosFrecuentes", () => {
  it("never offers a dog vaccine to a cat", () => {
    expect(serviciosFrecuentes("gato").map((s) => s.producto)).not.toContain("Séxtuple");
    expect(serviciosFrecuentes("perro").map((s) => s.producto)).toContain("Séxtuple");
  });
});

describe("plazoPorDefecto", () => {
  it("uses the product's usual interval", () => {
    expect(plazoPorDefecto("vacuna", "Séxtuple")).toBe(21);
    expect(plazoPorDefecto("vacuna", "Rabia")).toBe(365);
    expect(plazoPorDefecto("vacuna", "refuerzo anual")).toBe(365);
  });

  it("falls back to the type's interval for free text", () => {
    expect(plazoPorDefecto("vacuna", "Leptospirosis")).toBe(21);
    expect(plazoPorDefecto("consulta", "Revisión de oído")).toBeNull();
  });
});

describe("alergiaEnConflicto", () => {
  it("warns when a suggested product contains an allergen", () => {
    expect(alergiaEnConflicto("Amoxicilina + Ácido Clavulánico", "consulta", ["Amoxicilina"])).toBe("amoxicilina");
  });

  it("warns when free text names the allergen", () => {
    expect(alergiaEnConflicto("Amoxicilina 500 mg", "consulta", ["amoxicilina"])).toBe("amoxicilina");
  });

  it("stays quiet otherwise", () => {
    expect(alergiaEnConflicto("Rabia", "vacuna", ["amoxicilina"])).toBeUndefined();
    expect(alergiaEnConflicto("General", "consulta", [])).toBeUndefined();
  });
});

describe("anunciaElProducto", () => {
  const base = { id: "1", mensaje: "", cuando: "7 nov" };

  it("matches the originating service's product", () => {
    expect(anunciaElProducto({ ...base, servicioProducto: "Séxtuple 1ª dosis" }, "Séxtuple")).toBe(true);
    expect(anunciaElProducto({ ...base, servicioProducto: "Rabia" }, "Séxtuple")).toBe(false);
  });

  it("recognizes old reminders by their text", () => {
    const viejo = { ...base, servicioProducto: null, mensaje: "Le recordamos que en 21 días toca dar seguimiento a: Triple felina." };
    expect(anunciaElProducto(viejo, "Triple felina - 2ª dosis")).toBe(true);
  });

  it("never matches an empty product", () => {
    expect(anunciaElProducto({ ...base, servicioProducto: "Rabia" }, "  ")).toBe(false);
  });
});

describe("etiquetaTipo", () => {
  it("shows a label, never the code", () => {
    expect(etiquetaTipo("consulta_oftalmologica")).toBe("Consulta oftalmológica");
    expect(etiquetaTipo("otro")).toBe("otro");
  });
});
