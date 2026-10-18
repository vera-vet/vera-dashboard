import { expect, test } from "@playwright/test";
import { visitasConNota } from "./support/django";

// Registrar cierra el ciclo: la visita, su nota y el próximo recordatorio con el plazo elegido.
test("registrar una vacuna con nota y recordatorio a un año", async ({ page }) => {
  const nota = `Sin reacción local. E2E ${Date.now()}`;

  await page.goto("/registrar");
  await page.getByLabel("¿A quién atendiste?").fill("Rocky");
  await page.getByRole("list", { name: "Resultados de la búsqueda" }).getByRole("button", { name: /Rocky/ }).first().click();

  await page.getByRole("button", { name: "Vacuna", exact: true }).click();
  await page.getByRole("button", { name: "Rabia", exact: true }).click();
  // La rabia es anual: el plazo propuesto ya no es la regla fija de 21 días.
  await expect(page.getByLabel("Próximo recordatorio")).toHaveValue("365");
  await page.getByLabel("Nota clínica (opcional)").fill(nota);

  const registrar = page.getByRole("button", { name: "Registrar visita" });
  await registrar.dblclick();
  await expect(page.getByRole("status")).toContainText("Rocky · Rabia.");
  expect(visitasConNota(nota)).toBe(1); // un doble clic no registra dos veces

  await page.goto("/pacientes");
  await page.getByRole("link", { name: /Rocky/ }).first().click();
  const visitas = page.getByRole("button", { name: /^Rabia/ });
  await expect(visitas.first()).toBeVisible();
  const conNota = page.getByText(nota);
  await visitas.first().click();
  await expect(conNota).toHaveCount(1);
});

test("un servicio frecuente pide confirmación antes de registrarse", async ({ page }) => {
  await page.goto("/registrar");
  await page.getByLabel("¿A quién atendiste?").fill("Rocky");
  await page.getByRole("list", { name: "Resultados de la búsqueda" }).getByRole("button", { name: /Rocky/ }).first().click();

  await page.getByRole("button", { name: "Antipulgas mensual" }).click();

  await expect(page.getByLabel("Producto o procedimiento")).toHaveValue("Antipulgas mensual");
  await expect(page.getByRole("button", { name: "Registrar visita" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
});
