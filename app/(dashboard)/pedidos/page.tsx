import { getPedidos } from "@/lib/data/tienda";
import { getMe } from "@/lib/data/usuario";
import { PedidoCard } from "./pedido-card";

export default async function PedidosPage() {
  const [pedidos, usuario] = await Promise.all([getPedidos(), getMe()]);
  const porAtender = pedidos.filter((p) => p.estado === "pagado" || p.estado === "en_proceso" || p.estado === "pago_sin_stock").length;

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-verde">Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pedidos.length} pedidos{porAtender > 0 ? ` · ${porAtender} por atender` : ""}
        </p>
      </header>

      {pedidos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Todavía no hay pedidos. Llegan cuando un dueño compra en la tienda de la clínica.
        </div>
      ) : (
        <ul className="space-y-3">
          {pedidos.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} clinicaNombre={usuario.clinicaNombre} />)}
        </ul>
      )}
    </div>
  );
}
