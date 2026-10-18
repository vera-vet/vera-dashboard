import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { getClinicaTienda } from "@/lib/data/tienda";

export default async function TiendaLayout({ children }: { children: ReactNode }) {
  // Con sesión, la tienda dice de qué clínica es (un dueño puede tener mascotas en más de una).
  const conSesion = Boolean((await cookies()).get("dueno_token"));
  const clinica = conSesion ? await getClinicaTienda() : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto flex max-w-[600px] flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-xl font-bold text-vera-verde">Tienda</h1>
            {clinica && <p className="text-xs text-muted-foreground">{clinica.nombre}</p>}
          </div>
          {clinica && (
            <nav aria-label="Tienda" className="flex items-center gap-3 text-sm font-semibold">
              <Link href="/tienda/catalogo" className="text-vera-apoyo hover:underline">Catálogo</Link>
              <Link href="/tienda/pedidos" className="text-vera-apoyo hover:underline">Mis pedidos</Link>
              <a href="/api/tienda/salir" className="text-muted-foreground hover:underline">Salir</a>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-[600px] px-4 py-6">{children}</main>
    </div>
  );
}
