import { getPacientes } from "@/lib/data/pacientes";
import { getEspecialidades } from "@/lib/data/especialidades";
import { RegistrarClient } from "./registrar-client";

export default async function RegistrarPage() {
  const [pacientes, especialidades] = await Promise.all([getPacientes(), getEspecialidades()]);

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Registrar visita</h1>
        <p className="mt-1 text-sm text-muted-foreground">Un tap. Vera programa el recordatorio automáticamente.</p>
      </header>
      <RegistrarClient pacientes={pacientes} especialidades={especialidades} />
    </div>
  );
}
