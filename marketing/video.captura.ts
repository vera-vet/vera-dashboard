import { renameSync } from "node:fs";
import path from "node:path";
import { expect, test, type Browser, type Page } from "@playwright/test";
import { SALIDA } from "./setup";
import { entrar, esperarQuieta, prepararPagina } from "./soporte";

const ANCHO = 1280;
const ALTO = 800;

test.use({ viewport: { width: ANCHO, height: ALTO } });

// Se inicia sesión en un contexto sin grabar y se reutiliza la sesión: así el video no empieza
// en la pantalla de login (y el poster no es el login).
async function paginaGrabando(browser: Browser, baseURL: string) {
  // Los contextos creados a mano no heredan el `use` de la config: se repite lo necesario.
  const opciones = {
    baseURL,
    viewport: { width: ANCHO, height: ALTO },
    locale: "es-SV",
    timezoneId: "America/El_Salvador",
    colorScheme: "light" as const,
  };
  const login = await browser.newContext(opciones);
  const paginaLogin = await login.newPage();
  await entrar(paginaLogin);
  const storageState = await login.storageState();
  await login.close();

  const contexto = await browser.newContext({
    ...opciones,
    storageState,
    recordVideo: { dir: path.join(SALIDA, "video", "crudo"), size: { width: ANCHO, height: ALTO } },
  });
  return contexto.newPage();
}

// Subtítulo quemado en el video: se entiende sin audio. Colores y fuente de la marca. Va centrado
// en el área de contenido (el sidebar mide 256 px) y por encima del aviso de confirmación.
async function rotulo(page: Page, texto: string) {
  await page.evaluate((t) => {
    let el = document.getElementById("rotulo-marketing");
    if (!el) {
      el = document.createElement("div");
      el.id = "rotulo-marketing";
      Object.assign(el.style, {
        position: "fixed", left: "calc(50% + 128px)", bottom: "112px", transform: "translateX(-50%)", zIndex: "9999",
        background: "rgba(14, 90, 71, 0.94)", color: "#F7F4EE", padding: "14px 26px", borderRadius: "14px",
        font: "600 24px/1.3 Inter, system-ui, sans-serif", letterSpacing: "-0.01em", whiteSpace: "nowrap",
        boxShadow: "0 12px 32px -12px rgba(0,0,0,.35)",
      });
      document.body.appendChild(el);
    }
    el.textContent = t;
  }, texto);
}

async function escena(page: Page, texto: string, ms: number) {
  await esperarQuieta(page);
  await rotulo(page, texto);
  await page.waitForTimeout(ms);
}

// Solo flujos que existen de verdad en Vera: nada simulado.
test("video: de la vacuna al recordatorio y la agenda", async ({ browser, baseURL }) => {
  const page = await paginaGrabando(browser, baseURL!);
  await prepararPagina(page);
  await page.goto("/");
  await escena(page, "Así empieza el día en Clínica San Benito", 4000);

  await page.goto("/registrar");
  await page.getByRole("button", { name: /Dante/ }).first().click();
  await escena(page, "Registrar una vacuna es un toque", 2500);
  await page.getByRole("button", { name: "Rabia" }).click();
  await expect(page.getByRole("status")).toContainText("Vera programó el recordatorio");
  await escena(page, "Vera programa el próximo recordatorio sola", 3500);

  await page.goto("/recordatorios");
  await page.getByRole("button", { name: /— Dante/ }).click();
  await expect(page.getByText(/Soy Vera/).first()).toBeVisible();
  await escena(page, "Le escribe a María por WhatsApp, y ella confirma", 5000);

  await page.goto("/agenda");
  await escena(page, "La cita de Dante queda en la agenda", 4000);

  await page.goto("/reportes");
  await escena(page, "Y cada recordatorio queda medido", 4500);

  const video = page.video();
  await page.context().close();
  if (video) renameSync(await video.path(), path.join(SALIDA, "video", "vera-demo.webm"));
});
