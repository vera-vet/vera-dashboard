// Las fotos subidas a Vera se sirven desde el mismo origen del panel: el navegador nunca habla con
// Django. Son públicas por su UUID (como el carnet), así que la ruta no exige sesión.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return new Response("No encontrada", { status: 404 });

  const respuesta = await fetch(`${process.env.DJANGO_API_URL}/api/imagenes/${id}/`, { cache: "no-store" }).catch(() => null);
  if (!respuesta?.ok || !respuesta.body) return new Response("No encontrada", { status: 404 });

  return new Response(respuesta.body, {
    headers: {
      "Content-Type": respuesta.headers.get("Content-Type") ?? "image/jpeg",
      // Una foto nunca cambia: una nueva es otro UUID.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
