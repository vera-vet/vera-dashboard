import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { duenoCookieOptions } from "@/lib/api/session-cookie";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const djangoResponse = await fetch(`${process.env.DJANGO_API_URL}/api/tienda/acceder/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await djangoResponse.json();

    if (!djangoResponse.ok) {
      return NextResponse.json({ ok: false, error: data.error }, { status: djangoResponse.status });
    }

    const cookieStore = await cookies();
    cookieStore.set("dueno_token", data.token, duenoCookieOptions());

    return NextResponse.json({ ok: true, duenoNombre: data.dueno_nombre });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
