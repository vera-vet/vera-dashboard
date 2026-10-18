// Funciones puras de pedidos y carrito: sin imports de servidor, para usarlas en componentes cliente.

export function formatoDolares(monto: number): string {
  return `$${monto.toFixed(2)}`;
}

export function totalPedido(items: { cantidad: number; precioUnitario: number }[]): number {
  return Math.round(items.reduce((suma, i) => suma + i.cantidad * i.precioUnitario, 0) * 100) / 100;
}

export interface LineaCarrito {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  /** Lo que había en inventario al agregarlo: no se deja pedir más que eso. */
  disponible?: number;
}

/** Pone la cantidad de un producto del carrito; 0 o menos lo quita, y nunca pasa de lo disponible. */
export function ajustarCantidad(carrito: LineaCarrito[], productoId: string, cantidad: number): LineaCarrito[] {
  if (cantidad <= 0) return carrito.filter((l) => l.productoId !== productoId);
  return carrito.map((l) =>
    l.productoId === productoId ? { ...l, cantidad: l.disponible !== undefined ? Math.min(cantidad, l.disponible) : cantidad } : l,
  );
}
