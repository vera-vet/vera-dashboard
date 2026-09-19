import { apiFetch } from "@/lib/api/client";
import type { ApiUsuario } from "@/lib/api/types";
import type { Usuario } from "@/lib/data/types";

export function mapUsuario(api: ApiUsuario): Usuario {
  return { email: api.email, nombre: api.nombre, esAdmin: api.es_admin, clinicaNombre: api.clinica_nombre };
}

export async function getMe(): Promise<Usuario> {
  const response = await apiFetch("/api/auth/me/");
  if (!response.ok) throw new Error(`No se pudo cargar el usuario actual (${response.status})`);
  return mapUsuario(await response.json());
}
