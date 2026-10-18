"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";
import type { Rol } from "@/lib/data/types";

type Resultado = { ok: boolean; mensaje?: string };

/** El primer mensaje de validación de la API, para mostrarlo tal cual. */
async function resultado(response: Response): Promise<Resultado> {
  if (response.ok) return { ok: true };
  if (response.status === 403) return { ok: false, mensaje: "Solo el administrador de la clínica puede cambiar esto." };
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const mensaje = Object.values(data).flat().find((v) => typeof v === "string") as string | undefined;
  return { ok: false, mensaje };
}

export async function actualizarClinica(datos: { nombre: string; whatsapp: string }): Promise<Resultado> {
  return resultado(await apiFetch("/api/clinica/", { method: "PATCH", body: JSON.stringify(datos) }));
}

export async function guardarEmpleado(id: string | null, datos: { nombre: string; rol: Rol }): Promise<Resultado> {
  if (id !== null && !esIdValido(id)) return { ok: false, mensaje: "Registro inválido." };
  const response = await apiFetch(id ? `/api/empleados/${id}/` : "/api/empleados/", {
    method: id ? "PATCH" : "POST",
    // inicial vacía: la API la deriva del nombre.
    body: JSON.stringify({ ...datos, inicial: "" }),
  });
  return resultado(response);
}

export async function borrarEmpleado(id: string): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Registro inválido." };
  return resultado(await apiFetch(`/api/empleados/${id}/`, { method: "DELETE" }));
}

export async function guardarEstacion(
  id: string | null,
  datos: { nombre: string; tipo: "consultorio" | "bano" },
): Promise<Resultado> {
  if (id !== null && !esIdValido(id)) return { ok: false, mensaje: "Registro inválido." };
  const response = await apiFetch(id ? `/api/estaciones/${id}/` : "/api/estaciones/", {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(datos),
  });
  return resultado(response);
}

export async function borrarEstacion(id: string): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Registro inválido." };
  return resultado(await apiFetch(`/api/estaciones/${id}/`, { method: "DELETE" }));
}
