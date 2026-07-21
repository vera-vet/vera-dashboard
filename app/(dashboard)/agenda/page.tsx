import { getVisitasProximas } from "@/lib/data/visitas";
import { getPaciente, getDueno } from "@/lib/data/pacientes";
import { hoyISO } from "@/lib/date";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function inicioSemana(iso: string): Date {
  const d = new Date(`${iso}T12:00:00`);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return d;
}

export default async function AgendaPage() {
  const visitas = await getVisitasProximas();
  const hoy = hoyISO();
  const inicio = inicioSemana(hoy);
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const porFecha = new Map<string, typeof visitas>();
  for (const v of visitas) {
    porFecha.set(v.fecha, [...(porFecha.get(v.fecha) ?? []), v]);
  }

  const visitasConDatos = await Promise.all(
    dias.map(async (fecha) => ({
      fecha,
      citas: await Promise.all(
        (porFecha.get(fecha) ?? []).map(async (v) => {
          const paciente = await getPaciente(v.pacienteId);
          return {
            visita: v,
            paciente,
            dueno: await getDueno(paciente?.duenoId ?? ""),
          };
        }),
      ),
    })),
  );

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Agenda</h1>
        <p className="mt-1 text-sm text-muted-foreground">Semana del {new Date(`${dias[0]}T12:00:00`).toLocaleDateString("es-SV", { day: "numeric", month: "long" })}</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-7">
        {visitasConDatos.map(({ fecha, citas }, i) => (
          <div key={fecha} className="rounded-2xl border border-border bg-card p-3">
            <div className="mb-2 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{DIAS[i]}</div>
              <div className={fecha === hoy ? "font-display text-lg font-bold text-vera-emerald" : "font-display text-lg font-bold"}>
                {new Date(`${fecha}T12:00:00`).getDate()}
              </div>
            </div>
            <ul className="space-y-2">
              {citas.map(({ visita, paciente, dueno }) => (
                <li
                  key={visita.id}
                  className={
                    visita.confirmada
                      ? "rounded-xl bg-vera-sage p-2 text-xs"
                      : "rounded-xl border border-dashed border-border p-2 text-xs"
                  }
                >
                  <div className="font-semibold">{visita.hora}</div>
                  <div className="truncate">{paciente?.nombre} · {dueno?.nombre}</div>
                </li>
              ))}
              {citas.length === 0 && <li className="py-4 text-center text-[11px] text-muted-foreground">—</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
