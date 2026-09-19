import { getEspecialidades } from "@/lib/data/especialidades";

const TIPO_SERVICIO_LABEL: Record<string, string> = {
  vacuna: "Vacuna",
  desparasitacion: "Desparasitación",
  preventivo: "Preventivo",
  consulta: "Consulta",
  cirugia: "Cirugía",
  examen: "Examen",
  control: "Control",
  consulta_oftalmologica: "Consulta oftalmológica",
};

export default async function AjustesPage() {
  const especialidades = await getEspecialidades();

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Ajustes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Especialidades de tu clínica y qué tipos de servicio las activan.</p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Especialidades</h2>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {especialidades.map((esp) => (
            <li key={esp.id} className="px-5 py-4">
              <div className="font-display text-base font-bold">{esp.nombre}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {esp.tiposServicioAsociados.map((tipo) => (
                  <span
                    key={tipo}
                    className="rounded-full bg-vera-menta-suave px-2.5 py-1 text-xs font-medium text-vera-apoyo"
                  >
                    {TIPO_SERVICIO_LABEL[tipo] ?? tipo}
                  </span>
                ))}
              </div>
            </li>
          ))}
          {especialidades.length === 0 && (
            <li className="p-10 text-center text-sm text-muted-foreground">Tu clínica no tiene especialidades configuradas todavía.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
