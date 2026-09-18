import { test as setup } from "@playwright/test";
import { loginOk } from "./support/login";
import { SAN_RAFAEL } from "./support/users";

setup("sesión de staff de San Rafael", async ({ page }) => {
  await loginOk(page, SAN_RAFAEL.email);
  await page.context().storageState({ path: "e2e/.auth/sanrafael.json" });
});
