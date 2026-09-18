import { describe, expect, it } from "vitest";
import { mapProducto } from "./productos";
import type { ApiProducto } from "@/lib/api/types";

describe("mapProducto", () => {
  it("maps id to string and converts precio (string) to number", () => {
    const api: ApiProducto = {
      id: 7, nombre: "Amoxicilina 500mg", categoria: "medicina", precio: "12.50", cantidad: 30, foto_url: "",
    };

    expect(mapProducto(api)).toEqual({
      id: "7", nombre: "Amoxicilina 500mg", categoria: "medicina", precio: 12.5, cantidad: 30, fotoUrl: "",
    });
  });
});
