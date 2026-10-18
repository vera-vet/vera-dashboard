import { expect, test, type Locator, type Page } from "@playwright/test";
import { pacienteConFotoRota, setAdmin } from "./support/django";
import { SAN_RAFAEL } from "./support/users";

// Una foto real de 120×90 (verde Vera sobre menta).
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAHgAAABaCAIAAAD8YgW4AAAA+klEQVR4nO3dsQ3CQBQFwTvkfl0BBFCBK3AzLsLl0AOWN2Em/zpp9fKb+3kM7vcI3kDojkVHhI4IHRE6InRE6IjQEaEjQkeEjggdEToidEToiNARoSNCR5Yrx+v7M/7M9nr+dmjREaEjQkeEjggdEToidEToiNARoSNCR4SOCB0ROiJ0ROiI0BGhI0JHhI4IHRE6InRE6IjQEaEjQkeEjggdEToidEToiNARoSNCR4SOCB0ROiJ0ROiI0BGhI0JHhI4IHRE6InRE6IjQEaEj0/cgDYuOCB0ROiJ0ROiI0BGhI0JHhI4IHRE6InRE6IjQEaEjQkeEjgg9Gl+tYggrZ8TcCAAAAABJRU5ErkJggg==", "base64");
const FOTO = { name: "foto.png", mimeType: "image/png", buffer: PNG };

async function cargada(img: Locator) {
  await expect(img).toHaveAttribute("src", /^\/imagenes\/[0-9a-f-]{36}$/);
  await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
}

async function abrirRegistrarPara(page: Page, nombre: string) {
  await page.goto("/registrar");
  await page.getByLabel("¿A quién atendiste?").fill(nombre);
  await page.getByRole("list", { name: "Resultados de la búsqueda" }).getByRole("button", { name: new RegExp(nombre) }).first().click();
}

test.afterEach(() => setAdmin(SAN_RAFAEL.email, false));

// Antes no había dónde guardar fotos: Registrar guardaba blob: muertos y el resto pedía una URL.
test("la foto del paciente se sube desde Editar datos y se ve en el expediente", async ({ page }) => {
  const id = pacienteConFotoRota("Kira E2E");

  await page.goto(`/pacientes/${id}`);
  await page.getByRole("button", { name: "Editar datos" }).click();
  await page.getByLabel("Foto", { exact: true }).setInputFiles(FOTO);
  await expect(page.getByRole("button", { name: "Quitar" })).toBeVisible();
  await page.getByRole("button", { name: "Guardar paciente" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Guardado" }).first()).toBeVisible();

  await page.reload();
  await cargada(page.getByRole("img", { name: "Kira E2E" }).first());
});

test("las fotos de una visita se suben en Registrar y quedan en el historial", async ({ page }) => {
  await abrirRegistrarPara(page, "Kira E2E");
  await page.getByRole("button", { name: "Consulta", exact: true }).click();
  await page.getByRole("button", { name: "Dermatológica" }).click();
  await page.getByLabel("Fotos (opcional)").setInputFiles(FOTO);
  await expect(page.getByRole("img", { name: "Foto 1" })).toBeVisible();
  await page.getByRole("button", { name: "Registrar visita" }).click();
  await expect(page.getByRole("status")).toContainText("Kira E2E · Dermatológica.");

  await page.goto(`/pacientes/${pacienteConFotoRota("Kira E2E")}`);
  await page.getByRole("button", { name: /^Dermatológica/ }).first().click();
  await cargada(page.getByRole("img", { name: "Foto 1 de la visita" }).first());
});

test("la foto de un producto se sube en inventario", async ({ page }) => {
  setAdmin(SAN_RAFAEL.email, true);
  const nombre = `E2E Collar ${Date.now()}`;

  await page.goto("/inventario");
  await page.getByRole("button", { name: "Nuevo producto" }).click();
  await page.getByLabel("Nombre del producto").fill(nombre);
  await page.getByLabel("Precio").fill("6.50");
  await page.getByLabel("Cantidad en stock").fill("3");
  await page.getByLabel("Foto (opcional)").setInputFiles(FOTO);
  await expect(page.getByRole("button", { name: "Quitar" })).toBeVisible();
  await page.getByRole("button", { name: "Crear producto" }).click();

  await cargada(page.getByRole("img", { name: nombre }));
});
