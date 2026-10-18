/**
 * Los ids de la API son enteros positivos. Una Server Action se puede llamar con cualquier
 * argumento, así que se valida antes de armar una URL con él ("5/compartir" llegaría a otro
 * endpoint).
 */
export function esIdValido(id: unknown): id is string {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}
