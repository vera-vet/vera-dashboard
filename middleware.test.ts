import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware, config } from "./middleware";

const API = "http://api.test";

function fakeJwt(exp: number): string {
  const payload = Buffer.from(JSON.stringify({ exp, user_id: 1 })).toString("base64url");
  return `header.${payload}.signature`;
}

const nowSeconds = () => Math.floor(Date.now() / 1000);

function request(path: string, cookies: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(new URL(path, "http://localhost:3000"));
  for (const [name, value] of Object.entries(cookies)) req.cookies.set(name, value);
  return req;
}

function location(res: Response): string | null {
  const loc = res.headers.get("location");
  return loc ? new URL(loc).pathname : null;
}

describe("middleware — staff dashboard", () => {
  beforeEach(() => {
    vi.stubEnv("DJANGO_API_URL", API);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("redirects to /login when there is no refresh token, without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await middleware(request("/pacientes"));

    expect(res.status).toBe(307);
    expect(location(res)).toBe("/login");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("redirects to /login even with a valid access token if the refresh token is missing", async () => {
    const res = await middleware(request("/pacientes", { access_token: fakeJwt(nowSeconds() + 600) }));
    expect(location(res)).toBe("/login");
  });

  it("lets the request through without calling the API when the access token is fresh", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await middleware(
      request("/pacientes", { access_token: fakeJwt(nowSeconds() + 600), refresh_token: "r" }),
    );

    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(res.headers.get("location")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refreshes an access token that is about to expire and sets the new cookie", async () => {
    const fresh = fakeJwt(nowSeconds() + 300);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ access: fresh }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await middleware(
      request("/agenda", { access_token: fakeJwt(nowSeconds() + 5), refresh_token: "the-refresh" }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `${API}/api/auth/refresh/`,
      expect.objectContaining({ method: "POST", body: JSON.stringify({ refresh: "the-refresh" }) }),
    );
    expect(res.headers.get("x-middleware-next")).toBe("1");
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`access_token=${fresh}`);
    expect(setCookie.toLowerCase()).toContain("httponly");
  });

  it("refreshes when the access token cookie is missing entirely", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ access: "new" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await middleware(request("/", { refresh_token: "r" }));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(res.headers.get("set-cookie")).toContain("access_token=new");
  });

  it("clears both cookies and redirects to /login when the refresh is rejected", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 401 })));

    const res = await middleware(request("/sala", { access_token: fakeJwt(nowSeconds() - 60), refresh_token: "expired" }));

    expect(location(res)).toBe("/login");
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toMatch(/access_token=;/);
    expect(setCookie).toMatch(/refresh_token=;/);
  });

  it("redirects to /login (instead of crashing) when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const res = await middleware(request("/sala", { refresh_token: "r" }));

    expect(location(res)).toBe("/login");
  });
});

describe("middleware — tienda (pet owners)", () => {
  it.each(["/tienda", "/tienda/acceder", "/tienda/acceder?token=abc"])("leaves %s public", async (path) => {
    const res = await middleware(request(path));
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it.each(["/tienda/catalogo", "/tienda/checkout", "/tienda/pedidos", "/tienda/pago-simulado/1"])(
    "sends %s back to /tienda without a dueno_token",
    async (path) => {
      const res = await middleware(request(path));
      expect(location(res)).toBe("/tienda");
    },
  );

  it("lets an owner with a dueno_token into the store", async () => {
    const res = await middleware(request("/tienda/catalogo", { dueno_token: "signed" }));
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("does not accept a staff session as a store session", async () => {
    const res = await middleware(
      request("/tienda/catalogo", { access_token: fakeJwt(nowSeconds() + 600), refresh_token: "r" }),
    );
    expect(location(res)).toBe("/tienda");
  });

  it("does not accept a store session as a staff session", async () => {
    const res = await middleware(request("/pacientes", { dueno_token: "signed" }));
    expect(location(res)).toBe("/login");
  });
});

describe("middleware matcher", () => {
  // Mirrors how Next applies `config.matcher`: an anchored regex over the pathname.
  const matcher = new RegExp(`^${config.matcher[0]}$`);

  it.each(["/", "/pacientes", "/pacientes/1", "/tienda/catalogo", "/api/pacientes/1/expediente-pdf"])(
    "runs on %s",
    (path) => expect(matcher.test(path)).toBe(true),
  );

  it.each(["/login", "/carnet/abc-123", "/api/session/login", "/api/tienda/acceder", "/_next/static/x.js", "/favicon.ico"])(
    "skips public path %s",
    (path) => expect(matcher.test(path)).toBe(false),
  );
});
