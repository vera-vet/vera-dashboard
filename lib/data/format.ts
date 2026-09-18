const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatFechaHora(iso: string): string {
  const fecha = new Date(iso);
  const ahora = new Date();

  if (isSameDay(fecha, ahora)) {
    return fecha.toLocaleTimeString("es-SV", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  const ayer = new Date(ahora);
  ayer.setDate(ayer.getDate() - 1);
  if (isSameDay(fecha, ayer)) {
    return "Ayer";
  }

  const diffDias = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDias >= 0 && diffDias < 7) {
    return WEEKDAYS[fecha.getDay()];
  }

  return fecha.toLocaleDateString("es-SV", { day: "numeric", month: "short" });
}
