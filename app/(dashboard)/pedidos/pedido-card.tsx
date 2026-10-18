"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import type { EstadoPedido, Pedido } from "@/lib/data/types";
import { formatoDolares, totalPedido } from "@/lib/data/pedidos";
import { formatFechaHoraCorta } from "@/lib/date";
import { linkWhatsApp, primerNombre } from "@/lib/whatsapp";
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

export function PedidoCard({ pedido, clinicaNombre }: { pedido: Pedido; clinicaNombre: string }) {
  const router = useRouter();
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siguiente = SIGUIENTE_ESTADO[pedido.estado];
  const puedeCancelar = pedido.estado !== "entregado" && pedido.estado !== "cancelado";
  const escribir = linkWhatsApp(
    pedido.duenoWhatsapp,
    `Hola, ${primerNombre(pedido.duenoNombre)}. Te escribimos de ${clinicaNombre} sobre tu pedido #${pedido.id}.`,
  );

  async function avanzar(estado: EstadoPedido) {
    if (actualizando) return;
    if (estado === "cancelado") {
      const devuelve = pedido.estado === "pagado" || pedido.estado === "en_proceso";
      const aviso = devuelve ? " Lo que se descontó del inventario vuelve al stock; el reembolso se hace aparte." : "";
      if (!window.confirm(`¿Cancelar el pedido #${pedido.id}?${aviso}`)) return;
    }
    setActualizando(true);
    setError(null);
    try {
      const resultado = await cambiarEstadoPedido(pedido.id, estado);
      if (resultado.ok) router.refresh();
      else setError("No se pudo cambiar el estado. Recarga la página e intenta de nuevo.");
    } catch {
      setError("No se pudo cambiar el estado. Intenta de nuevo.");
    } finally {
      setActualizando(false);
    }
  }

  return (
    <li className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-sm font-bold">Pedido #{pedido.id} · {pedido.duenoNombre}</span>
        <span className="shrink-0 text-xs text-muted-foreground">{ESTADO_LABEL[pedido.estado]}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatFechaHoraCorta(pedido.creadoEn)} ·{" "}
        {pedido.tipoEntrega === "domicilio" ? `Entrega a domicilio: ${pedido.direccionEntrega}` : "Retiro en clínica"}
      </p>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {pedido.items.map((item) => (
          <li key={item.id}>{item.cantidad}x {item.productoNombre} · {formatoDolares(item.precioUnitario * item.cantidad)}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm font-semibold">Total: {formatoDolares(totalPedido(pedido.items))}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {siguiente && (
          <button
            type="button" onClick={() => avanzar(siguiente.estado)} disabled={actualizando}
            className="min-h-10 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            {siguiente.label}
          </button>
        )}
        {escribir && (
          <a
            href={escribir} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-whatsapp px-3 text-xs font-semibold text-whatsapp-foreground"
          >
            <MessageCircle size={13} aria-hidden /> Escribir a {primerNombre(pedido.duenoNombre)}
          </a>
        )}
        {puedeCancelar && (
          <button
            type="button" onClick={() => avanzar("cancelado")} disabled={actualizando}
            className="min-h-10 rounded-xl border border-border px-3 text-xs font-semibold hover:bg-secondary/50 disabled:opacity-60"
          >
            Cancelar
          </button>
        )}
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-vera-coral-fuerte">{error}</p>}
    </li>
  );
}
