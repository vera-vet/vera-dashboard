import { afterEach, describe, expect, it, vi } from "vitest";
import { accessCookieOptions, duenoCookieOptions } from "./session-cookie";

describe("session cookie options", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("staff cookies are httpOnly, lax, site-wide and not secure outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(accessCookieOptions()).toEqual({ httpOnly: true, sameSite: "lax", path: "/", secure: false });
  });

  it("staff cookies are secure in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(accessCookieOptions().secure).toBe(true);
  });

  it("owner cookie matches the 7-day Django session lifetime and is secure in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(duenoCookieOptions()).toMatchObject({ httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 });
  });
});
