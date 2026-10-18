import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Cierra la sesión de la tienda. También es a donde se manda a un dueño cuya sesión venció: sin
// borrar la cookie, /tienda lo devolvía al catálogo, el catálogo daba 401 y volvía a /tienda (bucle).
export async function GET(request: Request) {
  const vencida = new URL(request.url).searchParams.get("vencida") === "1";
  (await cookies()).delete("dueno_token");
  return NextResponse.redirect(new URL(vencida ? "/tienda?vencida=1" : "/tienda", request.url));
}
