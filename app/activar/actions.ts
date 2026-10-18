"use server";

/** Define la contraseña con el enlace de invitación. Sin sesión: llama a la API directamente. */
export async function activarCuenta(uid: string, token: string, password: string): Promise<{ ok: boolean; mensaje?: string }> {
  try {
    const response = await fetch(`${process.env.DJANGO_API_URL}/api/auth/activar/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, token, password }),
      cache: "no-store",
    });
    if (response.ok) return { ok: true };
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    const mensaje = Object.values(data).flat().find((v) => typeof v === "string") as string | undefined;
    return { ok: false, mensaje };
  } catch {
    return { ok: false, mensaje: "No pudimos conectar con Vera. Intenta de nuevo en un momento." };
  }
}
