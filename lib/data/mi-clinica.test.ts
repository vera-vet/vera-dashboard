import { describe, expect, it } from "vitest";
import { mapMiClinica } from "./mi-clinica";

describe("mapMiClinica", () => {
  it("maps the clinic and its contact", () => {
    expect(mapMiClinica({ id: 3, nombre: "Veterinaria San Rafael", whatsapp: "+50322223333" })).toEqual({
      id: "3", nombre: "Veterinaria San Rafael", whatsapp: "+50322223333",
    });
  });
});
