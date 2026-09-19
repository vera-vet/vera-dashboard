import { apiFetch } from "@/lib/api/client";
import type { ApiResumenReportes } from "@/lib/api/types";
import type { ResumenReportes } from "@/lib/data/types";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-09-14" → "14 sep". Se parte el string a mano para no depender de la zona del servidor. */
export function etiquetaSemana(fechaISO: string): string {
  const [, mes, dia] = fechaISO.split("-").map(Number);
  return `${dia} ${MESES[mes - 1]}`;
}

export function mapResumen(api: ApiResumenReportes): ResumenReportes {
  return {
    hoy: {
      recordatoriosEnviados: api.hoy.recordatorios_enviados,
      citas: api.hoy.citas,
      citasConfirmadas: api.hoy.citas_confirmadas,
    },
    mes: {
      recordatoriosEnviados: api.mes.recordatorios_enviados,
      conversacionesRespondidas: api.mes.conversaciones_respondidas,
      tasaRespuesta: api.mes.tasa_respuesta,
    },
    semanas: api.semanas.map((s) => ({ etiqueta: etiquetaSemana(s.inicio), enviados: s.enviados, respondidos: s.respondidos })),
  };
}

export async function getResumenReportes(): Promise<ResumenReportes> {
  const response = await apiFetch("/api/reportes/resumen/");
  if (!response.ok) throw new Error(`No se pudo cargar el resumen de reportes (${response.status})`);
  return mapResumen(await response.json());
}

/** La tasa es null cuando no hubo envíos: se muestra un guion, nunca un 0 % engañoso. */
export function formatTasa(tasa: number | null): string {
  return tasa === null ? "—" : `${tasa}%`;
}
