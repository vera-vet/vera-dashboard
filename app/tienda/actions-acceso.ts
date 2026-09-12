"use server";

export async function solicitarAcceso(whatsapp: string): Promise<{ ok: boolean }> {
  const response = await fetch(`${process.env.DJANGO_API_URL}/api/tienda/solicitar-acceso/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ whatsapp }),
  });
  return { ok: response.ok };
}
