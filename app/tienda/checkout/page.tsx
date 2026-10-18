"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import type { TipoEntrega } from "@/lib/data/types";
import { ajustarCantidad, formatoDolares, totalPedido } from "@/lib/data/pedidos";
import { crearPedido } from "../actions-pedido";
import { guardarCarrito, leerCarrito, vaciarCarrito, type ItemCarrito } from "../carrito";

const CAMPO = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm";

export default function CheckoutPage() {
  const router = useRouter();
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>("retiro");
  const [direccion, setDireccion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    setCarrito(leerCarrito());
  }, []);

  const total = totalPedido(carrito.map((i) => ({ cantidad: i.cantidad, precioUnitario: i.precio })));

  function cambiar(productoId: string, cantidad: number) {
    const actualizado = ajustarCantidad(carrito, productoId, cantidad);
    setCarrito(actualizado);
    guardarCarrito(actualizado);
  }

  async function confirmar() {
    if (guardando || carrito.length === 0) return;
    if (tipoEntrega === "domicilio" && !direccion.trim()) {
      setMensaje("Escribe la dirección de entrega.");
      return;
    }
    setGuardando(true);
    setMensaje(null);
    try {
      const resultado = await crearPedido(
        carrito.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
        tipoEntrega, direccion,
      );
      if (resultado.ok && resultado.pedidoId) {
        vaciarCarrito();
        // A donde diga el proveedor de pago; el simulado es una pantalla de esta misma tienda.
        const destino = resultado.urlPago ? new URL(resultado.urlPago, window.location.origin) : null;
        if (destino && destino.pathname.startsWith("/tienda/pago-simulado/")) router.push(destino.pathname);
        else if (destino) window.location.href = destino.toString();
        else router.push(`/tienda/pago-simulado/${resultado.pedidoId}`);
        return;
      }
      setMensaje(resultado.error || "No se pudo crear el pedido.");
    } catch {
      setMensaje("No se pudo crear el pedido. Intenta de nuevo.");
    }
    setGuardando(false);
  }

  function vaciar() {
    vaciarCarrito();
    setCarrito([]);
  }

  if (carrito.length === 0) {
    return <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {carrito.map((item) => (
          <li key={item.productoId} className="flex items-center gap-3 px-5 py-3 text-sm">
            <span className="min-w-0 flex-1 truncate">{item.nombre}</span>
            <div className="flex items-center gap-1">
              <button
                type="button" onClick={() => cambiar(item.productoId, item.cantidad - 1)} aria-label={`Quitar uno de ${item.nombre}`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border"
              >
                <Minus size={14} aria-hidden />
              </button>
              <span className="w-6 text-center tabular-nums" aria-label={`Cantidad de ${item.nombre}`}>{item.cantidad}</span>
              <button
                type="button" onClick={() => cambiar(item.productoId, item.cantidad + 1)} aria-label={`Agregar uno de ${item.nombre}`}
                disabled={item.disponible !== undefined && item.cantidad >= item.disponible}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border disabled:opacity-40"
              >
                <Plus size={14} aria-hidden />
              </button>
            </div>
            <span className="w-16 text-right tabular-nums">{formatoDolares(item.precio * item.cantidad)}</span>
          </li>
        ))}
      </ul>
      <p className="text-right font-display text-lg font-bold">Total: {formatoDolares(total)}</p>

      <div>
        <label htmlFor="checkout-entrega" className="text-xs font-semibold text-muted-foreground">Entrega</label>
        <select
          id="checkout-entrega" value={tipoEntrega} onChange={(e) => setTipoEntrega(e.target.value as TipoEntrega)} className={CAMPO}
        >
          <option value="retiro">Retiro en la clínica</option>
          <option value="domicilio">Entrega a domicilio</option>
        </select>
      </div>

      {tipoEntrega === "domicilio" && (
        <div>
          <label htmlFor="checkout-direccion" className="text-xs font-semibold text-muted-foreground">Dirección de entrega</label>
          <input
            id="checkout-direccion" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} maxLength={300}
            autoComplete="street-address" className={CAMPO}
          />
        </div>
      )}

      {mensaje && <p role="alert" className="text-sm text-vera-coral-fuerte">{mensaje}</p>}

      <button
        type="button" onClick={confirmar} disabled={guardando}
        className="min-h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {guardando ? "Procesando…" : `Pagar ${formatoDolares(total)}`}
      </button>

      <button
        type="button" onClick={vaciar} disabled={guardando}
        className="min-h-11 w-full rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground disabled:opacity-60"
      >
        Vaciar carrito
      </button>
    </div>
  );
}
