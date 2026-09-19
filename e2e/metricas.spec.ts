import { expect, test } from "@playwright/test";
import { enviadosDelMes } from "./support/django";
import { loginOk } from "./support/login";
import { LOS_ALAMOS, SAN_RAFAEL } from "./support/users";

test.use({ storageState: { cookies: [], origins: [] } });

// VER-34: las métricas salen de los datos de cada clínica, no de constantes en el código.
test("cada clínica ve sus propias métricas en Reportes", async ({ page }) => {
  const sanRafael = enviadosDelMes(SAN_RAFAEL.clinica, true);
  const losAlamos = enviadosDelMes(LOS_ALAMOS.clinica);
  expect(sanRafael).not.toBe(losAlamos);

  await loginOk(page, SAN_RAFAEL.email);
  await page.goto("/reportes");
  await expect(page.getByRole("group", { name: "Enviados este mes" })).toContainText(String(sanRafael));

  await page.context().clearCookies();
  await loginOk(page, LOS_ALAMOS.email);
  await page.goto("/reportes");
  await expect(page.getByRole("group", { name: "Enviados este mes" })).toContainText(String(losAlamos));
});

test("el Inicio ya no muestra cifras inventadas", async ({ page }) => {
  await loginOk(page, LOS_ALAMOS.email);
  await expect(page.getByRole("group", { name: "Recordatorios enviados" })).toBeVisible();
  for (const inventada of ["Clientes recuperados", "Ingresos recuperados", "$487"]) {
    await expect(page.getByText(inventada)).toHaveCount(0);
  }
});
