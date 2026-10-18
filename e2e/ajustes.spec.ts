import { expect, test } from "@playwright/test";
import { carnetTokenDe, setAdmin, setWhatsappClinica } from "./support/django";
import { SAN_RAFAEL } from "./support/users";

test.afterEach(() => {
  setAdmin(SAN_RAFAEL.email, false);
  setWhatsappClinica("San Rafael", "");
});

// Equipo y consultorios solo se podían crear desde el admin de Django.
test("el admin configura consultorios y equipo", async ({ page }) => {
  setAdmin(SAN_RAFAEL.email, true);
  const sufijo = Date.now();
  const consultorio = `E2E Consultorio ${sufijo}`;
  const integrante = `E2E Fátima ${sufijo}`;

  await page.goto("/ajustes");
  const consultorios = page.locator("section").filter({ has: page.getByRole("heading", { name: "Consultorios" }) });
  await consultorios.getByRole("button", { name: "+ Agregar" }).click();
  await consultorios.getByLabel("Nombre").fill(consultorio);
  await consultorios.getByRole("button", { name: "Agregar consultorio" }).click();
  await expect(consultorios.getByText(consultorio)).toBeVisible();

  const equipo = page.locator("section").filter({ has: page.getByRole("heading", { name: "Equipo" }) });
  await equipo.getByRole("button", { name: "+ Agregar" }).click();
  await equipo.getByLabel("Nombre").fill(integrante);
  await equipo.getByLabel("Rol").selectOption("secretaria");
  await equipo.getByRole("button", { name: "Agregar integrante" }).click();
  await expect(equipo.getByText(integrante)).toBeVisible();
  await expect(equipo.getByRole("listitem").filter({ hasText: integrante })).toContainText("Recepción");

  for (const nombre of [consultorio, integrante]) {
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: `Borrar ${nombre}` }).click();
    await expect(page.getByText(nombre)).toHaveCount(0);
  }
});

test("sin ser admin, Ajustes es de solo lectura", async ({ page }) => {
  setAdmin(SAN_RAFAEL.email, false);
  await page.goto("/ajustes");
  await expect(page.getByRole("button", { name: "+ Agregar" })).toHaveCount(0);
  await expect(page.getByLabel("WhatsApp de la clínica")).toBeDisabled();
});

// El botón del carnet abría un chat del dueño consigo mismo.
test("el carnet lleva al WhatsApp de la clínica, nunca al del dueño", async ({ page }) => {
  setAdmin(SAN_RAFAEL.email, true);
  await page.goto("/ajustes");
  await page.getByLabel("WhatsApp de la clínica").fill("2222 3333");
  await page.getByRole("button", { name: "Guardar" }).first().click();
  await expect(page.getByRole("status")).toContainText("Guardado");

  await page.goto(`/carnet/${carnetTokenDe("San Rafael", "Rocky")}`);
  const agendar = page.getByRole("link", { name: "Agendar por WhatsApp" });
  await expect(agendar).toHaveAttribute("href", /^https:\/\/wa\.me\/50322223333\?text=/);
  await expect(page.getByText("Veterinaria San Rafael")).toBeVisible();
});
