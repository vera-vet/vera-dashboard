import { getMisPedidos } from "@/lib/data/tienda";
import { formatoDolares, totalPedido } from "@/lib/data/pedidos";
import { formatFechaCorta, hoyISOElSalvador } from "@/lib/date";

const ESTADO_LABEL: Record<string, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  en_proceso: "En preparación",
  entregado: "Entregado",
  cancelado: "Cancelado",
  pago_sin_stock: "Pagado, sin stock: la clínica te contactará",
};

export default async function MisPedidosPage() {
  const pedidos = await getMisPedidos();

  if (pedidos.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tienes pedidos.</p>;
  }

  return (
    <ul className="space-y-3">
      {pedidos.map((pedido) => (
        <li key={pedido.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold">Pedido #{pedido.id}</span>
            <span className="text-xs text-muted-foreground">{ESTADO_LABEL[pedido.estado] ?? pedido.estado}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatFechaCorta(hoyISOElSalvador(new Date(pedido.creadoEn)))} ·{" "}
            {pedido.tipoEntrega === "domicilio" ? "Entrega a domicilio" : "Retiro en la clínica"}
          </p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {pedido.items.map((item) => (
              <li key={item.id}>{item.cantidad}x {item.productoNombre}</li>
            ))}
          </ul>
          <p className="mt-2 text-right text-sm font-semibold">{formatoDolares(totalPedido(pedido.items))}</p>
        </li>
      ))}
    </ul>
  );
}
