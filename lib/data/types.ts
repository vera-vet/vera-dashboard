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
  /** Consentimiento para recibir recordatorios por WhatsApp. */
  aceptaWhatsapp: boolean;
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
  duenoNombre: string;
  /** E.164; vacío en expedientes compartidos (compartir no incluye el contacto). */
  duenoWhatsapp: string;
  esterilizado: boolean;
  vacunasCompletas: number;
  vacunasTotal: number;
  estadoEsquema: EstadoEsquema;
  faltaTexto?: string;
  alergias: string[];
  notasComportamiento: string[];
  carnetToken: string;
}

export interface NotaDeServicio {
  id: string;
  fechaHora: string;
  texto: string;
}

export interface ServicioVisita {
  id: string;
  pacienteId: string;
  tipo: ServicioTipo;
  producto: string;
  fecha: string;
  vet: string;
  aplicada: boolean;
  reporte?: Reporte;
  /** Clínica que registró la visita cuando no fue la dueña del expediente (compartidos). */
  clinicaOrigenNombre?: string;
  /** Notas escritas o transcripciones conectadas a esta visita. */
  notas: NotaDeServicio[];
}

export interface Visita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteFotoUrl: string;
  duenoNombre: string;
  pacienteEstadoEsquema: EstadoEsquema;
  pacienteFaltaTexto?: string;
  fecha: string;
  hora?: string;
  motivo: string;
  confirmada: boolean;
}

export interface Recordatorio {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteFotoUrl: string;
  /** Sin consentimiento, el recordatorio no sale aunque esté pendiente. */
  duenoAceptaWhatsapp: boolean;
  tipo: string;
  /** Producto del servicio que lo generó; null en los anteriores a ese dato. */
  servicioProducto: string | null;
  cuando: string;
  mensaje: string;
  estado: "pendiente" | "pausado" | "enviado" | "cumplido";
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
  pacienteNombre: string;
  pacienteFotoUrl: string;
  duenoNombre: string;
  empleadoId: string;
  empleadoNombre: string;
  estacionId: string;
  motivo: string;
  inicio: string;
  tipo: "consulta" | "grooming";
  /** Fecha (YYYY-MM-DD, El Salvador) en que se abrió: si no es hoy, quedó abierta. */
  fechaInicio?: string;
}

export interface SalaEsperaItem {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteFotoUrl: string;
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

export interface NotaConsulta {
  id: string;
  pacienteId: string;
  empleadoId: string;
  empleadoNombre: string;
  fechaHora: string;
  transcripcion: string;
  servicioVisitaId?: string;
}

export interface Clinica {
  id: string;
  nombre: string;
}

/** La propia clínica, como la edita el admin en Ajustes. */
export interface MiClinica {
  id: string;
  nombre: string;
  whatsapp: string;
}

export interface Comparticion {
  id: string;
  pacienteId: string;
  clinicaId: string;
  clinicaNombre: string;
  otorgadoPorNombre: string;
  otorgadoEn: string;
  revocadoEn: string | null;
  activo: boolean;
}

export type ProductoCategoria = "medicina" | "alimento" | "accesorio";

export interface Producto {
  id: string;
  nombre: string;
  categoria: ProductoCategoria;
  precio: number;
  cantidad: number;
  fotoUrl: string;
}

export interface Usuario {
  email: string;
  nombre: string;
  esAdmin: boolean;
  clinicaNombre: string;
}

export interface ResumenReportes {
  hoy: { recordatoriosEnviados: number; citas: number; citasConfirmadas: number };
  mes: { recordatoriosEnviados: number; conversacionesRespondidas: number; tasaRespuesta: number | null };
  /** Últimas semanas, de la más antigua a la actual. `etiqueta` es el lunes, por ejemplo "15 sep". */
  semanas: { etiqueta: string; enviados: number; respondidos: number }[];
}

export type TipoEntrega = "retiro" | "domicilio";
export type EstadoPedido = "pendiente_pago" | "pagado" | "en_proceso" | "entregado" | "cancelado" | "pago_sin_stock";

export interface PedidoItem {
  id: string;
  productoId: string | null;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id: string;
  duenoId: string;
  duenoNombre: string;
  tipoEntrega: TipoEntrega;
  direccionEntrega: string;
  estado: EstadoPedido;
  creadoEn: string;
  items: PedidoItem[];
}
