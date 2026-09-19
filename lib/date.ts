export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function hoyISO(): string {
  return toLocalISODate(new Date());
}

export function addDaysISO(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return toLocalISODate(d);
}

// Fecha de hoy (YYYY-MM-DD) en El Salvador, sin importar la zona horaria del servidor
// (en producción los server components suelen correr en UTC).
export function hoyISOElSalvador(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/El_Salvador" }).format(ahora);
}

// Saludo según la hora de El Salvador: días de 5 a 11, tardes de 12 a 18, noches de 19 a 4.
export function saludoSegunHora(ahora: Date = new Date()): string {
  const hora = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/El_Salvador", hour: "numeric", hourCycle: "h23" }).format(ahora),
  );
  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

// Fecha larga de hoy en El Salvador, por ejemplo "jueves, 18 de septiembre".
export function fechaLargaElSalvador(ahora: Date = new Date()): string {
  return ahora.toLocaleDateString("es-SV", {
    weekday: "long", day: "numeric", month: "long", timeZone: "America/El_Salvador",
  });
}

// Meses calendario cumplidos, igual que `edad_texto` en vera-api. Aritmética pura sobre
// "YYYY-MM-DD": no parsea a Date, así que no depende de la zona horaria (antes se usaba
// `new Date(iso)`, que es medianoche UTC, dividido entre meses de 30.44 días, y cerca de un
// cumpleaños mostraba un año menos).
export function edadTexto(fechaNacimiento: string, hoy: string = hoyISOElSalvador()): string {
  const [ny, nm, nd] = fechaNacimiento.slice(0, 10).split("-").map(Number);
  const [hy, hm, hd] = hoy.slice(0, 10).split("-").map(Number);
  let meses = (hy - ny) * 12 + (hm - nm);
  if (hd < nd) meses -= 1;
  meses = Math.max(meses, 0);
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? "año" : "años"}`;
}

// "2026-09-18" → "18 sept"; si no es de este año, con el año ("3 nov 2023"), para que un
// historial de varios años no parezca desordenado.
export function formatFechaCorta(iso: string, hoy: string = hoyISOElSalvador()): string {
  const otroAnio = iso.slice(0, 4) !== hoy.slice(0, 4);
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
    ...(otroAnio ? { year: "numeric" } : {}),
  });
}

// Hora de la API ("08:30:00" o "14:05") → "8:30 a. m." / "2:05 p. m.". Aritmética sobre el
// string: la hora de una cita no tiene zona.
export function formatHora(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

// For full ISO 8601 datetimes (date + time + offset), e.g. NotaConsulta.fechaHora.
// Unlike formatFechaCorta, this must NOT append "T00:00:00" — the string already
// carries a time and timezone offset, and doing so would produce an invalid date.
export function formatFechaHoraCorta(iso: string): string {
  return new Date(iso).toLocaleString("es-SV", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/El_Salvador",
  });
}
