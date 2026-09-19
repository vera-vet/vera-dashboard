# Vera Dashboard

Panel web de **Vera**, el asistente para clínicas veterinarias: agenda, sala de espera, expediente
clínico, recordatorios y conversaciones por WhatsApp, reportes, inventario y pedidos. Incluye la
tienda en línea para dueños de mascotas y el carnet digital de vacunas.

Consume la API de `vera-api` (Django), siempre desde el servidor: el navegador nunca habla
directo con la API. Guía técnica detallada y reglas de trabajo (personas y agentes de IA): [`AGENTS.md`](AGENTS.md). **Todo cambio entra por PR.**

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui · next-themes · Recharts ·
Vitest · Playwright.

## Desarrollo

Requiere la API corriendo en `http://localhost:8000` (ver el README de `vera-api`, que también
lista los usuarios de prueba).

```bash
cp .env.local.example .env.local
npm ci
npm run dev
```

Abre `http://localhost:3000`.

## Pruebas

```bash
npm test            # unitarias (Vitest)
npm run test:e2e    # end-to-end contra la API real (Playwright), ver e2e/README.md
```

CI (`.github/workflows/ci.yml`): lint, tipos, pruebas unitarias y build en cada PR. La suite E2E
corre en el CI de `vera-api`.

## Ramas

`staging` es la rama de integración: todo PR va contra `staging`. `main` es producción y se
actualiza con un PR `staging → main`.
