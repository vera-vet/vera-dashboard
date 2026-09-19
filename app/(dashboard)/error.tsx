"use client";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <h2 className="font-display text-xl font-bold text-vera-verde">Algo salió mal</h2>
        <p className="mt-2 text-sm text-muted-foreground">No pudimos cargar esta página. Intenta de nuevo.</p>
        <button
          onClick={reset}
          className="mt-4 min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
