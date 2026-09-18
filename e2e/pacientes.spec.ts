import { expect, test } from "@playwright/test";

test("la lista de pacientes viene de la API y abre el expediente", async ({ page }) => {
  await page.goto("/pacientes");
  await page.getByRole("link", { name: /Rocky/ }).first().click();

  await expect(page).toHaveURL(/\/pacientes\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rocky");
});

test("alta de paciente con dueño nuevo", async ({ page }) => {
  const sufijo = Date.now().toString().slice(-7);
  const whatsapp = `+5037${sufijo}`;
  const nombrePaciente = `E2E Firulais ${sufijo}`;

  await page.goto("/pacientes/nuevo");

  await page.getByPlaceholder("WhatsApp del dueño").fill(whatsapp);
  await page.getByRole("button", { name: "Buscar" }).click();
  const nombreDueno = page.getByPlaceholder("Nombre del dueño (no encontrado, se creará uno nuevo)");
  await expect(nombreDueno).toBeVisible();
  await nombreDueno.fill(`E2E Dueño ${sufijo}`);
  await page.getByRole("button", { name: "Continuar" }).click();

  // Esperar el paso 2: "Nombre" a secas también coincide con el campo del dueño del paso 1.
  await expect(page.getByRole("heading", { name: "Paciente", exact: true })).toBeVisible();
  await page.getByPlaceholder("Nombre", { exact: true }).fill(nombrePaciente);
  await page.getByPlaceholder("Raza", { exact: true }).fill("Mestizo");
  await page.locator('input[type="date"]').fill("2024-01-15");
  await page.getByRole("button", { name: "Crear paciente" }).click();

  await expect(page).toHaveURL(/\/pacientes\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(nombrePaciente);

  // Buscar el mismo número ahora encuentra al dueño recién creado.
  await page.goto("/pacientes/nuevo");
  await page.getByPlaceholder("WhatsApp del dueño").fill(whatsapp);
  await page.getByRole("button", { name: "Buscar" }).click();
  await expect(page.getByText(`Encontrado: E2E Dueño ${sufijo}`)).toBeVisible();
});
