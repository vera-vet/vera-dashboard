import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwtExp, isExpiringSoon } from "@/lib/api/jwt";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const exp = accessToken ? decodeJwtExp(accessToken) : null;

  if (!accessToken || isExpiringSoon(exp)) {
    const refreshResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!refreshResponse.ok) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    const { access } = await refreshResponse.json();
    const response = NextResponse.next();
    response.cookies.set("access_token", access, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|carnet|api/session|_next|favicon.ico).*)"],
};
