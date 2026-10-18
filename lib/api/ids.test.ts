import { describe, expect, it } from "vitest";
import { esIdValido } from "./ids";

describe("esIdValido", () => {
  it("accepts positive integer ids", () => {
    expect(esIdValido("1")).toBe(true);
    expect(esIdValido("4821")).toBe(true);
  });

  it("rejects anything that could change the URL", () => {
    for (const id of ["", "0", "-1", "5/compartir", "../duenos/5", "5?x=1", " 5", "1e3", "abc"]) {
      expect(esIdValido(id)).toBe(false);
    }
    expect(esIdValido(5)).toBe(false);
    expect(esIdValido(undefined)).toBe(false);
  });
});
