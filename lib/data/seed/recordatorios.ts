import type { Recordatorio } from "@/lib/data/types";

export const RECORDATORIOS: Recordatorio[] = [
  { id: "r1", pacienteId: "p1", tipo: "Recordatorio de cita", cuando: "Hoy 5:00 PM", mensaje: "Le recordamos la cita de Rocky mañana." },
  { id: "r2", pacienteId: "p6", tipo: "3ª dosis séxtuple", cuando: "Mañana 9:00 AM", mensaje: "A Toby le toca su 3ª dosis." },
  { id: "r3", pacienteId: "p3", tipo: "Refuerzo vencido", cuando: "Miércoles 10:00 AM", mensaje: "El refuerzo anual de Max está pendiente." },
  { id: "r4", pacienteId: "p5", tipo: "Antipulgas mensual", cuando: "Viernes 9:00 AM", mensaje: "Es momento del antipulgas de Milo." },
];
