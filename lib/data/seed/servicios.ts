import type { ServicioVisita } from "@/lib/data/types";
import { addDaysISO } from "@/lib/date";

export const SERVICIOS: ServicioVisita[] = [
  { id: "s1", pacienteId: "p1", tipo: "vacuna", producto: "Séxtuple - 1ª dosis", fecha: addDaysISO(-400), vet: "Dra. Ramírez", aplicada: true },
  { id: "s2", pacienteId: "p1", tipo: "vacuna", producto: "Séxtuple - 2ª dosis", fecha: addDaysISO(-380), vet: "Dra. Ramírez", aplicada: true },
  { id: "s3", pacienteId: "p1", tipo: "vacuna", producto: "Rabia", fecha: addDaysISO(-350), vet: "Dra. Ramírez", aplicada: true },
  { id: "s4", pacienteId: "p1", tipo: "desparasitacion", producto: "Ivermectina", fecha: addDaysISO(-60), vet: "Dra. Ramírez", aplicada: true },
  { id: "s5", pacienteId: "p1", tipo: "vacuna", producto: "Refuerzo anual séxtuple", fecha: addDaysISO(-3), vet: "Dra. Ramírez", aplicada: true },
  { id: "s6", pacienteId: "p2", tipo: "vacuna", producto: "Triple felina - 1ª dosis", fecha: addDaysISO(-30), vet: "Dra. Ramírez", aplicada: true },
  { id: "s7", pacienteId: "p2", tipo: "desparasitacion", producto: "Ivermectina", fecha: addDaysISO(-30), vet: "Dra. Ramírez", aplicada: true },
  { id: "s8", pacienteId: "p4", tipo: "cirugia", producto: "Esterilización", fecha: addDaysISO(-45), vet: "Dra. Ramírez", aplicada: true },
  { id: "s9", pacienteId: "p4", tipo: "control", producto: "Control de sutura", fecha: addDaysISO(-35), vet: "Dra. Ramírez", aplicada: true },
];
