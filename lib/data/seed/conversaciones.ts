import type { Conversacion } from "@/lib/data/types";

export const CONVERSACIONES: Conversacion[] = [
  {
    id: "c1",
    duenoNombre: "María López",
    pacienteId: "p1",
    pacienteNombre: "Rocky",
    ultimoMensaje: "Sí, confirmado 👍",
    hora: "8:42 AM",
    estado: "agendado",
    mensajes: [
      { id: "m1", autor: "vera", texto: "¡Hola, María! 👋 Le recordamos la cita de Rocky mañana a las 9:00 AM para su refuerzo anual. ¿Confirma?", hora: "8:40 AM" },
      { id: "m2", autor: "dueno", texto: "Sí, confirmado 👍", hora: "8:42 AM" },
      { id: "m3", autor: "vera", texto: "¡Perfecto! La esperamos. Que tenga buen día.", hora: "8:42 AM" },
    ],
  },
  {
    id: "c2",
    duenoNombre: "Carlos Menjívar",
    pacienteId: "p2",
    pacienteNombre: "Luna",
    ultimoMensaje: "Ok, ahí llego mañana",
    hora: "10:15 AM",
    estado: "respondido",
    mensajes: [
      { id: "m4", autor: "vera", texto: "¡Hola, Carlos! 👋 A Luna le toca su 2ª dosis mañana a las 10:30 AM. ¿Puede venir?", hora: "10:10 AM" },
      { id: "m5", autor: "dueno", texto: "Ok, ahí llego mañana", hora: "10:15 AM" },
    ],
  },
  {
    id: "c3",
    duenoNombre: "Ana Portillo",
    pacienteId: "p3",
    pacienteNombre: "Max",
    ultimoMensaje: "¿Cuánto cuesta el refuerzo?",
    hora: "Ayer",
    estado: "sin_respuesta",
    mensajes: [
      { id: "m6", autor: "vera", texto: "¡Hola, Ana! 👋 El refuerzo anual de Max está vencido. ¿Le agendamos cita esta semana?", hora: "Ayer" },
      { id: "m7", autor: "dueno", texto: "¿Cuánto cuesta el refuerzo?", hora: "Ayer" },
    ],
  },
];
