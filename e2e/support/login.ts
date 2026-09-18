import { expect, type Page } from "@playwright/test";
import { password as e2ePassword } from "./users";

export async function login(page: Page, email: string, password = e2ePassword()) {
  await page.goto("/login");
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

/** Inicia sesión y espera a estar dentro del panel. (El saludo de la home está
 * hardcodeado -- ver home.spec.ts -- así que no sirve para verificar identidad.) */
export async function loginOk(page: Page, email: string) {
  await login(page, email);
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}
