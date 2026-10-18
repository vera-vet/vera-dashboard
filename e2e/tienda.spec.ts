import { expect, test } from "@playwright/test";
import { prepararTienda, stockDe } from "./support/django";

test("un dueño compra en la tienda y la clínica gestiona el pedido", async ({ page, browser }) => {
  const datos = prepararTienda("E2E Collar antipulgas", 50);

  // --- Dueño: sin sesión de staff, entra con el link mágico ---
  const dueno = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const tienda = await dueno.newPage();

  await tienda.goto("/tienda/catalogo");
  await expect(tienda).toHaveURL(/\/tienda$/); // sin dueno_token no hay catálogo

  await tienda.goto(`/tienda/acceder?token=${encodeURIComponent(datos.tokenAcceso)}`);
  await expect(tienda).toHaveURL(/\/tienda\/catalogo$/);

  const fila = tienda.getByRole("listitem").filter({ hasText: datos.productoNombre });
  await fila.getByRole("button", { name: "Agregar" }).click();
  await fila.getByRole("button", { name: "Agregar" }).click();
  await tienda.getByRole("link", { name: "Ver carrito (2)" }).click();

  await expect(tienda).toHaveURL(/\/tienda\/checkout$/);
  await tienda.getByRole("button", { name: "Pagar" }).click();

  await expect(tienda).toHaveURL(/\/tienda\/pago-simulado\/\d+$/);
  const pedidoId = tienda.url().match(/(\d+)$/)![1];
  await tienda.getByRole("button", { name: "Simular pago exitoso" }).click();
  await expect(tienda.getByText(`¡Pago confirmado! Tu pedido #${pedidoId} está en proceso.`)).toBeVisible();

  expect(stockDe(datos.productoId)).toBe(datos.stockInicial - 2);

  await tienda.getByRole("button", { name: "Ver mis pedidos" }).click();
  await expect(tienda.getByText(`Pedido #${pedidoId}`)).toBeVisible();

  // Un link mágico inválido no da acceso.
  await tienda.context().clearCookies();
  await tienda.goto("/tienda/acceder?token=no-es-un-token");
  await expect(tienda.getByText(/inválido|vencido/i)).toBeVisible();
  await dueno.close();

  // --- Staff: el pedido pagado aparece en /pedidos y avanza de estado ---
  await page.goto("/pedidos");
  // " · " evita que el pedido #4 coincida también con el #40.
  const tarjeta = page.getByRole("listitem").filter({ hasText: `Pedido #${pedidoId} · ${datos.duenoNombre}` });
  await tarjeta.getByRole("button", { name: "Marcar en proceso" }).click();
  await expect(tarjeta.getByRole("button", { name: "Marcar entregado" })).toBeVisible();
});

// Con una cookie vieja, /tienda mandaba al catálogo, el catálogo daba 401 y volvía a /tienda (bucle).
test("una sesión vencida de la tienda pide un link nuevo, sin bucles", async ({ browser, baseURL }) => {
  const contexto = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  await contexto.addCookies([{ name: "dueno_token", value: "token-viejo", url: baseURL! }]);
  const tienda = await contexto.newPage();

  await tienda.goto("/tienda");

  await expect(tienda).toHaveURL(/\/tienda\?vencida=1$/);
  await expect(tienda.getByText("Tu sesión venció. Pide un link nuevo.")).toBeVisible();
  await contexto.close();
});

test("el carrito se ajusta antes de pagar y la clínica ve total y contacto", async ({ page, browser }) => {
  const datos = prepararTienda("E2E Shampoo", 3);
  const dueno = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const tienda = await dueno.newPage();
  await tienda.goto(`/tienda/acceder?token=${encodeURIComponent(datos.tokenAcceso)}`);
  await expect(tienda.getByText("Veterinaria San Rafael")).toBeVisible(); // la tienda dice de qué clínica es

  const fila = tienda.getByRole("listitem").filter({ hasText: datos.productoNombre });
  await fila.getByRole("button", { name: "Agregar" }).click();
  await tienda.getByRole("link", { name: /Ver carrito/ }).click();
  await tienda.getByRole("button", { name: `Agregar uno de ${datos.productoNombre}` }).click();
  await tienda.getByRole("button", { name: `Agregar uno de ${datos.productoNombre}` }).click();
  // Solo hay 3: no deja pedir más.
  await expect(tienda.getByRole("button", { name: `Agregar uno de ${datos.productoNombre}` })).toBeDisabled();
  await tienda.getByRole("button", { name: `Quitar uno de ${datos.productoNombre}` }).click();
  await expect(tienda.getByLabel(`Cantidad de ${datos.productoNombre}`)).toHaveText("2");
  await tienda.getByRole("button", { name: /^Pagar \$/ }).click();
  await expect(tienda).toHaveURL(/\/tienda\/pago-simulado\/\d+$/);
  const pedidoId = tienda.url().match(/(\d+)$/)![1];
  await tienda.getByRole("button", { name: "Simular pago exitoso" }).click();
  await dueno.close();

  await page.goto("/pedidos");
  const tarjeta = page.getByRole("listitem").filter({ hasText: `Pedido #${pedidoId} · ${datos.duenoNombre}` });
  await expect(tarjeta).toContainText("Total: $");
  await expect(tarjeta.getByRole("link", { name: /^Escribir a / })).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
});
