import type { Mensaje } from "@/lib/data/types";
import { cn } from "@/lib/utils";

// Vera a la izquierda en menta; el dueño a la derecha en blanco (desde VER-42, muted y menta
// suave son el mismo color y no se distinguían).
export function WhatsAppBubble({ mensaje }: { mensaje: Mensaje }) {
  const esDueno = mensaje.autor === "dueno";
  return (
    <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug", esDueno ? "ml-auto border border-border bg-card" : "bg-vera-menta-suave")}>
      <p>{mensaje.texto}</p>
      <span className="mt-1 block text-[11px] text-muted-foreground">{mensaje.hora}</span>
    </div>
  );
}
