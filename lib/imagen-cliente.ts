"use client";

/** Lado máximo con el que se sube una foto: la API la deja en 1600 px de todos modos. */
const LADO_MAXIMO = 1600;

/**
 * Reduce una foto en el navegador antes de subirla: una foto de celular pesa varios MB y por datos
 * móviles tardaría. Si el navegador no puede (formato raro), se sube el archivo original y la API
 * decide.
 */
export async function reducirImagen(archivo: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" });
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    const contexto = canvas.getContext("2d");
    if (!contexto) return archivo;
    contexto.fillStyle = "#ffffff"; // la transparencia queda sobre blanco, igual que en la API
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolver) => canvas.toBlob(resolver, "image/jpeg", 0.85));
    return blob ?? archivo;
  } catch {
    return archivo;
  }
}
