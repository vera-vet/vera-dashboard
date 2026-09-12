"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { vaciarCarrito } from "../carrito";

function AccederContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Link inválido.");
      return;
    }
    fetch("/api/tienda/acceder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          vaciarCarrito();
          router.push("/tienda/catalogo");
        } else {
          setError(data.error || "No se pudo entrar. Pide un link nuevo.");
        }
      })
      .catch(() => setError("No se pudo entrar. Pide un link nuevo."));
  }, [searchParams, router]);

  if (error) {
    return <p className="rounded-2xl border border-border bg-card p-4 text-sm text-vera-coral">{error}</p>;
  }

  return <p className="text-sm text-muted-foreground">Entrando…</p>;
}

export default function AccederPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Entrando…</p>}>
      <AccederContent />
    </Suspense>
  );
}
