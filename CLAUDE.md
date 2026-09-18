# vera-dashboard

Frontend de **Vera**, SaaS multi-tenant para clínicas veterinarias en El Salvador. Next.js 15
(App Router) · React 19 · Tailwind v4 · shadcn/ui (Radix) · Recharts · Vitest · Playwright.

La UI, los tipos de dominio y los comentarios están en **español**. Mantenerlo así.
El backend es el repo hermano `vera-api` (Django, privado); se espera clonado en `../vera-api`.

> **Este repo es PÚBLICO.** Nunca commitear secretos, credenciales (tampoco las contraseñas de
> los usuarios demo), `.env*` reales, reportes de auditoría ni detalles de vulnerabilidades. Eso
> va en `vera-api/docs/` (privado).

## Ramas

- **`staging` es la rama de integración y la base de todo trabajo.** `main` es producción y se
  actualiza con un PR `staging → main`.
- **Flujo de git:**
  - Una rama por tema (`feat/`, `fix/`, `test/`, `ci/`, `docs/`) con conventional commits.
  - PR a `staging`, CI en verde, merge con **merge commit** y borrar la rama.
  - Nunca commitear directo a `staging` ni a `main`.

## Correr local

Requiere la API corriendo (ver `../vera-api/CLAUDE.md`: `docker compose up -d db`, `migrate`,
`seed_demo`, `runserver 8000`).

```bash
cp .env.local.example .env.local   # DJANGO_API_URL=http://localhost:8000
npm ci
npm run dev                        # http://localhost:3000
```

## Tests y CI

- `npm test`: Vitest (`lib/**/*.test.ts` y `middleware.test.ts`).
- `npx tsc --noEmit` y `npm run lint`.
- `npm run test:e2e`: Playwright contra la API **real** (no hay mocks). Ver `e2e/README.md`.
  - Crea sus propios usuarios de prueba con una contraseña aleatoria en cada corrida.
  - Los bugs conocidos se escriben con `test.fail()`. Al corregir uno, quitar el marcador en el
    mismo PR.
- CI (`.github/workflows/ci.yml`, **sin secretos**): lint, tipos, Vitest y `next build` en cada
  PR y en push a `main`/`staging`.
- El E2E corre en el CI de `vera-api`, que clona `staging` de este repo. Si un cambio aquí rompe
  E2E, se ve en la siguiente corrida de CI de la API.

## Arquitectura

- **Server-to-server:** el navegador nunca llama a Django. Server Components, Server Actions
  (`app/**/actions.ts`) y route handlers (`app/api/**`) llaman a la API a través de
  `lib/api/client.ts`:
  - `apiFetch`: staff; manda el JWT de la cookie `access_token`.
  - `apiFetchTienda`: dueños; manda la cookie `dueno_token`.
- **Sesión de staff:**
  - `app/api/session/login|logout` guarda o borra `access_token` y `refresh_token` como cookies
    httpOnly (`lib/api/session-cookie.ts`).
  - `middleware.ts` protege las rutas del panel y refresca el access token cuando está por vencer.
  - Las rutas públicas se excluyen en `config.matcher`.
- **Tienda (`app/tienda/`):**
  - Sección pública para dueños de mascotas, fuera del layout de staff.
  - Se entra con el link mágico por WhatsApp → `app/api/tienda/acceder` → cookie `dueno_token`.
  - El middleware exige esa cookie en todo `/tienda/*` excepto `/tienda` y `/tienda/acceder`.
  - Las sesiones de staff y de dueño no son intercambiables.
- **Capa de datos (`lib/data/*.ts`):**
  - Fetchers que convierten los tipos snake_case de la API (`lib/api/types.ts`) a tipos de
    dominio camelCase (`lib/data/types.ts`).
  - Cada mapper tiene su test.
  - `lib/data/seed/` es código muerto del prototipo de Fase 1: no importarlo.
- **UI:**
  - Componentes shadcn en `components/ui/`, compartidos en `components/shared/`, shell y
    navegación en `components/app-shell/`.
  - Colores de marca como tokens `vera-*` en `app/globals.css`; fuentes Fraunces (display) e Inter.
  - **Guía de marca:** `../vera-api/docs/negocio/marca.md` (repo privado). Leerla antes de
    cualquier cambio visual o de copy: paleta, tipografía, reglas de UI y tono.
- **Público sin sesión:** `/login`, `/carnet/[token]` (carnet de vacunas) y la tienda.

## Convenciones

- **Fechas:** usar `lib/date.ts` (`hoyISO`, `addDaysISO`, `hoyISOElSalvador`, `edadTexto`…).
  - Nunca `toISOString().slice(0, 10)` para "hoy": en El Salvador (UTC-6) da el día siguiente
    después de las 18:00.
  - Para lógica de calendario, trabajar con strings `YYYY-MM-DD` o con la zona
    `America/El_Salvador`, no con la zona del servidor (en producción suele ser UTC).
- Los Server Actions devuelven `{ ok: boolean, … }`, sin lanzar errores, y la UI muestra el mensaje.
- Los comentarios explican el *porqué*.
- El CI no usa secretos: seguir así.

## Problemas conocidos

- La home muestra un saludo hardcodeado ("Buenos días, Dra. Ramírez") para todos los usuarios.
  Está marcado con `test.fail()` en `e2e/home.spec.ts`.
- Varias `<label>` de formularios no están asociadas a su input (falta `htmlFor`).
- La paleta de `app/globals.css` no sigue la línea gráfica v1.0: hay que migrar los tokens a los
  colores de la guía de marca.
