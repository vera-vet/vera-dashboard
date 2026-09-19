import { getPedidos } from "@/lib/data/tienda";
import { PedidoCard } from "./pedido-card";

export default async function PedidosPage() {
  const pedidos = await getPedidos();

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">{pedidos.length} pedidos</p>
      </header>

      {pedidos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Todavía no hay pedidos.
        </div>
      ) : (
        <ul className="space-y-3">
          {pedidos.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)}
        </ul>
      )}
    </div>
  );
}
