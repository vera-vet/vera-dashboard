import { expect, test } from "@playwright/test";
import { loginOk } from "./support/login";
import { LOS_ALAMOS } from "./support/users";

test.use({ storageState: { cookies: [], origins: [] } });

test("la home saluda al usuario que inició sesión", async ({ page }) => {
  // Bug de auditoría: app/(dashboard)/page.tsx tiene hardcodeado "Buenos días, Dra. Ramírez"
  // (resto del prototipo de Fase 1): todo usuario de toda clínica ve ese nombre a cualquier hora.
  // Cuando se corrija, este test pasará y Playwright lo marcará como fallo: quitar test.fail().
  test.fail();
  await loginOk(page, LOS_ALAMOS.email);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(LOS_ALAMOS.nombre, { timeout: 5_000 });
});
