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
  await page.getByLabel("Nombre del producto").fill(nombre);
  await page.getByLabel("Precio").fill("4.75");
  await page.getByLabel("Cantidad en stock").fill("12");
  await page.getByRole("button", { name: "Crear producto" }).click();

  await expect(page.getByText(nombre)).toBeVisible();
});
