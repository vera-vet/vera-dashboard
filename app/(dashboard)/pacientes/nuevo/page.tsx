import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NuevoPacienteForm } from "./nuevo-paciente-form";

export default function NuevoPacientePage() {
  return (
    <div>
      <Link href="/pacientes" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeft size={14} /> Pacientes
      </Link>
      <h1 className="mb-6 font-display text-3xl font-bold text-vera-forest">Nuevo paciente</h1>
      <NuevoPacienteForm />
    </div>
  );
}
