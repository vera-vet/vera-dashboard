import { getProductos } from "@/lib/data/productos";
import { getMe } from "@/lib/data/usuario";
import { ProductoCard } from "./producto-card";
import { NuevoProductoSection } from "./nuevo-producto-section";

export default async function InventarioPage() {
  const [productos, usuario] = await Promise.all([getProductos(), getMe()]);

  return (
    <div>
      <header className="flex items-center justify-between pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-vera-verde">Inventario</h1>
          <p className="mt-1 text-sm text-muted-foreground">{productos.length} productos</p>
        </div>
        {usuario.esAdmin && <NuevoProductoSection />}
      </header>

      {productos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Todavía no hay productos en el inventario.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} esAdmin={usuario.esAdmin} />
          ))}
        </ul>
      )}
    </div>
  );
}
