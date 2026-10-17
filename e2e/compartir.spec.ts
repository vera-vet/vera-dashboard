import { expect, test } from "@playwright/test";
import { pacienteIdPorNombre, revocarComparticiones } from "./support/django";
import { loginOk } from "./support/login";
import { LOS_ALAMOS } from "./support/users";

test("compartir un paciente: nunca con la propia clínica, una sola vez y revocable", async ({ page, browser }) => {
  revocarComparticiones("San Rafael", "Rocky", "Los Álamos");
  const rockyId = pacienteIdPorNombre("San Rafael", "Rocky");
  const buscador = page.getByLabel("Buscar clínica por nombre");

  await page.goto(`/pacientes/${rockyId}`);

  // La propia clínica nunca se ofrece.
  await buscador.fill("San Rafael");
  await expect(page.getByText("No hay otra clínica con ese nombre para compartir.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Compartir con Veterinaria San Rafael/ })).toHaveCount(0);

  await buscador.fill("Álamos");
  await page.getByRole("button", { name: "Compartir con Clínica Los Álamos" }).click();
  await expect(page.getByRole("button", { name: "Revocar acceso de Clínica Los Álamos" })).toBeVisible();

  // Ya compartido: deja de ofrecerse.
  await buscador.fill("Álamos");
  await expect(page.getByText("No hay otra clínica con ese nombre para compartir.")).toBeVisible();

  const contextoAlamos = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const alamos = await contextoAlamos.newPage();
  await loginOk(alamos, LOS_ALAMOS.email);
  await alamos.goto("/compartidos");
  await expect(alamos.getByRole("link", { name: /Rocky/ })).toBeVisible();

  await page.getByRole("button", { name: "Revocar acceso de Clínica Los Álamos" }).click();
  await expect(page.getByRole("button", { name: "Revocar acceso de Clínica Los Álamos" })).toHaveCount(0);

  await alamos.goto("/compartidos");
  await expect(alamos.getByRole("link", { name: /Rocky/ })).toHaveCount(0);
  await contextoAlamos.close();
});
