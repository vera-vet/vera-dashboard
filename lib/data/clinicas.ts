import type { ApiClinica } from "@/lib/api/types";
import type { Clinica } from "@/lib/data/types";

export function mapClinica(api: ApiClinica): Clinica {
  return { id: String(api.id), nombre: api.nombre };
}
