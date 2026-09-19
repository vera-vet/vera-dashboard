"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EstadoPedido, Pedido } from "@/lib/data/types";
import { cambiarEstadoPedido } from "./actions";

const SIGUIENTE_ESTADO: Partial<Record<EstadoPedido, { estado: EstadoPedido; label: string }>> = {
  pagado: { estado: "en_proceso", label: "Marcar en proceso" },
  en_proceso: { estado: "entregado", label: "Marcar entregado" },
};

const ESTADO_LABEL: Record<EstadoPedido, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  en_proceso: "En proceso",
  entregado: "Entregado",
  cancelado: "Cancelado",
  pago_sin_stock: "Pagado sin stock suficiente",
};

export function PedidoCard({ pedido }: { pedido: Pedido }) {
  const router = useRouter();
  const [actualizando, setActualizando] = useState(false);
  const siguiente = SIGUIENTE_ESTADO[pedido.estado];
  const puedeCancelar = pedido.estado !== "entregado" && pedido.estado !== "cancelado";

  async function avanzar(estado: EstadoPedido) {
    if (actualizando) return;
    setActualizando(true);
    const resultado = await cambiarEstadoPedido(pedido.id, estado);
    setActualizando(false);
    if (resultado.ok) router.refresh();
  }

  return (
    <li className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-bold">Pedido #{pedido.id} · {pedido.duenoNombre}</span>
        <span className="text-xs text-muted-foreground">{ESTADO_LABEL[pedido.estado]}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {pedido.tipoEntrega === "domicilio" ? `Entrega a domicilio: ${pedido.direccionEntrega}` : "Retiro en clínica"}
      </p>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {pedido.items.map((item) => <li key={item.id}>{item.cantidad}x {item.productoNombre}</li>)}
      </ul>
      <div className="mt-3 flex gap-2">
        {siguiente && (
          <button
            type="button" onClick={() => avanzar(siguiente.estado)} disabled={actualizando}
            className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            {siguiente.label}
          </button>
        )}
        {puedeCancelar && (
          <button
            type="button" onClick={() => avanzar("cancelado")} disabled={actualizando}
            className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/50 disabled:opacity-60"
          >
            Cancelar
          </button>
        )}
      </div>
    </li>
  );
}
