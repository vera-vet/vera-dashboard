import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwtExp, isExpiringSoon } from "@/lib/api/jwt";
import { accessCookieOptions } from "@/lib/api/session-cookie";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/tienda" || pathname.startsWith("/tienda/acceder")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/tienda")) {
    return request.cookies.get("dueno_token")
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/tienda", request.url));
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const exp = accessToken ? decodeJwtExp(accessToken) : null;

  if (!accessToken || isExpiringSoon(exp)) {
    let access: string | undefined;

    try {
      const refreshResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        ({ access } = await refreshResponse.json());
      }
    } catch {
      access = undefined;
    }

    if (!access) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    const response = NextResponse.next();
    response.cookies.set("access_token", access, accessCookieOptions());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|carnet|api/session|api/tienda|_next|favicon.ico).*)"],
};
