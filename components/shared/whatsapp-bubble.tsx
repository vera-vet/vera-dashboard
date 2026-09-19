import type { Mensaje } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function WhatsAppBubble({ mensaje }: { mensaje: Mensaje }) {
  const esDueno = mensaje.autor === "dueno";
  return (
    <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug", esDueno ? "ml-auto bg-vera-menta-suave" : "bg-muted")}>
      <p>{mensaje.texto}</p>
      <span className="mt-1 block text-[11px] text-muted-foreground">{mensaje.hora}</span>
    </div>
  );
}
