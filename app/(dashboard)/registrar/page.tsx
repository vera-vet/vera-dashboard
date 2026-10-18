import { esIdValido } from "@/lib/api/ids";
import { getEspecialidades } from "@/lib/data/especialidades";
import { getPaciente } from "@/lib/data/pacientes";
import { getSesionesActivas } from "@/lib/data/sala";
import type { Paciente } from "@/lib/data/types";
import { RegistrarClient } from "./registrar-client";

export default async function RegistrarPage({ searchParams }: { searchParams: Promise<{ paciente?: string }> }) {
  const { paciente: pacienteId } = await searchParams;

  const [especialidades, sesiones, inicial] = await Promise.all([
    getEspecialidades(),
    // Los que están en consulta ahora son los más probables: se ofrecen de un toque.
    getSesionesActivas().catch(() => []),
    pacienteId && esIdValido(pacienteId) ? getPaciente(pacienteId) : Promise.resolve(undefined),
  ]);
  const idsEnSala = [...new Set(sesiones.map((s) => s.pacienteId))];
  const enSala = (await Promise.all(idsEnSala.map((id) => getPaciente(id).catch(() => undefined)))).filter(
    (p): p is Paciente => p !== undefined,
  );

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Registrar visita</h1>
        <p className="mt-1 text-sm text-muted-foreground">Un tap. Vera programa el recordatorio automáticamente.</p>
      </header>
      <RegistrarClient especialidades={especialidades} pacienteInicial={inicial ?? null} enSala={enSala} />
    </div>
  );
}
