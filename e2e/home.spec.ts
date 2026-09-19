import { expect, test } from "@playwright/test";
import { loginOk } from "./support/login";
import { conversacionDePrueba } from "./support/django";
import { LOS_ALAMOS, SAN_RAFAEL } from "./support/users";

test.use({ storageState: { cookies: [], origins: [] } });

// Regresión de VER-40: la home tenía hardcodeado "Buenos días, Dra. Ramírez" para todos.
test("la home saluda al usuario que inició sesión", async ({ page }) => {
  await loginOk(page, LOS_ALAMOS.email);
  const saludo = page.getByRole("heading", { level: 1 });
  await expect(saludo).toContainText(LOS_ALAMOS.nombre);
  await expect(saludo).toHaveText(/^Buen(os días|as tardes|as noches), /);
  await expect(saludo).not.toContainText("Ramírez");
  // El sidebar muestra la clínica del usuario (antes decía "Vet. San Rafael" para todas).
  await expect(page.getByRole("complementary", { name: "Menú principal" })).toContainText("Clínica Los Álamos");
});

test("al abrir una conversación se ven sus mensajes", async ({ page }) => {
  // La lista de la API no trae mensajes: antes el panel de la conversación quedaba vacío.
  const texto = conversacionDePrueba("Nala");
  await loginOk(page, SAN_RAFAEL.email);

  await page.goto("/recordatorios");
  await page.getByRole("button", { name: /— Nala/ }).click();
  await expect(page.getByRole("paragraph").filter({ hasText: texto })).toBeVisible();
});
