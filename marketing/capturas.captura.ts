import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { SALIDA } from "./setup";
import { datos, entrar, esperarQuieta, prepararPagina } from "./soporte";

const png = (nombre: string) => path.join(SALIDA, "capturas", `${nombre}.png`);

async function capturar(page: Page, nombre: string) {
  await esperarQuieta(page);
  await page.screenshot({ path: png(nombre) });
}

test.describe("escritorio", () => {
  test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  test("inicio, agenda, expediente y reportes", async ({ page }) => {
    await prepararPagina(page);
    await entrar(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Andrea Molina");
    await capturar(page, "escritorio-inicio");

    await page.goto("/agenda");
    await capturar(page, "escritorio-agenda");

    await page.goto(`/pacientes/${datos().danteId}`);
    await expect(page.getByRole("heading", { name: "Dante" })).toBeVisible();
    await capturar(page, "escritorio-expediente");

    await page.goto("/reportes");
    await expect(page.locator(".recharts-bar-rectangle").first()).toBeVisible();
    await page.waitForTimeout(800); // animación de las barras
    await capturar(page, "escritorio-reportes");
  });
});

test.describe("móvil", () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

  test("registrar, conversación de WhatsApp y carnet", async ({ page }) => {
    await prepararPagina(page);
    await entrar(page);

    await page.goto("/registrar");
    await page.getByRole("button", { name: /Dante/ }).first().click();
    await capturar(page, "movil-registrar");

    await page.goto("/recordatorios");
    await page.getByRole("button", { name: /— Dante/ }).click();
    const conversacion = page.locator("section", { hasText: "Sobre Dante" });
    await expect(conversacion.getByText(/Soy Vera/)).toBeVisible();
    await esperarQuieta(page);
    await conversacion.screenshot({ path: png("movil-conversacion") });

    await page.goto(`/carnet/${datos().carnetToken}`);
    await capturar(page, "movil-carnet");
  });
});
