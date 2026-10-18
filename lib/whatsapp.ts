/**
 * Enlace para abrir un chat de WhatsApp con el mensaje escrito. Los números se guardan en E.164
 * ("+50371234567"); wa.me los quiere solo con dígitos. Sin número válido, no hay enlace.
 */
export function linkWhatsApp(numero: string, texto?: string): string | null {
  const digitos = (numero ?? "").replace(/\D/g, "");
  if (digitos.length < 8) return null;
  return `https://wa.me/${digitos}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}

export function primerNombre(nombreCompleto: string): string {
  return (nombreCompleto ?? "").trim().split(/\s+/)[0] ?? "";
}
