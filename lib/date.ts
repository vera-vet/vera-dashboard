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

export function edadTexto(fechaNacimiento: string): string {
  const nacida = new Date(fechaNacimiento);
  const meses = Math.floor(
    (Date.now() - nacida.getTime()) / (1000 * 60 * 60 * 24 * 30.44),
  );
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
  });
}
