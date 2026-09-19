import { describe, expect, it } from "vitest";
import { etiquetaSemana, formatTasa, mapResumen } from "./reportes";
import type { ApiResumenReportes } from "@/lib/api/types";

describe("mapResumen", () => {
  it("convierte el resumen de la API a camelCase con etiquetas de semana", () => {
    const api: ApiResumenReportes = {
      hoy: { fecha: "2026-09-18", recordatorios_enviados: 3, citas: 5, citas_confirmadas: 2 },
      mes: { desde: "2026-09-01", recordatorios_enviados: 40, conversaciones_respondidas: 12, tasa_respuesta: 30 },
      semanas: [
        { inicio: "2026-08-31", enviados: 8, respondidos: 2 },
        { inicio: "2026-09-14", enviados: 10, respondidos: 4 },
      ],
    };

    expect(mapResumen(api)).toEqual({
      hoy: { recordatoriosEnviados: 3, citas: 5, citasConfirmadas: 2 },
      mes: { recordatoriosEnviados: 40, conversacionesRespondidas: 12, tasaRespuesta: 30 },
      semanas: [
        { etiqueta: "31 ago", enviados: 8, respondidos: 2 },
        { etiqueta: "14 sep", enviados: 10, respondidos: 4 },
      ],
    });
  });
});

describe("etiquetaSemana", () => {
  it("no se corre de día por la zona horaria", () => {
    expect(etiquetaSemana("2026-01-01")).toBe("1 ene");
    expect(etiquetaSemana("2026-12-31")).toBe("31 dic");
  });
});

describe("formatTasa", () => {
  it("muestra un guion cuando no hay envíos", () => {
    expect(formatTasa(null)).toBe("—");
    expect(formatTasa(0)).toBe("0%");
    expect(formatTasa(72)).toBe("72%");
  });
});
