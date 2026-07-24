import { REPORTES } from "@/lib/data/seed/reportes";
import type { Reporte } from "@/lib/data/types";

export async function getReportePorServicio(servicioVisitaId: string): Promise<Reporte | undefined> {
  return REPORTES.find((r) => r.servicioVisitaId === servicioVisitaId);
}
