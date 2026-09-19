import { defineConfig } from "@playwright/test";

// Capturas y video de marketing (VER-83) contra la app real con la clínica ficticia de
// `seed_marketing`. Ver marketing/README.md. No es parte de la suite E2E ni del CI.
const PORT = Number(process.env.MARKETING_PORT ?? 3200);

export default defineConfig({
  testDir: ".",
  testMatch: /\.captura\.ts$/,
  globalSetup: "./setup.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, locale: "es-SV", timezoneId: "America/El_Salvador", colorScheme: "light" },
  webServer: {
    // Build de producción: las capturas no deben mostrar el indicador de Next en desarrollo.
    command: `npm run start -- -p ${PORT}`,
    cwd: "..",
    url: `http://localhost:${PORT}/login`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
