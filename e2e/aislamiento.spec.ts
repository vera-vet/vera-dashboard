import { expect, test } from "@playwright/test";
import { pacienteIdPorNombre } from "./support/django";
import { loginOk } from "./support/login";
import { LOS_ALAMOS } from "./support/users";

test.use({ storageState: { cookies: [], origins: [] } });

test("una clínica no puede ver pacientes de otra", async ({ page }) => {
  const rockyId = pacienteIdPorNombre("San Rafael", "Rocky");

  await loginOk(page, LOS_ALAMOS.email);

  await page.goto("/pacientes");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pacientes");
  await expect(page.getByRole("link", { name: /Firulais/ })).toBeVisible(); // paciente propio de Los Álamos
  await expect(page.getByText("Rocky")).toHaveCount(0);

  await page.goto(`/pacientes/${rockyId}`);
  await expect(page.getByText("Paciente no encontrado")).toBeVisible();

  const pdf = await page.request.get(`/api/pacientes/${rockyId}/expediente-pdf`);
  expect(pdf.status()).toBe(404);
});
