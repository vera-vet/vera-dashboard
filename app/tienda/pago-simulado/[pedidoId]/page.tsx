"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmarPagoSimulado } from "../../actions-pedido";

export default function PagoSimuladoPage({ params }: { params: Promise<{ pedidoId: string }> }) {
  const { pedidoId } = use(params);
  const router = useRouter();
  const [procesando, setProcesando] = useState(false);
  const [estado, setEstado] = useState<string | null>(null);

  async function pagar() {
    if (procesando) return;
    setProcesando(true);
    const resultado = await confirmarPagoSimulado(pedidoId);
    setProcesando(false);
    if (resultado.ok && resultado.estado) {
      setEstado(resultado.estado);
    }
  }

  if (estado === "pagado") {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-vera-emerald">¡Pago confirmado! Tu pedido #{pedidoId} está en proceso.</p>
        <button
          type="button" onClick={() => router.push("/tienda/pedidos")}
          className="w-full rounded-xl bg-vera-emerald px-4 py-2 text-sm font-semibold text-white"
        >
          Ver mis pedidos
        </button>
      </div>
    );
  }

  if (estado === "pago_sin_stock") {
    return <p className="text-sm text-vera-coral">Se cobró el pedido, pero ya no había stock suficiente. La clínica te contactará.</p>;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">Pantalla de pago simulado (desarrollo) -- pedido #{pedidoId}.</p>
      <button
        type="button" onClick={pagar} disabled={procesando}
        className="w-full rounded-xl bg-vera-emerald px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {procesando ? "Procesando…" : "Simular pago exitoso"}
      </button>
    </div>
  );
}
