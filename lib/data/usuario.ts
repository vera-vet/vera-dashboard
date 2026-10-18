import { apiFetch } from "@/lib/api/client";
import type { ApiUsuario, ApiUsuarioEquipo } from "@/lib/api/types";
import type { Usuario, UsuarioEquipo } from "@/lib/data/types";

export function mapUsuario(api: ApiUsuario): Usuario {
  return {
    ...(api.id !== undefined ? { id: String(api.id) } : {}),
    email: api.email, nombre: api.nombre, esAdmin: api.es_admin, clinicaNombre: api.clinica_nombre,
  };
}

export function mapUsuarioEquipo(api: ApiUsuarioEquipo): UsuarioEquipo {
  return {
    id: String(api.id),
    email: api.email,
    nombre: api.nombre,
    esAdmin: api.es_admin,
    activo: api.is_active,
    ultimoAcceso: api.last_login,
  };
}

/** Las cuentas del personal de la clínica. Solo el admin: para el resto la API responde 403. */
export async function getUsuariosEquipo(): Promise<UsuarioEquipo[]> {
  const response = await apiFetch("/api/usuarios/");
  if (!response.ok) throw new Error(`No se pudieron cargar las cuentas del equipo (${response.status})`);
  const data: ApiUsuarioEquipo[] = await response.json();
  return data.map(mapUsuarioEquipo);
}

export async function getMe(): Promise<Usuario> {
  const response = await apiFetch("/api/auth/me/");
  if (!response.ok) throw new Error(`No se pudo cargar el usuario actual (${response.status})`);
  return mapUsuario(await response.json());
}
