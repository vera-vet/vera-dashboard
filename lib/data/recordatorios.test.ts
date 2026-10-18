import { describe, expect, it, vi } from "vitest";
import { mapConversacion, mapMensaje, mapRecordatorio } from "./recordatorios";
import type { ApiRecordatorio } from "@/lib/api/types";

describe("mapRecordatorio", () => {
  it("maps snake_case API fields, renaming paciente to pacienteId and formatting programado_para as cuando", () => {
    const api: ApiRecordatorio = {
      id: 1, paciente: 10, paciente_nombre: "Rocky", paciente_foto_url: "https://example.com/rocky.jpg",
      tipo: "vacuna", programado_para: "2026-10-20T09:00:00-06:00",
      mensaje: "A Rocky le toca su próxima vacuna (Rabia).", estado: "pendiente",
    };
    const result = mapRecordatorio(api);
    expect(result.id).toBe("1");
    expect(result.pacienteId).toBe("10");
    expect(result.pacienteNombre).toBe("Rocky");
    expect(result.pacienteFotoUrl).toBe("https://example.com/rocky.jpg");
    expect(result.tipo).toBe("vacuna");
    expect(result.mensaje).toBe("A Rocky le toca su próxima vacuna (Rabia).");
    expect(result.estado).toBe("pendiente");
    // La hora es la de El Salvador sin importar la zona de la máquina.
    expect(result.cuando).toMatch(/9:00\s*a\.?\s*m\.?$/i);
    expect(result.duenoAceptaWhatsapp).toBe(true);
    expect(result.servicioProducto).toBeNull();
  });

  it("maps consent and the originating product", () => {
    const api: ApiRecordatorio = {
      id: 2, paciente: 10, paciente_nombre: "Rocky", paciente_foto_url: "", dueno_acepta_whatsapp: false,
      tipo: "vacuna", servicio_producto: "Séxtuple", programado_para: "2026-10-20T09:00:00-06:00",
      mensaje: "A Rocky le toca su próxima vacuna (Séxtuple).", estado: "pendiente", enviado_en: null,
    };
    const result = mapRecordatorio(api);
    expect(result.duenoAceptaWhatsapp).toBe(false);
    expect(result.servicioProducto).toBe("Séxtuple");
  });
});

describe("mapMensaje", () => {
  it("maps snake_case API fields and formats created_at as hora", () => {
    // Una fecha vieja da un resultado fijo ("3 nov 2025"); lo relativo se prueba en format.test.ts.
    const result = mapMensaje({ id: 1, autor: "vera", texto: "¡Hola!", created_at: "2025-11-03T17:00:00-06:00" });
    expect(result.id).toBe("1");
    expect(result.autor).toBe("vera");
    expect(result.texto).toBe("¡Hola!");
    expect(result.hora).toMatch(/^3 nov\.? 2025$/);
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
