"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TipoEntrega } from "@/lib/data/types";
import { crearPedido } from "../actions-pedido";
import { leerCarrito, vaciarCarrito, type ItemCarrito } from "../carrito";

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

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  async function confirmar() {
    if (guardando || carrito.length === 0) return;
    if (tipoEntrega === "domicilio" && !direccion.trim()) {
      setMensaje("Escribe la dirección de entrega.");
      return;
    }
    setGuardando(true);
    const resultado = await crearPedido(
      carrito.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
      tipoEntrega, direccion,
    );
    setGuardando(false);
    if (resultado.ok && resultado.pedidoId) {
      vaciarCarrito();
      router.push(`/tienda/pago-simulado/${resultado.pedidoId}`);
    } else {
      setMensaje(resultado.error || "No se pudo crear el pedido.");
    }
  }

  if (carrito.length === 0) {
    return <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {carrito.map((item) => (
          <li key={item.productoId} className="flex items-center justify-between px-5 py-3 text-sm">
            <span>{item.cantidad}x {item.nombre}</span>
            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="text-right font-display text-lg font-bold">Total: ${total.toFixed(2)}</p>

      <select
        value={tipoEntrega} onChange={(e) => setTipoEntrega(e.target.value as TipoEntrega)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="retiro">Retiro en clínica</option>
        <option value="domicilio">Entrega a domicilio</option>
      </select>

      {tipoEntrega === "domicilio" && (
        <input
          type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección de entrega" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      )}

      {mensaje && <p className="text-xs text-vera-coral">{mensaje}</p>}

      <button
        type="button" onClick={confirmar} disabled={guardando}
        className="w-full rounded-xl bg-vera-emerald px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {guardando ? "Procesando…" : "Pagar"}
      </button>
    </div>
  );
}
