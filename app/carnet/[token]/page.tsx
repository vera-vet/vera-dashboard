import { notFound } from "next/navigation";
import { Check, MessageCircle, Syringe } from "lucide-react";
import { edadTexto, formatFechaCorta, hoyISOElSalvador } from "@/lib/date";
import { AvatarPaciente } from "@/components/shared/avatar-paciente";

interface CarnetData {
  nombre: string;
  foto_url: string;
  raza: string;
  fecha_nacimiento: string;
  vacunas: { producto: string; fecha: string }[];
  proxima_vacuna?: { fecha: string; producto: string | null } | null;
  clinica_nombre?: string;
  clinica_whatsapp?: string;
}

async function getCarnet(token: string): Promise<CarnetData | undefined> {
  const response = await fetch(`${process.env.DJANGO_API_URL}/api/carnet/${token}/`, { cache: "no-store" });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`No se pudo cargar el carnet (${response.status})`);
  return response.json();
}

/** wa.me con el mensaje listo: el dueño solo tiene que enviarlo. */
function linkWhatsApp(numero: string, mascota: string): string {
  const texto = `Hola, quiero agendar una cita para ${mascota}.`;
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`;
}

export default async function CarnetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const carnet = await getCarnet(token);
  if (!carnet) notFound();

  const hoy = hoyISOElSalvador();
  const proxima = carnet.proxima_vacuna;
  const vencida = proxima ? proxima.fecha < hoy : false;

  return (
    <div className="min-h-screen bg-vera-menta-suave py-10">
      <div className="mx-auto w-full max-w-[390px] rounded-[36px] border-8 border-vera-verde bg-card p-6 shadow-[var(--shadow-elevated)]">
        <div className="text-center">
          {carnet.clinica_nombre && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-vera-coral-fuerte">{carnet.clinica_nombre}</p>
          )}
          <AvatarPaciente nombre={carnet.nombre} fotoUrl={carnet.foto_url} tamano={112} className="mx-auto" />
          <h1 className="mt-4 font-display text-2xl font-bold">{carnet.nombre}</h1>
          <p className="text-sm text-muted-foreground">{carnet.raza} · {edadTexto(carnet.fecha_nacimiento)}</p>
        </div>

        {proxima && (
          <section
            className={
              vencida
                ? "mt-6 rounded-2xl border border-vera-coral bg-vera-coral-soft p-4"
                : "mt-6 rounded-2xl border border-vera-apoyo bg-vera-menta-suave p-4"
            }
          >
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <Syringe size={14} aria-hidden /> {vencida ? "Vacuna pendiente" : "Próxima vacuna"}
            </h2>
            <p className="mt-1 font-display text-lg font-bold">{proxima.producto ?? "Refuerzo"}</p>
            <p className={vencida ? "text-sm font-semibold text-vera-coral-fuerte" : "text-sm text-vera-apoyo"}>
              {vencida ? `Le tocaba el ${formatFechaCorta(proxima.fecha)}` : formatFechaCorta(proxima.fecha)}
            </p>
          </section>
        )}

        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold">Vacunas</h2>
          {carnet.vacunas.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Todavía no hay vacunas registradas.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {carnet.vacunas.map((v, i) => (
                <li key={i} className="flex items-center justify-between rounded-2xl bg-vera-menta-suave p-3">
                  <div>
                    <div className="font-medium">{v.producto}</div>
                    <div className="text-xs text-vera-apoyo">{formatFechaCorta(v.fecha)}</div>
                  </div>
                  <Check size={20} className="text-vera-apoyo" aria-label="Aplicada" />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Antes este botón abría un chat del dueño consigo mismo: ahora es el WhatsApp de la clínica. */}
        {carnet.clinica_whatsapp && (
          <a
            href={linkWhatsApp(carnet.clinica_whatsapp, carnet.nombre)}
            className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-whatsapp text-lg font-semibold text-whatsapp-foreground"
          >
            <MessageCircle size={22} aria-hidden />
            Agendar por WhatsApp
          </a>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">Carnet digital por Vera</p>
      </div>
    </div>
  );
}
