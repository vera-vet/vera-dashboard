import { MetricHero } from "@/components/shared/metric-hero";
import { formatTasa, getResumenReportes } from "@/lib/data/reportes";
import { ReportesCharts } from "./reportes-charts";

export default async function ReportesPage() {
  const resumen = await getResumenReportes();

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Reportes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cómo le está yendo a tu clínica con Vera.</p>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricHero label="Enviados este mes" value={resumen.mes.recordatoriosEnviados} />
        <MetricHero label="Respuestas este mes" value={resumen.mes.conversacionesRespondidas} />
        <MetricHero label="Tasa de respuesta" value={formatTasa(resumen.mes.tasaRespuesta)} />
      </section>

      {/* Citas e ingresos recuperados vuelven cuando exista la atribución cita ↔ recordatorio (VER-34). */}
      <ReportesCharts semanas={resumen.semanas} />
    </div>
  );
}
