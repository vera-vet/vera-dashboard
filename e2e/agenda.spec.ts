import { expect, test, type Locator } from "@playwright/test";
import { hoyISOElSalvador, sumarDiasISO } from "../lib/date";
import { citaConMotivo } from "./support/django";

/** Abre las acciones de la tarjeta si están cerradas (quedan abiertas tras confirmar o mover). */
async function abrir(tarjeta: Locator) {
  if (!(await tarjeta.getByRole("link", { name: "Ver expediente" }).isVisible())) {
    await tarjeta.getByRole("button").first().click();
  }
}

// La agenda era de solo lectura. Ahora se agenda, confirma, mueve y cancela, y cada cita
// lleva su recordatorio del día anterior.
test("agendar, confirmar, mover y cancelar una cita", async ({ page }) => {
  const motivo = `Control E2E ${Date.now()}`;
  const manana = sumarDiasISO(hoyISOElSalvador(), 1);

  await page.goto(`/agenda?semana=${manana}`);
  await page.getByRole("button", { name: "Nueva cita", exact: true }).click();
  await page.getByLabel("¿Para quién es la cita?").fill("Rocky");
  await page.getByRole("list", { name: "Resultados de la búsqueda" }).getByRole("button", { name: /Rocky/ }).first().click();
  await page.getByLabel("Fecha").fill(manana);
  await page.getByLabel("Hora (opcional)").fill("16:00");
  await page.getByLabel("Motivo").fill(motivo);
  await page.getByRole("button", { name: "Agendar cita" }).click();

  const tarjeta = page.getByRole("listitem").filter({ hasText: motivo });
  await expect(tarjeta).toContainText("4:00 p. m.");
  expect(citaConMotivo(motivo)).toEqual({
    confirmada: false,
    recordatorio: expect.stringContaining("a las 4:00 p. m. (" + motivo + "). ¿Me confirmas que vienen?"),
  });

  await abrir(tarjeta);
  await tarjeta.getByRole("button", { name: "Confirmar" }).click();
  await expect(tarjeta.getByLabel("Confirmada")).toBeVisible();
  expect(citaConMotivo(motivo)?.recordatorio).toContain("Los esperamos.");

  await abrir(tarjeta);
  await tarjeta.getByRole("button", { name: "Mover" }).click();
  await page.getByLabel("Hora (opcional)").fill("10:30");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("listitem").filter({ hasText: motivo })).toContainText("10:30 a. m.");
  expect(citaConMotivo(motivo)?.recordatorio).toContain("a las 10:30 a. m.");

  page.once("dialog", (dialog) => dialog.accept());
  const movida = page.getByRole("listitem").filter({ hasText: motivo });
  await abrir(movida);
  await movida.getByRole("button", { name: "Cancelar cita" }).click();
  await expect(page.getByRole("listitem").filter({ hasText: motivo })).toHaveCount(0);
  expect(citaConMotivo(motivo)).toBeNull();
});

test("no se puede agendar en el pasado", async ({ page }) => {
  await page.goto("/agenda");
  await page.getByRole("button", { name: "Nueva cita", exact: true }).click();
  await expect(page.getByLabel("Fecha")).toHaveAttribute("min", hoyISOElSalvador());
});
