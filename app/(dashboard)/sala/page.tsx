import Link from "next/link";
import { getSesionesActivas, getSalaEspera, getEstaciones, getEmpleados } from "@/lib/data/sala";
import { getMe } from "@/lib/data/usuario";
import { hoyISOElSalvador } from "@/lib/date";
import { EstacionCard } from "./estacion-card";
import { SalaEspera } from "./sala-espera";

export default async function SalaPage() {
  const [sesiones, espera, estaciones, empleados, usuario] = await Promise.all([
    getSesionesActivas(), getSalaEspera(), getEstaciones(), getEmpleados(), getMe(),
  ]);
  const hoy = hoyISOElSalvador();

  const tarjetas = estaciones.map((estacion) => ({
    estacion,
    sesion: sesiones.find((s) => s.estacionId === estacion.id) ?? null,
  }));
  const libres = tarjetas.filter((t) => t.sesion === null).map((t) => t.estacion);

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Sala</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quién atiende a quién, en vivo.</p>
      </header>

      {estaciones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Todavía no hay consultorios.{" "}
          {usuario.esAdmin ? (
            <>
              Agrégalos en <Link href="/ajustes" className="font-semibold text-vera-apoyo underline">Ajustes</Link>.
            </>
          ) : (
            "Pídele al administrador de la clínica que los agregue en Ajustes."
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {tarjetas.map(({ estacion, sesion }) => (
            <EstacionCard key={estacion.id} estacion={estacion} sesion={sesion} empleados={empleados} hoy={hoy} />
          ))}
        </div>
      )}

      <SalaEspera espera={espera} libres={libres} empleados={empleados} />
    </div>
  );
}
