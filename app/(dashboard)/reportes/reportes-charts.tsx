"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ResumenReportes } from "@/lib/data/types";

export function ReportesCharts({ semanas }: { semanas: ResumenReportes["semanas"] }) {
  const sinDatos = semanas.every((s) => s.enviados === 0 && s.respondidos === 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-sm font-bold">Recordatorios por semana: enviados vs. respondidos</h3>
      {sinDatos ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Todavía no hay recordatorios enviados en las últimas 4 semanas.
        </p>
      ) : (
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="etiqueta" stroke="var(--vera-ink-soft)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="var(--vera-ink-soft)" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="enviados" name="Enviados" fill="var(--vera-slate-info)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="respondidos" name="Respondidos" fill="var(--vera-emerald)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
