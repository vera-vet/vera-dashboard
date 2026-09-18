import { expect, test } from "@playwright/test";
import { login, loginOk } from "./support/login";
import { SAN_RAFAEL } from "./support/users";

// Sin sesión guardada: estos tests prueban el login mismo.
test.use({ storageState: { cookies: [], origins: [] } });

test("sin sesión, cualquier página del panel redirige a /login", async ({ page }) => {
  for (const ruta of ["/", "/pacientes", "/inventario"]) {
    await page.goto(ruta);
    await expect(page).toHaveURL(/\/login$/);
  }
});

test("credenciales incorrectas muestran error y no crean sesión", async ({ page }) => {
  await login(page, SAN_RAFAEL.email, "contraseña-incorrecta");
  await expect(page.getByText("Correo o contraseña incorrectos.")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);

  const cookies = await page.context().cookies();
  expect(cookies.map((c) => c.name)).not.toContain("refresh_token");
});

test("login correcto guarda cookies httpOnly y cerrar sesión las elimina", async ({ page }) => {
  await loginOk(page, SAN_RAFAEL.email);

  const cookies = await page.context().cookies();
  for (const nombre of ["access_token", "refresh_token"]) {
    const cookie = cookies.find((c) => c.name === nombre);
    expect(cookie, nombre).toBeDefined();
    expect(cookie?.httpOnly, `${nombre} httpOnly`).toBe(true);
  }
  // Los tokens nunca deben ser legibles desde JS.
  expect(await page.evaluate(() => document.cookie)).not.toContain("access_token");

  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/pacientes");
  await expect(page).toHaveURL(/\/login$/);
});

test("el carnet digital es público", async ({ page }) => {
  // Ruta pública: un token inexistente debe dar la página de no encontrado, no redirigir a /login.
  await page.goto("/carnet/00000000-0000-0000-0000-000000000000");
  await expect(page).not.toHaveURL(/\/login/);
});
