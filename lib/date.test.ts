import { describe, expect, it } from "vitest";
import { addDaysISO, edadTexto, formatFechaCorta, hoyISO } from "./date";

describe("hoyISO", () => {
  it("returns today's date in YYYY-MM-DD format", () => {
    const result = hoyISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe(new Date().toISOString().slice(0, 10));
  });
});

describe("addDaysISO", () => {
  it("adds days relative to a fixed reference date", () => {
    const from = new Date("2026-07-20T12:00:00Z");
    expect(addDaysISO(0, from)).toBe("2026-07-20");
    expect(addDaysISO(5, from)).toBe("2026-07-25");
    expect(addDaysISO(-3, from)).toBe("2026-07-17");
  });

  it("rolls over month boundaries", () => {
    const from = new Date("2026-07-30T12:00:00Z");
    expect(addDaysISO(3, from)).toBe("2026-08-02");
  });
});

describe("edadTexto", () => {
  it("shows months for patients under a year old", () => {
    const twoMonthsAgo = addDaysISO(-60);
    expect(edadTexto(twoMonthsAgo)).toMatch(/mes/);
  });

  it("shows years for patients over a year old", () => {
    const threeYearsAgo = addDaysISO(-365 * 3);
    expect(edadTexto(threeYearsAgo)).toBe("3 años");
  });

  it("uses singular 'año' for exactly one year", () => {
    const oneYearAgo = addDaysISO(-365);
    expect(edadTexto(oneYearAgo)).toBe("1 año");
  });
});

describe("formatFechaCorta", () => {
  it("formats an ISO date as day + short month in Spanish", () => {
    expect(formatFechaCorta("2026-08-05")).toBe("5 ago");
  });
});
