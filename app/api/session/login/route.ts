import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const djangoResponse = await fetch(`${process.env.DJANGO_API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!djangoResponse.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { access, refresh } = await djangoResponse.json();
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("access_token", access, { httpOnly: true, sameSite: "lax", secure: isProd, path: "/" });
  cookieStore.set("refresh_token", refresh, { httpOnly: true, sameSite: "lax", secure: isProd, path: "/" });

  return NextResponse.json({ ok: true });
}
