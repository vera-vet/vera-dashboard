import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { esIdValido } from "@/lib/api/ids";
import { getPaciente } from "@/lib/data/pacientes";
import { getVisitasEntre } from "@/lib/data/visitas";
import { esFechaISOValida, fechaConMes, hoyISOElSalvador, lunesDeLaSemana, sumarDiasISO } from "@/lib/date";
import { AgendaSemana } from "./agenda-semana";

const BOTON = "inline-flex min-h-11 items-center gap-1 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-secondary";

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ semana?: string; paciente?: string }> }) {
  const { semana, paciente } = await searchParams;
  const hoy = hoyISOElSalvador();
  // Todo con fechas "YYYY-MM-DD": la semana no depende de la zona horaria del servidor.
  const lunes = lunesDeLaSemana(semana && esFechaISOValida(semana) ? semana : hoy);
  const dias = Array.from({ length: 7 }, (_, i) => sumarDiasISO(lunes, i));

  const [visitas, pacienteInicial] = await Promise.all([
    getVisitasEntre(dias[0], dias[6]),
    paciente && esIdValido(paciente) ? getPaciente(paciente) : Promise.resolve(undefined),
  ]);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-vera-verde">Agenda</h1>
          <p className="mt-1 text-sm text-muted-foreground">Semana del {fechaConMes(lunes, hoy)}</p>
        </div>
        <nav aria-label="Semanas" className="flex gap-2">
          <Link href={`/agenda?semana=${sumarDiasISO(lunes, -7)}`} className={BOTON} aria-label="Semana anterior">
            <ChevronLeft size={16} aria-hidden /> Anterior
          </Link>
          <Link href="/agenda" className={BOTON}>
            Hoy
          </Link>
          <Link href={`/agenda?semana=${sumarDiasISO(lunes, 7)}`} className={BOTON} aria-label="Semana siguiente">
            Siguiente <ChevronRight size={16} aria-hidden />
          </Link>
        </nav>
      </header>

      <AgendaSemana key={lunes} dias={dias} hoy={hoy} visitas={visitas} pacienteInicial={pacienteInicial ?? null} />
    </div>
  );
}
