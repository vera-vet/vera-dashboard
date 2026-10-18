import { getEspecialidades } from "@/lib/data/especialidades";
import { getMiClinica } from "@/lib/data/mi-clinica";
import { getEmpleados, getEstaciones } from "@/lib/data/sala";
import { getMe } from "@/lib/data/usuario";
import { etiquetaTipo } from "@/lib/data/registro";
import { ClinicaForm } from "./clinica-form";
import { ConsultoriosSection, EquipoSection } from "./secciones";

export default async function AjustesPage() {
  const [usuario, clinica, empleados, estaciones, especialidades] = await Promise.all([
    getMe(), getMiClinica(), getEmpleados(), getEstaciones(), getEspecialidades(),
  ]);

  return (
    <div className="max-w-3xl">
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Ajustes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Los datos de tu clínica, tu equipo y tus consultorios.
          {!usuario.esAdmin && " Solo el administrador de la clínica puede cambiarlos."}
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Clínica</h2>
        <ClinicaForm clinica={clinica} esAdmin={usuario.esAdmin} />
      </section>

      <EquipoSection empleados={empleados} esAdmin={usuario.esAdmin} />
      <ConsultoriosSection estaciones={estaciones} esAdmin={usuario.esAdmin} />

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold">Especialidades</h2>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {especialidades.map((esp) => (
            <li key={esp.id} className="px-5 py-4">
              <div className="font-display text-base font-bold">{esp.nombre}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {esp.tiposServicioAsociados.map((tipo) => (
                  <span key={tipo} className="rounded-full bg-vera-menta-suave px-2.5 py-1 text-xs font-medium text-vera-apoyo">
                    {etiquetaTipo(tipo)}
                  </span>
                ))}
              </div>
            </li>
          ))}
          {especialidades.length === 0 && (
            <li className="p-8 text-center text-sm text-muted-foreground">Tu clínica no tiene especialidades configuradas.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
