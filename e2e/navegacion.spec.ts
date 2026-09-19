import { expect, test } from "@playwright/test";
import { FOTO_ROTA_E2E } from "./support/django";

const SECCIONES: [ruta: string, titulo: string | RegExp][] = [
  ["/", /^Buen(os días|as tardes|as noches), /],
  ["/agenda", "Agenda"],
  ["/pacientes", "Pacientes"],
  ["/pacientes/nuevo", "Nuevo paciente"],
  ["/vacunas", "A quién le toca"],
  ["/recordatorios", "Recordatorios"],
  ["/sala", "Sala"],
  ["/registrar", "Registrar visita"],
  ["/reportes", "Reportes"],
  ["/compartidos", "Pacientes compartidos conmigo"],
  ["/inventario", "Inventario"],
  ["/pedidos", "Pedidos"],
  ["/ajustes", "Ajustes"],
];

for (const [ruta, titulo] of SECCIONES) {
  test(`${ruta} carga con datos reales y sin errores`, async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    page.on("console", (m) => {
      // La foto rota a propósito de avatar.spec.ts (VER-38) da un 404 esperado.
      if (m.type() === "error" && !m.location().url.includes(FOTO_ROTA_E2E)) errores.push(m.text());
    });

    const respuesta = await page.goto(ruta);

    expect(respuesta?.status()).toBe(200);
    await expect(page).toHaveURL(ruta);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(titulo);
    expect(errores).toEqual([]);
  });
}
