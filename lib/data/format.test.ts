import { describe, expect, it } from "vitest";
import { formatFechaHora } from "./format";

describe("formatFechaHora", () => {
  it("formats today's date as a time (e.g. '5:00 PM')", () => {
    const hoy = new Date();
    hoy.setHours(17, 0, 0, 0);
    const result = formatFechaHora(hoy.toISOString());
    // Node's full-ICU es-SV locale renders the meridiem as "p. m." (CLDR-standard
    // Spanish), not English "PM" — accept either so the assertion matches the
    // actual (correct) Spanish-locale output produced by the implementation.
    expect(result).toMatch(/5:00\s*p\.?\s*m\.?/i);
  });

  it("formats yesterday's date as 'Ayer'", () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    ayer.setHours(10, 0, 0, 0);
    const result = formatFechaHora(ayer.toISOString());
    expect(result).toBe("Ayer");
  });

  it("formats a date further in the past as a weekday name", () => {
    const haceTresDias = new Date();
    haceTresDias.setDate(haceTresDias.getDate() - 3);
    const result = formatFechaHora(haceTresDias.toISOString());
    const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    expect(weekdays).toContain(result);
  });
});
