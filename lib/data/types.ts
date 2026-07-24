export type Especie = "perro" | "gato" | "otro";

export type ServicioTipo =
  | "vacuna"
  | "desparasitacion"
  | "preventivo"
  | "consulta"
  | "cirugia"
  | "examen"
  | "control"
  | "consulta_oftalmologica";

export type EstadoEsquema = "al_dia" | "falta" | "vencido";

export interface Dueno {
  id: string;
  nombre: string;
  whatsapp: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  especie: Especie;
  raza: string;
  sexo: "M" | "H";
  fechaNacimiento: string;
  fotoUrl: string;
  duenoId: string;
  esterilizado: boolean;
  vacunasCompletas: number;
  vacunasTotal: number;
  estadoEsquema: EstadoEsquema;
  faltaTexto?: string;
  alergias: string[];
  notasComportamiento: string[];
}

export interface ServicioVisita {
  id: string;
  pacienteId: string;
  tipo: ServicioTipo;
  producto: string;
  fecha: string;
  vet: string;
  aplicada: boolean;
}

export interface Visita {
  id: string;
  pacienteId: string;
  fechaOffsetDias: number;
  hora?: string;
  motivo: string;
  confirmada: boolean;
}

export interface Recordatorio {
  id: string;
  pacienteId: string;
  tipo: string;
  cuando: string;
  mensaje: string;
}

export interface Mensaje {
  id: string;
  autor: "vera" | "dueno";
  texto: string;
  hora: string;
}

export interface Conversacion {
  id: string;
  duenoNombre: string;
  pacienteId: string;
  pacienteNombre: string;
  ultimoMensaje: string;
  hora: string;
  estado: "enviado" | "respondido" | "agendado" | "sin_respuesta";
  mensajes: Mensaje[];
}

export type Rol = "vet" | "secretaria" | "groomer";

export interface Empleado {
  id: string;
  nombre: string;
  rol: Rol;
  inicial: string;
}

export interface Estacion {
  id: string;
  nombre: string;
  tipo: "consultorio" | "bano";
}

export interface SesionActiva {
  id: string;
  pacienteId: string;
  empleadoId: string;
  estacionId: string;
  motivo: string;
  inicio: string;
  tipo: "consulta" | "grooming";
}

export interface SalaEsperaItem {
  pacienteId: string;
  hora: string;
  motivo: string;
}

export type DiagramaTipo = "perro" | "gato" | "otro" | "ojo";

export interface Marca {
  id: string;
  x: number; // 0-100, porcentaje del ancho del diagrama
  y: number; // 0-100, porcentaje del alto del diagrama
  nota: string;
}

export interface Reporte {
  id: string;
  servicioVisitaId: string;
  diagramaTipo: DiagramaTipo;
  marcas: Marca[];
  fotos: string[];
}

export interface Especialidad {
  id: string;
  nombre: string;
  tiposServicioAsociados: ServicioTipo[];
  diagramaId: DiagramaTipo;
}
