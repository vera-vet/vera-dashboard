// Usuarios dedicados a E2E, creados (o reseteados) por global-setup con una contraseña aleatoria
// en cada corrida: no hay credenciales en este repo público y no se tocan los usuarios del seed.
export const SAN_RAFAEL = { email: "e2e@sanrafael.test", clinica: "San Rafael", nombre: "E2E San Rafael" };
export const LOS_ALAMOS = { email: "e2e@losalamos.test", clinica: "Los Álamos", nombre: "E2E Los Álamos" };
export const USUARIOS_E2E = [SAN_RAFAEL, LOS_ALAMOS];

export function password(): string {
  const valor = process.env.E2E_PASSWORD;
  if (!valor) throw new Error("E2E_PASSWORD no está definida: la genera e2e/support/global-setup.ts.");
  return valor;
}
