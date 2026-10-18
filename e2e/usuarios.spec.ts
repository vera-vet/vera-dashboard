import { expect, test } from "@playwright/test";
import { setAdmin } from "./support/django";
import { SAN_RAFAEL } from "./support/users";

test.afterEach(() => setAdmin(SAN_RAFAEL.email, false));

// Una clínica no podía darle acceso a su secretaria sin el admin de Django.
test("invitar a una persona: define su contraseña con el enlace, entra y se puede desactivar", async ({ page, browser }) => {
  setAdmin(SAN_RAFAEL.email, true);
  const sufijo = Date.now();
  const email = `recepcion.${sufijo}@sanrafael.test`;
  const password = `Montana-Azul-Cafe-${sufijo % 9973}`;

  await page.goto("/ajustes");
  const cuentas = page.locator("section").filter({ has: page.getByRole("heading", { name: "Cuentas de acceso" }) });
  await cuentas.getByRole("button", { name: "+ Invitar" }).click();
  await cuentas.getByLabel("Nombre").fill(`Fátima ${sufijo}`);
  await cuentas.getByLabel("Correo").fill(email);
  await cuentas.getByRole("button", { name: "Invitar" }).click();

  const enlace = (await cuentas.locator("p.font-mono").innerText()).trim();
  const { search } = new URL(enlace);

  // La persona invitada abre el enlace sin sesión (el enlace apunta a FRONTEND_BASE_URL; aquí se
  // usa el mismo uid/token sobre el servidor del E2E).
  const anonimo = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const invitada = await anonimo.newPage();
  await invitada.goto(`/activar${search}`);
  await expect(invitada.getByText(email)).toBeVisible();
  await invitada.getByLabel("Contraseña nueva").fill(password);
  await invitada.getByLabel("Confírmala").fill(password);
  await invitada.getByRole("button", { name: "Guardar contraseña" }).click();
  await invitada.getByRole("link", { name: "Entrar a Vera" }).click();
  await invitada.getByLabel("Correo").fill(email);
  await invitada.getByLabel("Contraseña").fill(password);
  await invitada.getByRole("button", { name: "Entrar" }).click();
  await expect(invitada).toHaveURL(/\/$/);

  // El mismo enlace ya no sirve.
  await invitada.goto(`/activar${search}`);
  await expect(invitada.getByRole("alert").filter({ hasText: "venció" })).toBeVisible();
  await anonimo.close();

  // Desactivada, ya no entra.
  await page.reload();
  const fila = page.getByRole("listitem").filter({ hasText: email });
  await fila.getByRole("button", { name: "Desactivar" }).click();
  await expect(fila).toContainText("Desactivada");
  const otro = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const intento = await otro.newPage();
  await intento.goto("/login");
  await intento.getByLabel("Correo").fill(email);
  await intento.getByLabel("Contraseña").fill(password);
  await intento.getByRole("button", { name: "Entrar" }).click();
  await expect(intento.getByRole("alert").filter({ hasText: "incorrectos" })).toBeVisible();
  await otro.close();
});

test("cualquiera cambia su propia contraseña desde Ajustes; la actual equivocada no deja", async ({ page }) => {
  await page.goto("/ajustes");
  const cuenta = page.locator("section").filter({ has: page.getByRole("heading", { name: "Tu cuenta" }) });
  await cuenta.getByLabel("Contraseña actual").fill("no-es-la-mia");
  await cuenta.getByLabel("Contraseña nueva").fill("Otra-Clave-Segura-2026");
  await cuenta.getByLabel("Confírmala").fill("Otra-Clave-Segura-2026");
  await cuenta.getByRole("button", { name: "Cambiar contraseña" }).click();
  await expect(cuenta.getByRole("alert")).toContainText("no es correcta");
});
