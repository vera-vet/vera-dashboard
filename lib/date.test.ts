import { describe, expect, it } from "vitest";
import { addDaysISO, edadTexto, formatFechaCorta, hoyISO } from "./date";

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
