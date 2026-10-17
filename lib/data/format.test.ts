import { describe, expect, it } from "vitest";
import { formatCuando, formatFechaHora } from "./format";

// Un sábado a las 4 p. m. en El Salvador (22:00 UTC). Las fechas son fijas: el resultado no
// depende ni del día en que corre el test ni de la zona horaria de la máquina (el CI corre en UTC).
const AHORA = new Date("2026-10-17T16:00:00-06:00");

describe("formatFechaHora", () => {
  it("shows today's time in El Salvador", () => {
    expect(formatFechaHora("2026-10-17T09:30:00-06:00", AHORA)).toMatch(/^9:30\s*a\.?\s*m\.?$/i);
  });

  it("keeps an 8 p.m. message on its own day even though it is already tomorrow in UTC", () => {
    const ayerNoche = "2026-10-16T20:00:00-06:00"; // 02:00 UTC del 17
    expect(formatFechaHora(ayerNoche, AHORA)).toBe("Ayer");
  });

  it("uses the weekday within the last week", () => {
    expect(formatFechaHora("2026-10-13T10:00:00-06:00", AHORA)).toBe("Martes");
  });

  it("uses the date after a week, with the year only when it differs", () => {
    expect(formatFechaHora("2026-09-13T10:00:00-06:00", AHORA)).toMatch(/^13 sept?\.?$/);
    expect(formatFechaHora("2025-11-03T10:00:00-06:00", AHORA)).toMatch(/^3 nov\.? 2025$/);
  });
});

describe("formatCuando", () => {
  it("names today, tomorrow and yesterday", () => {
    expect(formatCuando("2026-10-17T18:00:00-06:00", AHORA)).toMatch(/^Hoy, 6:00\s*p\.?\s*m\.?$/i);
    expect(formatCuando("2026-10-18T09:00:00-06:00", AHORA)).toMatch(/^Mañana, 9:00\s*a\.?\s*m\.?$/i);
    expect(formatCuando("2026-10-16T09:00:00-06:00", AHORA)).toMatch(/^Ayer, 9:00\s*a\.?\s*m\.?$/i);
  });

  it("shows weekday and date further away, with the year only when it differs", () => {
    expect(formatCuando("2026-10-20T09:00:00-06:00", AHORA)).toMatch(/^mar\.?,? 20 oct\.?, 9:00\s*a\.?\s*m\.?$/i);
    expect(formatCuando("2027-10-17T09:00:00-06:00", AHORA)).toMatch(/2027, 9:00\s*a\.?\s*m\.?$/i);
  });
});
