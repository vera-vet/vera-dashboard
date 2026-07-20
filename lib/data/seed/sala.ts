import type { SesionActiva, SalaEsperaItem } from "@/lib/data/types";

export const SESIONES_ACTIVAS: SesionActiva[] = [
  { id: "sa1", pacienteId: "p3", empleadoId: "e2", estacionId: "c1", motivo: "Consulta general", inicio: "09:40", tipo: "consulta" },
  { id: "sa2", pacienteId: "p5", empleadoId: "e3", estacionId: "c2", motivo: "Antipulgas mensual", inicio: "09:55", tipo: "consulta" },
  { id: "sa3", pacienteId: "p6", empleadoId: "e4", estacionId: "b1", motivo: "Baño + corte", inicio: "09:20", tipo: "grooming" },
  { id: "sa4", pacienteId: "p1", empleadoId: "e5", estacionId: "b2", motivo: "Baño medicado", inicio: "09:35", tipo: "grooming" },
];

export const SALA_ESPERA: SalaEsperaItem[] = [
  { pacienteId: "p2", hora: "10:30", motivo: "2ª dosis séxtuple" },
  { pacienteId: "p4", hora: "11:15", motivo: "Control de sutura" },
];
