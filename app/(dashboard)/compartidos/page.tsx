import Link from "next/link";
import { Share2 } from "lucide-react";
import { getPacientesCompartidosConmigo } from "@/lib/data/comparticiones";

export default async function CompartidosPage() {
  const pacientes = await getPacientesCompartidosConmigo();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold text-vera-forest">Pacientes compartidos conmigo</h1>

      {pacientes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ninguna clínica te ha compartido un paciente todavía.</p>
      ) : (
        <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {pacientes.map((p) => (
            <li key={p.id}>
              <Link href={`/compartidos/${p.id}`} className="flex items-center gap-3 p-4 hover:bg-secondary/50">
                <Share2 size={16} className="text-vera-emerald" />
                <div>
                  <div className="font-semibold">{p.nombre}</div>
                  <div className="text-xs text-muted-foreground">{p.raza}</div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
