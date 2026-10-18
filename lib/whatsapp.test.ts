import { describe, expect, it } from "vitest";
import { linkWhatsApp, primerNombre } from "./whatsapp";

describe("linkWhatsApp", () => {
  it("uses only digits and encodes the message", () => {
    expect(linkWhatsApp("+503 7123-4567", "Hola, María")).toBe("https://wa.me/50371234567?text=Hola%2C%20Mar%C3%ADa");
    expect(linkWhatsApp("+50371234567")).toBe("https://wa.me/50371234567");
  });

  it("returns null without a usable number", () => {
    expect(linkWhatsApp("")).toBeNull();
    expect(linkWhatsApp("123")).toBeNull();
  });
});

describe("primerNombre", () => {
  it("takes the first word", () => {
    expect(primerNombre("María José López")).toBe("María");
    expect(primerNombre("  Carlos ")).toBe("Carlos");
  });
});
