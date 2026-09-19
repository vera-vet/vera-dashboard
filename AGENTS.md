# vera-dashboard

Frontend de **Vera**, SaaS multi-tenant para clínicas veterinarias en El Salvador. Next.js 15
(App Router) · React 19 · Tailwind v4 · shadcn/ui (Radix) · Recharts · Vitest · Playwright.

La UI, los tipos de dominio y los comentarios están en **español**. Mantenerlo así.
El backend es el repo hermano `vera-api` (Django, privado); se espera clonado en `../vera-api`.

> **Este repo es PÚBLICO.** Nunca commitear secretos, credenciales (tampoco las contraseñas de
> los usuarios demo), `.env*` reales, reportes de auditoría ni detalles de vulnerabilidades. Eso
> va en `vera-api/docs/` (privado).

## Flujo de trabajo obligatorio: todo entra por PR

Aplica a **personas y agentes de IA** (Claude Code, Codex, Cursor, Copilot…), sin excepciones,
incluso para un cambio de una línea o solo de documentación.

1. **Nunca** hacer commit ni push directo a `staging` ni a `main`.
2. Crear una rama por tema desde `staging` actualizado. Prefijos: `feat/`, `fix/`, `test/`, `ci/`,
   `docs/`, `chore/`, `refactor/`. Si hay ticket de Linear, incluir su ID (por ejemplo
   `fix/ver-72-webhook-pago`). Commits en formato *conventional commits*.
3. Abrir un **PR contra `staging`** (`gh pr create --base staging`; la rama por defecto de GitHub
   sigue siendo `main`), usando el template: qué cambia, por qué, cómo se probó, y el ticket.
4. Esperar el **CI en verde**. Si algo falla, se arregla en la misma rama: nunca se desactiva un
   test ni se salta el CI.
5. Merge con **merge commit** (no squash ni rebase) y borrar la rama.
6. **Pasar a producción** es un PR `staging → main` aparte, y requiere la confirmación explícita de
   ambos socios. Un agente nunca lo mergea por su cuenta.

Además:
- Los cambios de modelos de datos, migraciones, permisos o seguridad los revisa David antes del
  merge.
- Un agente no hace force push, no reescribe historial publicado, no crea secretos en GitHub y no
  cambia la configuración del repo sin pedirlo.
- Los tickets viven en Linear (espacio **VeraApp**, clave `VER`). Al abrir el PR, enlazar el ticket.

## Correr local

Requiere la API corriendo (ver `../vera-api/AGENTS.md`: `docker compose up -d db`, `migrate`,
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
  - Colores de marca como tokens `vera-*` en `app/globals.css`, con los nombres del manual:
    `vera-verde`, `vera-apoyo`, `vera-menta`, `vera-coral`, `vera-marfil`, `vera-tinta` y sus
    derivados. Fuentes Fraunces (display) e Inter.
  - Botones primarios con `bg-primary text-primary-foreground` (funciona en modo claro y oscuro).
    Texto coral con `text-vera-coral-fuerte` (el coral de marca no llega a AA en texto chico), y
    texto sobre el verde de WhatsApp con `text-whatsapp-foreground`, nunca blanco.
  - Todo input lleva una etiqueta asociada (`<label htmlFor>` o `aria-label`); el placeholder no
    cuenta como etiqueta.
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

- La "Nota clínica" de Registrar no se guarda: el `Textarea` no está conectado al estado.
- Las fotos de productos (inventario y tienda) todavía pueden mostrarse rotas; los pacientes ya
  usan `AvatarPaciente`.
