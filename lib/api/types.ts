export interface ApiDueno {
  id: number;
  nombre: string;
  whatsapp: string;
}

export interface ApiMarca {
  id: number;
  x: number;
  y: number;
  nota: string;
}

export interface ApiReporte {
  id: number;
  diagrama_tipo: string;
  fotos: string[];
  marcas: ApiMarca[];
}

export interface ApiServicioVisita {
  id: number;
  paciente: number;
  tipo: string;
  producto: string;
  fecha: string;
  vet: string;
  aplicada: boolean;
  reporte: ApiReporte | null;
}

export interface ApiPaciente {
  id: number;
  dueno: number;
  dueno_nombre: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fecha_nacimiento: string;
  foto_url: string;
  esterilizado: boolean;
  vacunas_completas: number;
  vacunas_total: number;
  estado_esquema: string;
  falta_texto: string;
  alergias: string[];
  notas_comportamiento: string[];
  carnet_token: string;
}

export interface ApiVisita {
  id: number;
  paciente: number;
  fecha: string;
  hora: string | null;
  motivo: string;
  confirmada: boolean;
}

export interface ApiRecordatorio {
  id: number;
  paciente: number;
  tipo: string;
  programado_para: string;
  mensaje: string;
  estado: string;
}

export interface ApiMensaje {
  id: number;
  autor: string;
  texto: string;
  created_at: string;
}

export interface ApiConversacion {
  id: number;
  paciente: number;
  paciente_nombre: string;
  dueno_nombre: string;
  estado: string;
  ultimo_mensaje: string;
  ultimo_mensaje_en: string | null;
  mensajes?: ApiMensaje[];
}

export interface ApiEmpleado {
  id: number;
  nombre: string;
  rol: string;
  inicial: string;
}

export interface ApiEstacion {
  id: number;
  nombre: string;
  tipo: string;
}

export interface ApiSesionActiva {
  id: number;
  paciente: number;
  empleado: number;
  estacion: number;
  motivo: string;
  inicio: string;
  tipo: string;
}

export interface ApiSalaEsperaItem {
  id: number;
  paciente: number;
  hora: string;
  motivo: string;
}

export interface ApiEspecialidad {
  id: number;
  nombre: string;
  tipos_servicio_asociados: string[];
  diagrama_id: string;
}
