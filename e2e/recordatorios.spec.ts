import { expect, test, type Page } from "@playwright/test";
import { datosRecordatorio, recordatorioPendiente } from "./support/recordatorios";

async function abrirProgramados(page: Page) {
  await page.goto("/recordatorios");
  await page.getByRole("tab", { name: "Programados" }).click();
}

// Antes "Pausar" y "Editar mensaje" solo cambiaban la pantalla: el recordatorio salía igual.
test("pausar un recordatorio queda guardado y se puede reanudar", async ({ page }) => {
  const mensaje = `A Rocky le toca su refuerzo. E2E pausa ${Date.now()}`;
  const id = recordatorioPendiente(mensaje);

  await abrirProgramados(page);
  const item = page.getByRole("listitem").filter({ hasText: mensaje });
  await item.getByRole("button", { name: "Pausar" }).click();
  await expect(item.getByRole("button", { name: "Reanudar" })).toBeVisible();
  expect(datosRecordatorio(id).estado).toBe("pausado");

  await abrirProgramados(page);
  await expect(page.getByRole("listitem").filter({ hasText: mensaje })).toContainText("Pausado");
  await page.getByRole("listitem").filter({ hasText: mensaje }).getByRole("button", { name: "Reanudar" }).click();
  await expect(page.getByRole("listitem").filter({ hasText: mensaje }).getByRole("button", { name: "Pausar" })).toBeVisible();
  expect(datosRecordatorio(id).estado).toBe("pendiente");
});

test("editar el mensaje de un recordatorio queda guardado", async ({ page }) => {
  const original = `A Rocky le toca su refuerzo. E2E edición ${Date.now()}`;
  const editado = `${original} ¿Te agendo el jueves?`;
  const id = recordatorioPendiente(original);

  await abrirProgramados(page);
  const item = page.getByRole("listitem").filter({ hasText: original });
  await item.getByRole("button", { name: "Editar mensaje" }).click();
  await item.getByLabel("Mensaje del recordatorio").fill(editado);
  await item.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText(editado)).toBeVisible();

  expect(datosRecordatorio(id).mensaje).toBe(editado);
  await abrirProgramados(page);
  await expect(page.getByText(editado)).toBeVisible();
});
