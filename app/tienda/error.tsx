"use client";

import Link from "next/link";

export default function TiendaError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <h2 className="font-display text-xl font-bold text-vera-verde">Algo salió mal</h2>
        <p className="mt-2 text-sm text-muted-foreground">No pudimos cargar esta página. Intenta de nuevo.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={reset}
            className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Reintentar
          </button>
          <Link
            href="/tienda"
            className="grid min-h-11 place-items-center rounded-xl border border-border px-4 text-sm font-semibold text-vera-verde"
          >
            Pedir un link nuevo
          </Link>
        </div>
      </div>
    </div>
  );
}
