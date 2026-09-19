import { getSesionesActivas, getSalaEspera, getEstaciones, getEmpleados } from "@/lib/data/sala";
import { getPacientes } from "@/lib/data/pacientes";
import { EstacionCard } from "./estacion-card";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";

export default async function SalaPage() {
  const [sesiones, espera, estaciones, empleados, pacientes] = await Promise.all([
    getSesionesActivas(), getSalaEspera(), getEstaciones(), getEmpleados(), getPacientes(),
  ]);

  const tarjetas = estaciones.map((estacion) => {
    const sesion = sesiones.find((s) => s.estacionId === estacion.id);
    return { estacion, sesion: sesion ?? null };
  });

  const opcionesPaciente = pacientes.map(({ id, nombre }) => ({ id, nombre }));

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Sala</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quién atiende a quién, en vivo.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {tarjetas.map(({ estacion, sesion }) => (
          <EstacionCard key={estacion.id} estacion={estacion} sesion={sesion} pacientes={opcionesPaciente} empleados={empleados} />
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
              <AvatarPaciente nombre={item.pacienteNombre} fotoUrl={item.pacienteFotoUrl} tamano={40} />
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
