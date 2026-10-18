import { describe, expect, it } from "vitest";
import { ajustarCantidad, formatoDolares, totalPedido } from "./pedidos";

describe("totalPedido", () => {
  it("adds up lines without floating point noise", () => {
    expect(totalPedido([{ cantidad: 3, precioUnitario: 0.1 }, { cantidad: 1, precioUnitario: 12.5 }])).toBe(12.8);
    expect(formatoDolares(12.8)).toBe("$12.80");
  });
});

describe("ajustarCantidad", () => {
  const carrito = [
    { productoId: "1", nombre: "Collar", precio: 5, cantidad: 1, disponible: 3 },
    { productoId: "2", nombre: "Croquetas", precio: 20, cantidad: 2 },
  ];

  it("never goes over what was in stock", () => {
    expect(ajustarCantidad(carrito, "1", 5)[0].cantidad).toBe(3);
  });

  it("removes the line at zero", () => {
    expect(ajustarCantidad(carrito, "2", 0).map((l) => l.productoId)).toEqual(["1"]);
  });
});
