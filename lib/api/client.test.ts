import { describe, expect, it } from "vitest";
import { buildAuthHeaders } from "./client";

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
