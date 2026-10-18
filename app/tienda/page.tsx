import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SolicitarAccesoForm } from "./solicitar-acceso-form";

export default async function TiendaPage({ searchParams }: { searchParams: Promise<{ vencida?: string }> }) {
  if ((await cookies()).get("dueno_token")) {
    redirect("/tienda/catalogo");
  }
  const { vencida } = await searchParams;
  return <SolicitarAccesoForm sesionVencida={vencida === "1"} />;
}
