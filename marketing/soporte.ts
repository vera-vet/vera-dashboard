import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";
import { DATOS } from "./setup";

export interface Datos {
  danteId: number;
  carnetToken: string;
  email: string;
  password: string;
}

export function datos(): Datos {
  return JSON.parse(readFileSync(DATOS, "utf-8"));
}

// Dante es la única mascota con foto (la de la landing, con permiso de sus dueños). Su foto_url
// apunta a veravet.lat; aquí se sirve desde la copia local de la landing si existe.
const FOTO_DANTE = path.resolve(
  process.env.VERA_LANDING_DIR ?? path.join(__dirname, "../../vera-landing-page"),
  "public/images/dante.webp",
);

export async function prepararPagina(page: Page) {
  if (existsSync(FOTO_DANTE)) {
    await page.route("https://veravet.lat/images/dante.webp", (route) =>
      route.fulfill({ path: FOTO_DANTE, contentType: "image/webp" }),
    );
  }
  // Tema claro siempre (la marca no define el oscuro).
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
}

export async function entrar(page: Page) {
  const { email, password } = datos();
  await page.goto("/login");
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("/");
}

/** Espera a que la página esté quieta: red, fuentes e imágenes cargadas. */
export async function esperarQuieta(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete));
}
