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
