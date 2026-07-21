"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ENVIADOS = [
  { semana: "Sem 1", enviados: 18, respondidos: 12 },
  { semana: "Sem 2", enviados: 22, respondidos: 16 },
  { semana: "Sem 3", enviados: 19, respondidos: 14 },
  { semana: "Sem 4", enviados: 25, respondidos: 20 },
];

const INGRESOS = [
  { mes: "Abr", monto: 320 },
  { mes: "May", monto: 410 },
  { mes: "Jun", monto: 398 },
  { mes: "Jul", monto: 487 },
];

export function ReportesCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-sm font-bold">Recordatorios: enviados vs. respondidos</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ENVIADOS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="semana" stroke="var(--vera-ink-soft)" fontSize={12} />
              <YAxis stroke="var(--vera-ink-soft)" fontSize={12} />
              <Tooltip />
              <Bar dataKey="enviados" fill="var(--vera-slate-info)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="respondidos" fill="var(--vera-emerald)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-sm font-bold">Ingresos recuperados por mes ($)</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={INGRESOS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--vera-ink-soft)" fontSize={12} />
              <YAxis stroke="var(--vera-ink-soft)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="monto" stroke="var(--vera-emerald)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
