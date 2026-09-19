import { expect, test } from "@playwright/test";
import { loginOk } from "./support/login";
import { LOS_ALAMOS } from "./support/users";

test.use({ storageState: { cookies: [], origins: [] } });

// Regresión de VER-40: la home tenía hardcodeado "Buenos días, Dra. Ramírez" para todos.
test("la home saluda al usuario que inició sesión", async ({ page }) => {
  await loginOk(page, LOS_ALAMOS.email);
  const saludo = page.getByRole("heading", { level: 1 });
  await expect(saludo).toContainText(LOS_ALAMOS.nombre);
  await expect(saludo).toHaveText(/^Buen(os días|as tardes|as noches), /);
  await expect(saludo).not.toContainText("Ramírez");
});
