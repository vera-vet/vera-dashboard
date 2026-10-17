import type { ApiClinica } from "@/lib/api/types";
import type { Clinica, Comparticion } from "@/lib/data/types";

export function mapClinica(api: ApiClinica): Clinica {
  return { id: String(api.id), nombre: api.nombre };
}

/** Resultados del buscador con los que todavía no se comparte el paciente: volver a elegir una
 * clínica con compartición activa no hace nada, así que no se ofrece. Vive aquí, sin
 * dependencias de servidor, porque lo usa un componente cliente. */
export function clinicasDisponiblesParaCompartir(resultados: Clinica[], comparticiones: Comparticion[]): Clinica[] {
  const yaCompartidas = new Set(comparticiones.filter((c) => c.activo).map((c) => c.clinicaId));
  return resultados.filter((c) => !yaCompartidas.has(c.id));
}
