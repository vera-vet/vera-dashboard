"use server";

import { apiFetch } from "@/lib/api/client";
import { esIdValido } from "@/lib/api/ids";

type Resultado = { ok: boolean; mensaje?: string; linkAcceso?: string };

async function resultado(response: Response): Promise<Resultado> {
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (response.ok) return { ok: true, linkAcceso: typeof data.link_acceso === "string" ? data.link_acceso : undefined };
  if (response.status === 403) return { ok: false, mensaje: "Solo el administrador de la clínica puede hacer esto." };
  const mensaje = Object.values(data).flat().find((v) => typeof v === "string") as string | undefined;
  return { ok: false, mensaje };
}

export async function invitarUsuario(datos: { nombre: string; email: string; esAdmin: boolean }): Promise<Resultado> {
  const response = await apiFetch("/api/usuarios/", {
    method: "POST",
    body: JSON.stringify({ nombre: datos.nombre, email: datos.email, es_admin: datos.esAdmin }),
  });
  return resultado(response);
}

export async function actualizarUsuario(id: string, cambios: { esAdmin?: boolean; activo?: boolean }): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Cuenta inválida." };
  const body: Record<string, boolean> = {};
  if (cambios.esAdmin !== undefined) body.es_admin = cambios.esAdmin;
  if (cambios.activo !== undefined) body.is_active = cambios.activo;
  return resultado(await apiFetch(`/api/usuarios/${id}/`, { method: "PATCH", body: JSON.stringify(body) }));
}

/** Un enlace nuevo para definir la contraseña (invitación vencida o contraseña olvidada). */
export async function nuevoLinkDeAcceso(id: string): Promise<Resultado> {
  if (!esIdValido(id)) return { ok: false, mensaje: "Cuenta inválida." };
  return resultado(await apiFetch(`/api/usuarios/${id}/link-acceso/`, { method: "POST" }));
}

export async function cambiarMiPassword(actual: string, nueva: string): Promise<Resultado> {
  return resultado(await apiFetch("/api/auth/cambiar-password/", { method: "POST", body: JSON.stringify({ actual, nueva }) }));
}
