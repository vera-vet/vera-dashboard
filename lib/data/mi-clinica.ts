import { apiFetch } from "@/lib/api/client";
import type { ApiMiClinica } from "@/lib/api/types";
import type { MiClinica } from "@/lib/data/types";

export function mapMiClinica(api: ApiMiClinica): MiClinica {
  return { id: String(api.id), nombre: api.nombre, whatsapp: api.whatsapp ?? "" };
}

export async function getMiClinica(): Promise<MiClinica> {
  const response = await apiFetch("/api/clinica/");
  if (!response.ok) throw new Error(`No se pudieron cargar los datos de la clínica (${response.status})`);
  return mapMiClinica(await response.json());
}
