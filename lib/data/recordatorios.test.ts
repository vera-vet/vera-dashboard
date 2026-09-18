import { describe, expect, it, vi } from "vitest";
import { mapConversacion, mapMensaje, mapRecordatorio } from "./recordatorios";
import type { ApiRecordatorio } from "@/lib/api/types";

describe("mapRecordatorio", () => {
  it("maps snake_case API fields, renaming paciente to pacienteId and formatting programado_para as cuando", () => {
    const hoy5pm = new Date();
    hoy5pm.setHours(17, 0, 0, 0);
    const api: ApiRecordatorio = {
      id: 1, paciente: 10, paciente_nombre: "Rocky", paciente_foto_url: "https://example.com/rocky.jpg",
      tipo: "Recordatorio de cita", programado_para: hoy5pm.toISOString(),
      mensaje: "Le recordamos la cita de Rocky.", estado: "pendiente",
    };
    const result = mapRecordatorio(api);
    expect(result.id).toBe("1");
    expect(result.pacienteId).toBe("10");
    expect(result.pacienteNombre).toBe("Rocky");
    expect(result.pacienteFotoUrl).toBe("https://example.com/rocky.jpg");
    expect(result.tipo).toBe("Recordatorio de cita");
    expect(result.mensaje).toBe("Le recordamos la cita de Rocky.");
    expect(result.estado).toBe("pendiente");
    // Node's full-ICU es-SV locale renders the meridiem as "p. m." (CLDR-standard
    // Spanish), not English "PM" — accept either, matching lib/data/format.test.ts.
    expect(result.cuando).toMatch(/5:00\s*p\.?\s*m\.?/i);
  });
});

describe("mapMensaje", () => {
  it("maps snake_case API fields and formats created_at as hora", () => {
    const hoy5pm = new Date();
    hoy5pm.setHours(17, 0, 0, 0);
    const result = mapMensaje({ id: 1, autor: "vera", texto: "¡Hola!", created_at: hoy5pm.toISOString() });
    expect(result.id).toBe("1");
    expect(result.autor).toBe("vera");
    expect(result.texto).toBe("¡Hola!");
    // Node's full-ICU es-SV locale renders the meridiem as "p. m." (CLDR-standard
    // Spanish), not English "PM" — accept either, matching lib/data/format.test.ts.
    expect(result.hora).toMatch(/5:00\s*p\.?\s*m\.?/i);
  });
});

describe("mapConversacion", () => {
  it("maps the denormalized fields from the extended serializer", () => {
    const result = mapConversacion({
      id: 1, paciente: 10, paciente_nombre: "Rocky", dueno_nombre: "María López",
      estado: "respondido", ultimo_mensaje: "Sí, confirmado", ultimo_mensaje_en: new Date().toISOString(),
    });
    expect(result.id).toBe("1");
    expect(result.pacienteId).toBe("10");
    expect(result.pacienteNombre).toBe("Rocky");
    expect(result.duenoNombre).toBe("María López");
    expect(result.estado).toBe("respondido");
    expect(result.ultimoMensaje).toBe("Sí, confirmado");
    expect(result.mensajes).toEqual([]);
  });

  it("handles an empty conversation (no ultimo_mensaje_en) without formatting a null date", () => {
    const result = mapConversacion({
      id: 2, paciente: 10, paciente_nombre: "Rocky", dueno_nombre: "María López",
      estado: "enviado", ultimo_mensaje: "", ultimo_mensaje_en: null,
    });
    expect(result.hora).toBe("");
  });

  it("maps nested mensajes when present (detail response)", () => {
    const result = mapConversacion({
      id: 3, paciente: 10, paciente_nombre: "Rocky", dueno_nombre: "María López",
      estado: "respondido", ultimo_mensaje: "Sí, confirmado", ultimo_mensaje_en: new Date().toISOString(),
      mensajes: [{ id: 1, autor: "vera", texto: "¡Hola!", created_at: new Date().toISOString() }],
    });
    expect(result.mensajes).toHaveLength(1);
    expect(result.mensajes[0].texto).toBe("¡Hola!");
  });
});
