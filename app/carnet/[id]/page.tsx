import { notFound } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";
import { getPaciente, getDueno, getServiciosPorPaciente } from "@/lib/data/pacientes";
import { edadTexto, formatFechaCorta } from "@/lib/date";

export default async function CarnetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await getPaciente(id);
  if (!paciente) notFound();

  const dueno = await getDueno(paciente.duenoId);
  const vacunas = (await getServiciosPorPaciente(paciente.id)).filter((s) => s.tipo === "vacuna");

  return (
    <div className="min-h-screen bg-vera-sage py-10">
      <div className="mx-auto w-full max-w-[390px] rounded-[36px] border-8 border-vera-forest bg-card p-6 shadow-[var(--shadow-elevated)]">
        <div className="text-center">
          <img src={paciente.fotoUrl} alt={paciente.nombre} className="mx-auto h-28 w-28 rounded-full object-cover" />
          <h1 className="mt-4 font-display text-2xl font-bold">{paciente.nombre}</h1>
          <p className="text-sm text-muted-foreground">{paciente.raza} · {edadTexto(paciente.fechaNacimiento)}</p>
        </div>

        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold">Vacunas</h2>
          <ul className="mt-3 space-y-2">
            {vacunas.map((v) => (
              <li key={v.id} className="flex items-center justify-between rounded-2xl bg-vera-sage p-3">
                <div>
                  <div className="font-medium">{v.producto}</div>
                  <div className="text-xs text-vera-emerald">{formatFechaCorta(v.fecha)}</div>
                </div>
                <Check size={20} className="text-vera-emerald" />
              </li>
            ))}
          </ul>
        </section>

        <a
          href={`https://wa.me/${dueno?.whatsapp.replace(/\D/g, "")}`}
          className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-whatsapp text-lg font-semibold text-white"
        >
          <MessageCircle size={22} />
          Agendar por WhatsApp
        </a>

        <p className="mt-6 text-center text-xs text-muted-foreground">Carnet digital por Vera</p>
      </div>
    </div>
  );
}
