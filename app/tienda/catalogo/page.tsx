import { getCatalogoTienda } from "@/lib/data/tienda";
import { CatalogoClient } from "./catalogo-client";

export default async function CatalogoPage() {
  const productos = await getCatalogoTienda();
  return <CatalogoClient productos={productos} />;
}
