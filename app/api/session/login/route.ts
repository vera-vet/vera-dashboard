import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookieOptions } from "@/lib/api/session-cookie";

export async function POST(request: Request) {
  const body = await request.json();

  try {
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
    const cookieOptions = accessCookieOptions();

    cookieStore.set("access_token", access, cookieOptions);
    cookieStore.set("refresh_token", refresh, cookieOptions);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
