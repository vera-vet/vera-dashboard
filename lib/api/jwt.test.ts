import { describe, expect, it } from "vitest";
import { decodeJwtExp, isExpiringSoon } from "./jwt";

function fakeJwt(payload: object): string {
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json, "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `header.${base64}.signature`;
}

describe("decodeJwtExp", () => {
  it("extracts the exp claim from a well-formed token", () => {
    const token = fakeJwt({ exp: 1234567890, user_id: 1 });
    expect(decodeJwtExp(token)).toBe(1234567890);
  });

  it("returns null when the payload has no exp field", () => {
    const token = fakeJwt({ user_id: 1 });
    expect(decodeJwtExp(token)).toBeNull();
  });

  it("returns null for a malformed token", () => {
    expect(decodeJwtExp("not-a-jwt")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(decodeJwtExp("")).toBeNull();
  });
});

describe("isExpiringSoon", () => {
  it("returns true when exp is null", () => {
    expect(isExpiringSoon(null)).toBe(true);
  });

  it("returns true when exp is already in the past", () => {
    const pastExp = Date.now() / 1000 - 60;
    expect(isExpiringSoon(pastExp)).toBe(true);
  });

  it("returns true when exp is within the default 30s margin", () => {
    const soonExp = Date.now() / 1000 + 10;
    expect(isExpiringSoon(soonExp)).toBe(true);
  });

  it("returns false when exp is comfortably in the future", () => {
    const futureExp = Date.now() / 1000 + 3600;
    expect(isExpiringSoon(futureExp)).toBe(false);
  });

  it("respects a custom margin", () => {
    const exp = Date.now() / 1000 + 100;
    expect(isExpiringSoon(exp, 200)).toBe(true);
    expect(isExpiringSoon(exp, 50)).toBe(false);
  });
});
