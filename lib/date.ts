export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
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
