import { expect, test } from "@playwright/test";
import { setAdmin } from "./support/django";
import { SAN_RAFAEL } from "./support/users";

test.afterEach(() => setAdmin(SAN_RAFAEL.email, false));

test("solo un admin de clínica puede crear productos", async ({ page }) => {
  setAdmin(SAN_RAFAEL.email, false);
  await page.goto("/inventario");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inventario");
  await expect(page.getByRole("button", { name: "Nuevo producto" })).toHaveCount(0);

  setAdmin(SAN_RAFAEL.email, true);
  await page.reload();
  await page.getByRole("button", { name: "Nuevo producto" }).click();

  const nombre = `E2E Desparasitante ${Date.now()}`;
  await page.getByPlaceholder("Nombre", { exact: true }).fill(nombre);
  // Los <label> de precio/stock no están asociados a su input (sin htmlFor): se ubican por posición.
  await page.getByText("Precio", { exact: true }).locator("xpath=following-sibling::input").fill("4.75");
  await page.getByText("Cantidad en stock", { exact: true }).locator("xpath=following-sibling::input").fill("12");
  await page.getByRole("button", { name: "Crear producto" }).click();

  await expect(page.getByText(nombre)).toBeVisible();
});
