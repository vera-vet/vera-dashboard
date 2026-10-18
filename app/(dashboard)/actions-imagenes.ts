"use server";

import { apiFetch } from "@/lib/api/client";

/** Sube una foto a Vera; devuelve la ruta "/imagenes/<uuid>" para guardarla en la ficha. */
export async function subirImagen(formData: FormData): Promise<{ ok: boolean; url?: string; mensaje?: string }> {
  try {
    const response = await apiFetch("/api/imagenes/", { method: "POST", body: formData });
    const data = (await response.json().catch(() => ({}))) as { url?: string; detail?: string };
    if (response.ok && data.url) return { ok: true, url: data.url };
    return { ok: false, mensaje: data.detail ?? "No se pudo subir la foto. Intenta de nuevo." };
  } catch {
    return { ok: false, mensaje: "No se pudo subir la foto. Intenta de nuevo." };
  }
}
