import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SolicitarAccesoForm } from "./solicitar-acceso-form";

export default async function TiendaPage() {
  if ((await cookies()).get("dueno_token")) {
    redirect("/tienda/catalogo");
  }
  return <SolicitarAccesoForm />;
}
