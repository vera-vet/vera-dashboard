import { describe, expect, it } from "vitest";
import { mapPedido, mapPedidoItem } from "./tienda";
import type { ApiPedido, ApiPedidoItem } from "@/lib/api/types";

describe("mapPedidoItem", () => {
  it("maps producto null and converts precio_unitario to number", () => {
    const api: ApiPedidoItem = {
      id: 5, producto: null, producto_nombre: "Amoxicilina 500mg", cantidad: 2, precio_unitario: "12.50",
    };

    expect(mapPedidoItem(api)).toEqual({
      id: "5", productoId: null, productoNombre: "Amoxicilina 500mg", cantidad: 2, precioUnitario: 12.5,
    });
  });

  it("maps a non-null producto id to string", () => {
    const api: ApiPedidoItem = {
      id: 6, producto: 3, producto_nombre: "Vitaminas", cantidad: 1, precio_unitario: "8.00",
    };

    expect(mapPedidoItem(api).productoId).toBe("3");
  });
});

describe("mapPedido", () => {
  it("maps nested items and estado", () => {
    const api: ApiPedido = {
      id: 10, dueno: 1, dueno_nombre: "María López", tipo_entrega: "retiro", direccion_entrega: "",
      estado: "pagado", creado_en: "2026-09-12T10:00:00Z",
      items: [{ id: 1, producto: 2, producto_nombre: "Amoxicilina 500mg", cantidad: 1, precio_unitario: "12.50" }],
    };

    const resultado = mapPedido(api);

    expect(resultado.id).toBe("10");
    expect(resultado.tipoEntrega).toBe("retiro");
    expect(resultado.estado).toBe("pagado");
    expect(resultado.items).toHaveLength(1);
    expect(resultado.items[0].precioUnitario).toBe(12.5);
  });
});
