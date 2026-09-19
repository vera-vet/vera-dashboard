import { expect, test, type Page } from "@playwright/test";
import { pacienteConFotoRota } from "./support/django";

async function imagenesRotas(page: Page): Promise<string[]> {
  return page.locator("img").evaluateAll((imgs) =>
    (imgs as HTMLImageElement[]).filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.alt || img.src),
  );
}

// VER-38: un paciente sin foto, o con una foto que no carga, muestra su inicial y nunca una imagen rota.
test("el expediente muestra la inicial si la foto no carga", async ({ page }) => {
  const id = pacienteConFotoRota("Kira E2E");

  await page.goto(`/pacientes/${id}`);
  const avatar = page.getByRole("img", { name: "Kira E2E" }).first();
  await expect(avatar).toHaveText("K");
  expect(await imagenesRotas(page)).toEqual([]);
});

test("ninguna lista de pacientes muestra imágenes rotas", async ({ page }) => {
  pacienteConFotoRota("Kira E2E");
  for (const ruta of ["/", "/pacientes", "/vacunas", "/sala", "/registrar", "/recordatorios"]) {
    await page.goto(ruta);
    await page.waitForLoadState("networkidle");
    expect(await imagenesRotas(page), ruta).toEqual([]);
  }
});
