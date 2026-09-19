interface MetricHeroProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function MetricHero({ label, value, hint }: MetricHeroProps) {
  return (
    <div role="group" aria-label={label} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold tabular-nums tracking-tight text-vera-forest lg:text-6xl">
          {value}
        </span>
        {hint && <span className="text-sm text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
