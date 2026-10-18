import { expect, test } from "@playwright/test";
import { crearEstacionE2E, limpiarSalaE2E, pacienteConFotoRota } from "./support/django";

const PREFIJO = "E2E Sala";

test.beforeEach(() => {
  limpiarSalaE2E(PREFIJO);
  pacienteConFotoRota("Kira E2E");
});
test.afterEach(() => limpiarSalaE2E(PREFIJO));

// Antes una sesión no se podía terminar y el consultorio quedaba "en curso" para siempre.
test("iniciar y terminar una sesión; un paciente no está en dos consultorios", async ({ page }) => {
  const sufijo = Date.now();
  const uno = `${PREFIJO} A ${sufijo}`;
  const dos = `${PREFIJO} B ${sufijo}`;
  crearEstacionE2E(uno);
  crearEstacionE2E(dos);

  await page.goto("/sala");
  const tarjeta = page.locator("div.rounded-2xl").filter({ hasText: uno });
  await tarjeta.getByRole("button", { name: "+ Nueva sesión" }).click();
  await tarjeta.getByLabel("Paciente").fill("Kira E2E");
  await tarjeta.getByRole("list", { name: "Pacientes encontrados" }).getByRole("button").first().click();
  await tarjeta.getByLabel("Motivo").fill("Consulta E2E");
  await tarjeta.getByRole("button", { name: "Iniciar" }).click();
  await expect(tarjeta).toContainText("en curso");
  await expect(tarjeta).toContainText("Kira E2E");

  const otra = page.locator("div.rounded-2xl").filter({ hasText: dos });
  await otra.getByRole("button", { name: "+ Nueva sesión" }).click();
  await otra.getByLabel("Paciente").fill("Kira E2E");
  await otra.getByRole("list", { name: "Pacientes encontrados" }).getByRole("button").first().click();
  await otra.getByLabel("Motivo").fill("Otra");
  await otra.getByRole("button", { name: "Iniciar" }).click();
  await expect(otra.getByRole("alert")).toContainText("Kira E2E ya está en otra sesión");

  page.once("dialog", (d) => d.accept());
  await tarjeta.getByRole("button", { name: "Terminar sesión" }).click();
  await expect(tarjeta).toContainText("Libre");
});

test("de la sala de espera a un consultorio", async ({ page }) => {
  const consultorio = `${PREFIJO} C ${Date.now()}`;
  crearEstacionE2E(consultorio);

  await page.goto("/sala");
  await page.getByRole("button", { name: "+ Llegó alguien" }).click();
  await page.getByLabel("¿Quién llegó?").fill("Kira E2E");
  await page.getByRole("list", { name: "Pacientes encontrados" }).getByRole("button").first().click();
  await page.getByLabel("Motivo").fill("Vacuna E2E");
  await page.getByRole("button", { name: "Agregar a la espera" }).click();

  const enEspera = page.getByRole("listitem").filter({ hasText: "Kira E2E" });
  await expect(enEspera).toContainText("Vacuna E2E");
  await enEspera.getByLabel("Pasar a Kira E2E a un consultorio").selectOption({ label: consultorio });
  await enEspera.getByRole("button", { name: "Iniciar" }).click();

  await expect(page.locator("div.rounded-2xl").filter({ hasText: consultorio })).toContainText("Kira E2E");
  await expect(page.getByRole("listitem").filter({ hasText: "Vacuna E2E" })).toHaveCount(0);
});
