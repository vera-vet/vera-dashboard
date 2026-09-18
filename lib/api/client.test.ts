import { describe, expect, it } from "vitest";
import { buildAuthHeaders, buildAuthHeadersForBody } from "./client";

describe("buildAuthHeaders", () => {
  it("includes an Authorization header when a token is provided", () => {
    const headers = buildAuthHeaders("abc123");
    expect(headers).toMatchObject({ Authorization: "Bearer abc123" });
  });

  it("omits the Authorization header when no token is provided", () => {
    const headers = buildAuthHeaders(undefined);
    expect(headers).not.toHaveProperty("Authorization");
  });

  it("always sets Content-Type to application/json", () => {
    const headers = buildAuthHeaders("abc123");
    expect(headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it("merges extra headers passed in", () => {
    const headers = buildAuthHeaders("abc123", { "X-Custom": "value" });
    expect(headers).toMatchObject({ "X-Custom": "value", Authorization: "Bearer abc123" });
  });
});

describe("buildAuthHeadersForBody", () => {
  it("omits Content-Type when the body is FormData", () => {
    const headers = buildAuthHeadersForBody("abc123", new FormData());
    expect(headers).not.toHaveProperty("Content-Type");
    expect(headers).toMatchObject({ Authorization: "Bearer abc123" });
  });

  it("behaves like buildAuthHeaders for a non-FormData body", () => {
    const headers = buildAuthHeadersForBody("abc123", JSON.stringify({ a: 1 }));
    expect(headers).toMatchObject({ "Content-Type": "application/json", Authorization: "Bearer abc123" });
  });

  it("behaves like buildAuthHeaders when body is undefined", () => {
    const headers = buildAuthHeadersForBody("abc123", undefined);
    expect(headers).toMatchObject({ "Content-Type": "application/json" });
  });
});
