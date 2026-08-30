import { Clock } from "lucide-react";
import { getSesionesActivas, getSalaEspera, getEstaciones } from "@/lib/data/sala";

export default async function SalaPage() {
  const [sesiones, espera, estaciones] = await Promise.all([getSesionesActivas(), getSalaEspera(), getEstaciones()]);

  const tarjetas = estaciones.map((estacion) => {
    const sesion = sesiones.find((s) => s.estacionId === estacion.id);
    return { estacion, sesion: sesion ?? null };
  });

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Sala</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quién atiende a quién, en vivo.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {tarjetas.map(({ estacion, sesion }) => (
          <div
            key={estacion.id}
            className={
              sesion
                ? "rounded-2xl border border-vera-emerald bg-vera-sage p-4"
                : "rounded-2xl border border-dashed border-border bg-card p-4"
            }
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-vera-emerald">{estacion.nombre}</span>
              {sesion ? (
                <span className="rounded-full bg-vera-emerald px-2 py-0.5 text-[10px] font-medium text-white">en curso</span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Libre</span>
              )}
            </div>
            {sesion ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <img src={sesion.pacienteFotoUrl} alt={sesion.pacienteNombre} className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="truncate font-display text-base font-bold">{sesion.pacienteNombre}</div>
                    <div className="truncate text-xs text-muted-foreground">{sesion.duenoNombre}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                  <span className="font-medium">{sesion.empleadoNombre}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={12} /> desde {sesion.inicio}
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">Sin sesión activa</p>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-display text-lg font-bold">Sala de espera</h2>
      {espera.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nadie esperando ahora.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {espera.map((item) => (
            <li key={item.pacienteId} className="flex items-center gap-3 px-5 py-4">
              <div className="rounded-xl bg-vera-sage px-2.5 py-1.5 text-center font-display text-sm font-bold text-vera-emerald">
                {item.hora}
              </div>
              <img src={item.pacienteFotoUrl} alt={item.pacienteNombre} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{item.pacienteNombre}</div>
                <div className="truncate text-xs text-muted-foreground">{item.motivo}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
