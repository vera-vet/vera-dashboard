import type { Especie, ServicioTipo } from "@/lib/data/types";

/** Etiquetas de los tipos de servicio, para no mostrar nunca el código ("consulta_oftalmologica"). */
export const TIPO_SERVICIO_LABEL: Record<ServicioTipo, string> = {
  vacuna: "Vacuna",
  desparasitacion: "Desparasitación",
  preventivo: "Preventivo",
  consulta: "Consulta",
  consulta_oftalmologica: "Consulta oftalmológica",
  cirugia: "Cirugía",
  examen: "Examen",
  control: "Control",
};

export function etiquetaTipo(tipo: string): string {
  return TIPO_SERVICIO_LABEL[tipo as ServicioTipo] ?? tipo;
}

export interface ProductoSugerido {
  nombre: string;
  /** Principios activos, para avisar si el paciente es alérgico. */
  compuestos?: string[];
  /** Plazo habitual hasta el próximo recordatorio; null = no se programa. */
  proximoEnDias: number | null;
  /** Solo se sugiere para estas especies (sin el campo, para todas). */
  especies?: Especie[];
}

// Sugerencias para registrar en un toque. Los plazos son los habituales; quien registra los
// ajusta si el protocolo de su clínica es otro.
const SUGERENCIAS: Record<ServicioTipo, ProductoSugerido[]> = {
  vacuna: [
    { nombre: "Séxtuple", proximoEnDias: 21, especies: ["perro"] },
    { nombre: "Triple felina", proximoEnDias: 21, especies: ["gato"] },
    { nombre: "Rabia", proximoEnDias: 365 },
    { nombre: "Refuerzo anual", proximoEnDias: 365 },
  ],
  desparasitacion: [
    { nombre: "Ivermectina", proximoEnDias: 90, compuestos: ["ivermectina"] },
    { nombre: "Praziquantel", proximoEnDias: 90, compuestos: ["praziquantel"] },
  ],
  preventivo: [{ nombre: "Antipulgas mensual", proximoEnDias: 30 }],
  consulta: [
    { nombre: "General", proximoEnDias: null },
    { nombre: "Dermatológica", proximoEnDias: null },
    { nombre: "Amoxicilina + Ácido Clavulánico", proximoEnDias: null, compuestos: ["amoxicilina"] },
  ],
  consulta_oftalmologica: [{ nombre: "Revisión oftalmológica", proximoEnDias: null }],
  cirugia: [
    { nombre: "Esterilización", proximoEnDias: 10 },
    { nombre: "Extracción dental", proximoEnDias: 10 },
  ],
  examen: [
    { nombre: "Hemograma", proximoEnDias: null },
    { nombre: "Coprológico", proximoEnDias: null },
  ],
  control: [{ nombre: "Control de peso", proximoEnDias: 30 }],
};

/** Plazo por tipo cuando el producto no es una sugerencia (texto libre). Igual que la API. */
const PLAZO_POR_TIPO: Record<ServicioTipo, number | null> = {
  vacuna: 21,
  desparasitacion: 90,
  preventivo: 30,
  cirugia: 10,
  control: 30,
  consulta: null,
  consulta_oftalmologica: null,
  examen: null,
};

export function productosSugeridos(tipo: ServicioTipo, especie: Especie): ProductoSugerido[] {
  return SUGERENCIAS[tipo].filter((p) => !p.especies || p.especies.includes(especie));
}

/** Lo que se registra más seguido para esta especie, en un toque (siempre con confirmación). */
export function serviciosFrecuentes(especie: Especie): { tipo: ServicioTipo; producto: string }[] {
  const vacuna = especie === "gato" ? "Triple felina" : "Séxtuple";
  return [
    { tipo: "vacuna", producto: vacuna },
    { tipo: "vacuna", producto: "Rabia" },
    { tipo: "preventivo", producto: "Antipulgas mensual" },
  ];
}

export function plazoPorDefecto(tipo: ServicioTipo, producto: string): number | null {
  const buscado = normalizarProducto(producto);
  const sugerido = SUGERENCIAS[tipo].find((p) => normalizarProducto(p.nombre) === buscado);
  return sugerido ? sugerido.proximoEnDias : PLAZO_POR_TIPO[tipo];
}

export const OPCIONES_PLAZO: { dias: number | null; label: string }[] = [
  { dias: null, label: "No programar" },
  { dias: 10, label: "En 10 días" },
  { dias: 21, label: "En 3 semanas" },
  { dias: 30, label: "En 1 mes" },
  { dias: 90, label: "En 3 meses" },
  { dias: 180, label: "En 6 meses" },
  { dias: 365, label: "En 1 año" },
];

/** El primer compuesto del producto al que el paciente es alérgico, si hay. */
export function alergiaEnConflicto(producto: string, tipo: ServicioTipo, alergias: string[]): string | undefined {
  const buscado = normalizarProducto(producto);
  const sugerido = SUGERENCIAS[tipo].find((p) => normalizarProducto(p.nombre) === buscado);
  const compuestos = sugerido?.compuestos ?? [];
  const alergiasNormalizadas = alergias.map(normalizarProducto);
  return (
    compuestos.find((c) => alergiasNormalizadas.includes(normalizarProducto(c))) ??
    // Producto en texto libre: basta con que nombre la sustancia ("Amoxicilina 500 mg").
    alergias.find((a) => normalizarProducto(a) && buscado.includes(normalizarProducto(a)))
  );
}

/**
 * "Séxtuple 1ª dosis", "séxtuple" y "Sextuple - 2ª dosis" son el mismo producto. Misma regla que
 * `normalizar_producto` en vera-api (apps/pacientes/servicios.py): si cambia allá, cambia aquí.
 */
export function normalizarProducto(texto: string): string {
  const sinAcentos = (texto ?? "").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ª/g, "a");
  const sinDosis = sinAcentos.toLowerCase().replace(/\b\d+\s*(?:a|ra|da|era|ta|va)?\s*dosis\b|\bdosis\b/g, " ");
  return sinDosis.replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

/** Un recordatorio abierto que una visita nueva puede dar por cumplido. */
export interface RecordatorioAbierto {
  id: string;
  servicioProducto: string | null;
  mensaje: string;
  cuando: string;
}

/** Si el recordatorio anunciaba este producto: así lo decide también la API por defecto. */
export function anunciaElProducto(recordatorio: RecordatorioAbierto, producto: string): boolean {
  const buscado = normalizarProducto(producto);
  if (!buscado) return false;
  if (recordatorio.servicioProducto !== null) return normalizarProducto(recordatorio.servicioProducto) === buscado;
  return normalizarProducto(recordatorio.mensaje).includes(buscado);
}
