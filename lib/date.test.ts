import { describe, expect, it } from "vitest";
import { addDaysISO, edadTexto, hoyISOElSalvador, formatFechaCorta, formatFechaHoraCorta, hoyISO, fechaLargaElSalvador, saludoSegunHora } from "./date";

describe("hoyISO", () => {
  it("returns today's date in YYYY-MM-DD format", () => {
    const result = hoyISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // Compare against the LOCAL calendar date (not toISOString(), which is
    // UTC-based and would be wrong on machines behind UTC, e.g. El Salvador
    // at UTC-6 in the evening).
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    expect(result).toBe(`${y}-${m}-${d}`);
  });
});

describe("addDaysISO", () => {
  it("adds days relative to a fixed reference date", () => {
    // T12:00:00Z is noon UTC. In El Salvador (UTC-6) that's 6:00 AM local,
    // still the same calendar day, so these assertions hold under both the
    // old UTC-based implementation and the new local-date implementation
    // (verified by running the suite on a UTC-6 machine).
    const from = new Date("2026-07-20T12:00:00Z");
    expect(addDaysISO(0, from)).toBe("2026-07-20");
    expect(addDaysISO(5, from)).toBe("2026-07-25");
    expect(addDaysISO(-3, from)).toBe("2026-07-17");
  });

  it("rolls over month boundaries", () => {
    const from = new Date("2026-07-30T12:00:00Z");
    expect(addDaysISO(3, from)).toBe("2026-08-02");
  });

  it("uses the LOCAL calendar date, not the UTC calendar date, at day boundaries", () => {
    // Build the reference Date using the LOCAL constructor form (year,
    // monthIndex, day, hour, min, sec) so it unambiguously represents
    // "July 20th, 11 PM" in whatever timezone the test runner itself uses.
    // This is the timezone-boundary case the bug fix targets: on a machine
    // with a negative UTC offset (e.g. El Salvador, UTC-6), 11 PM local on
    // July 20 is 5 AM UTC on July 21 — so the OLD buggy implementation
    // (`d.toISOString().slice(0, 10)`) would have returned "2026-07-21"
    // here, even though it was still July 20th locally. The fixed
    // implementation must return the local date, "2026-07-20", regardless
    // of the machine's UTC offset.
    const lateEvening = new Date(2026, 6, 20, 23, 0, 0);
    expect(addDaysISO(0, lateEvening)).toBe("2026-07-20");
  });
});

describe("edadTexto", () => {
  it("shows months for patients under a year old", () => {
    expect(edadTexto("2026-07-17", "2026-09-17")).toBe("2 meses");
    expect(edadTexto("2026-08-17", "2026-09-17")).toBe("1 mes");
    expect(edadTexto("2026-09-10", "2026-09-17")).toBe("0 meses");
  });

  it("counts calendar years, turning over exactly on the birthday", () => {
    expect(edadTexto("2023-09-17", "2026-09-17")).toBe("3 años");
    expect(edadTexto("2023-09-18", "2026-09-17")).toBe("2 años");
    expect(edadTexto("2023-09-16", "2026-09-17")).toBe("3 años");
  });

  it("uses singular 'año' for exactly one year", () => {
    expect(edadTexto("2025-09-17", "2026-09-17")).toBe("1 año");
  });

  it("handles a leap-day birthday", () => {
    expect(edadTexto("2024-02-29", "2025-02-28")).toBe("11 meses");
    expect(edadTexto("2024-02-29", "2025-03-01")).toBe("1 año");
  });

  it("never returns a negative age for a future date", () => {
    expect(edadTexto("2026-12-01", "2026-09-17")).toBe("0 meses");
  });

  it("accepts full ISO datetimes by using only the date part", () => {
    expect(edadTexto("2023-09-17T00:00:00Z", "2026-09-17")).toBe("3 años");
  });

  it("defaults to today in El Salvador", () => {
    const hace3Anios = `${Number(hoyISOElSalvador().slice(0, 4)) - 3}${hoyISOElSalvador().slice(4)}`;
    expect(edadTexto(hace3Anios)).toBe("3 años");
  });
});

describe("hoyISOElSalvador", () => {
  it("uses El Salvador's date, not the machine's or UTC's", () => {
    // 02:00 UTC on Sep 18 is still 20:00 on Sep 17 in El Salvador (UTC-6).
    expect(hoyISOElSalvador(new Date("2026-09-18T02:00:00Z"))).toBe("2026-09-17");
    expect(hoyISOElSalvador(new Date("2026-09-18T06:00:00Z"))).toBe("2026-09-18");
  });
});

describe("saludoSegunHora", () => {
  // El Salvador es UTC-6 todo el año (sin horario de verano).
  const enSV = (hhmm: string, dia = "2026-09-18") => new Date(`${dia}T${hhmm}:00-06:00`);

  it("buenos días de 5:00 a 11:59", () => {
    expect(saludoSegunHora(enSV("05:00"))).toBe("Buenos días");
    expect(saludoSegunHora(enSV("11:59"))).toBe("Buenos días");
  });

  it("buenas tardes de 12:00 a 18:59", () => {
    expect(saludoSegunHora(enSV("12:00"))).toBe("Buenas tardes");
    expect(saludoSegunHora(enSV("18:59"))).toBe("Buenas tardes");
  });

  it("buenas noches de 19:00 a 4:59", () => {
    expect(saludoSegunHora(enSV("19:00"))).toBe("Buenas noches");
    expect(saludoSegunHora(enSV("00:00"))).toBe("Buenas noches");
    expect(saludoSegunHora(enSV("04:59"))).toBe("Buenas noches");
  });

  it("usa la hora de El Salvador aunque el servidor esté en UTC", () => {
    // 01:00 UTC ya es de noche (19:00 del día anterior) en El Salvador.
    expect(saludoSegunHora(new Date("2026-09-19T01:00:00Z"))).toBe("Buenas noches");
  });
});

describe("fechaLargaElSalvador", () => {
  it("no se adelanta al día siguiente después de las 18:00", () => {
    expect(fechaLargaElSalvador(new Date("2026-09-19T01:00:00Z"))).toContain("18 de septiembre");
  });
});
