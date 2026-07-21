import { MetricHero } from "@/components/shared/metric-hero";
import { ReportesCharts } from "./reportes-charts";

export default function ReportesPage() {
  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Reportes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cómo le está yendo a tu clínica con Vera.</p>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricHero label="Enviados este mes" value={84} />
        <MetricHero label="Tasa de respuesta" value="72%" />
        <MetricHero label="Citas recuperadas" value={23} />
        <MetricHero label="Ingresos recuperados" value="$487" />
      </section>

      <ReportesCharts />
    </div>
  );
}
