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

export function formatFechaCorta(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
  });
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
