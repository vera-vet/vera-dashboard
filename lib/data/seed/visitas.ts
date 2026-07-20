import type { Visita } from "@/lib/data/types";

export const VISITAS: Visita[] = [
  { id: "v1", pacienteId: "p1", fechaOffsetDias: 0, hora: "09:00", motivo: "Refuerzo anual", confirmada: true },
  { id: "v2", pacienteId: "p2", fechaOffsetDias: 0, hora: "10:30", motivo: "2ª dosis séxtuple", confirmada: false },
  { id: "v3", pacienteId: "p4", fechaOffsetDias: 0, hora: "11:15", motivo: "Control de sutura", confirmada: true },
  { id: "v4", pacienteId: "p3", fechaOffsetDias: 0, hora: "14:00", motivo: "Consulta general", confirmada: false },
  { id: "v5", pacienteId: "p5", fechaOffsetDias: 0, hora: "15:30", motivo: "Antipulgas mensual", confirmada: true },
  { id: "v6", pacienteId: "p6", fechaOffsetDias: 0, hora: "16:00", motivo: "3ª dosis séxtuple", confirmada: false },
  { id: "v10", pacienteId: "p2", fechaOffsetDias: 1, hora: "09:30", motivo: "Control post-vacuna", confirmada: false },
  { id: "v11", pacienteId: "p6", fechaOffsetDias: 3, hora: "10:00", motivo: "3ª dosis séxtuple", confirmada: false },
  { id: "v12", pacienteId: "p3", fechaOffsetDias: 3, hora: "15:00", motivo: "Refuerzo anual (vencido)", confirmada: false },
  { id: "v13", pacienteId: "p1", fechaOffsetDias: 5, hora: "11:00", motivo: "Desparasitación", confirmada: true },
  { id: "v14", pacienteId: "p5", fechaOffsetDias: 6, hora: "16:30", motivo: "Consulta dermatológica", confirmada: false },
  { id: "v15", pacienteId: "p4", fechaOffsetDias: 7, hora: "09:00", motivo: "Retiro de puntos", confirmada: true },
  { id: "v16", pacienteId: "p2", fechaOffsetDias: 10, hora: "10:00", motivo: "Triple felina 3ª dosis", confirmada: false },
  { id: "v17", pacienteId: "p6", fechaOffsetDias: 12, hora: "14:30", motivo: "Control de peso", confirmada: false },
  { id: "v18", pacienteId: "p1", fechaOffsetDias: 14, hora: "09:00", motivo: "Baño medicado", confirmada: true },
  { id: "v19", pacienteId: "p3", fechaOffsetDias: 17, hora: "11:00", motivo: "Consulta seguimiento", confirmada: false },
  { id: "v20", pacienteId: "p5", fechaOffsetDias: 19, hora: "15:00", motivo: "Antipulgas mensual", confirmada: true },
];
