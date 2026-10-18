import { expect, test } from "@playwright/test";
import { pacienteConFotoRota } from "./support/django";

// El buscador de Pacientes no estaba conectado a nada.
test("buscar pacientes por nombre, dueño o teléfono", async ({ page }) => {
  await page.goto("/pacientes");
  await page.getByLabel("Buscar por paciente, dueño o teléfono").fill("71234567");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\?q=71234567/);
  await expect(page.getByRole("link", { name: /Rocky/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Luna/ })).toHaveCount(0);

  await page.getByRole("link", { name: "Limpiar" }).click();
  await expect(page.getByRole("link", { name: /Luna/ }).first()).toBeVisible();
});

// No había forma de corregir un dato: un WhatsApp mal escrito dejaba al dueño sin recordatorios.
test("editar los datos del paciente y del dueño desde el expediente", async ({ page }) => {
  const id = pacienteConFotoRota("Kira E2E");
  const raza = `Mestiza ${Date.now()}`;

  await page.goto(`/pacientes/${id}`);
  await page.getByRole("button", { name: "Editar datos" }).click();
  await page.getByLabel("Raza").fill(raza);
  await page.getByRole("button", { name: "Guardar paciente" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Guardado" }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(raza).first()).toBeVisible();

  await page.getByRole("button", { name: "Editar datos" }).click();
  await page.getByLabel("WhatsApp", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Guardar dueño" }).click();
  // Next también tiene un role="alert" (el anunciador de rutas): se filtra por el texto.
  await expect(page.getByRole("alert").filter({ hasText: "WhatsApp válido" })).toBeVisible();
});

test("Escribir y Avisar abren WhatsApp con el dueño", async ({ page }) => {
  await page.goto("/pacientes?q=Rocky");
  await page.getByRole("link", { name: /Rocky/ }).first().click();
  await expect(page.getByRole("link", { name: /^Escribir a / })).toHaveAttribute("href", /^https:\/\/wa\.me\/503\d{8}\?text=/);

  await page.goto("/vacunas");
  const avisar = page.getByRole("link", { name: /^Avisar a .* por WhatsApp$/ }).first();
  await expect(avisar).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=Hola%2C/);
});

test.describe("en el teléfono", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  // En móvil no había cómo cerrar sesión: el botón solo estaba en la barra lateral.
  test("se puede cerrar sesión desde Más", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Más opciones" }).click();
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
