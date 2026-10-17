import { hoyISOElSalvador } from "@/lib/date";

// Todo se calcula en la hora de El Salvador: los server components corren en UTC en producción, y
// un mensaje de las 8 p. m. no puede aparecer como del día siguiente.
const TZ = "America/El_Salvador";

/** Días calendario de `desde` a `hasta` (ambas "YYYY-MM-DD"). */
function diasEntre(desde: string, hasta: string): number {
  const [ay, am, ad] = desde.split("-").map(Number);
  const [by, bm, bd] = hasta.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

function hora(fecha: Date): string {
  return fecha.toLocaleTimeString("es-SV", { hour: "numeric", minute: "2-digit", timeZone: TZ });
}

function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function diaYMes(fecha: Date, ahora: Date, conDiaDeSemana: boolean): string {
  const otroAnio = hoyISOElSalvador(fecha).slice(0, 4) !== hoyISOElSalvador(ahora).slice(0, 4);
  return fecha.toLocaleDateString("es-SV", {
    ...(conDiaDeSemana ? { weekday: "short" as const } : {}),
    day: "numeric",
    month: "short",
    ...(otroAnio ? { year: "numeric" as const } : {}),
    timeZone: TZ,
  });
}

/**
 * Cuándo pasó algo, relativo a hoy: la hora si fue hoy, "Ayer", el día de la semana en la última
 * semana y, si no, la fecha ("13 sept"; con año si no es de este año). Para mensajes y bandejas.
 */
export function formatFechaHora(iso: string, ahora: Date = new Date()): string {
  const fecha = new Date(iso);
  const hace = diasEntre(hoyISOElSalvador(fecha), hoyISOElSalvador(ahora));
  if (hace === 0) return hora(fecha);
  if (hace === 1) return "Ayer";
  if (hace > 1 && hace < 7) {
    return mayuscula(fecha.toLocaleDateString("es-SV", { weekday: "long", timeZone: TZ }));
  }
  return diaYMes(fecha, ahora, false);
}

/** Cuándo sale algo programado: "Hoy, 9:00 a. m.", "Mañana, 9:00 a. m." o "lun, 20 oct, 9:00 a. m.". */
export function formatCuando(iso: string, ahora: Date = new Date()): string {
  const fecha = new Date(iso);
  const faltan = diasEntre(hoyISOElSalvador(ahora), hoyISOElSalvador(fecha));
  const h = hora(fecha);
  if (faltan === 0) return `Hoy, ${h}`;
  if (faltan === 1) return `Mañana, ${h}`;
  if (faltan === -1) return `Ayer, ${h}`;
  return `${diaYMes(fecha, ahora, true)}, ${h}`;
}
