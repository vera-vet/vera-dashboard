# Vera Dashboard — Fase 1 (Next.js Frontend) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Vera Dashboard frontend from scratch in `/Users/luismerino/Desktop/vera-dashboard` — a Next.js 15 App Router app with a premium "bold minimalism" design system, 10 screens, and a mock data layer shaped exactly like the future Django API.

**Architecture:** Next.js App Router with Server Components by default; a route group `(dashboard)` wraps 8 authenticated-feeling screens in a shared `AppShell` (sidebar + content), while `/login` and `/carnet/[id]` render outside that shell. All data flows through async functions in `lib/data/` that today resolve over static seed arrays but are named/shaped like future REST calls. Design tokens live in `app/globals.css` as CSS variables (light + dark), consumed via Tailwind v4's `@theme inline`.

**Tech Stack:** Next.js 15 (App Router, TypeScript, React 19), Tailwind CSS v4, shadcn/ui (Radix primitives), next-themes (dark mode), lucide-react (icons), Recharts (charts), Fraunces + Inter (next/font/google), Vitest (unit tests for data layer and utils), npm as package manager.

## Global Constraints

- No Django, no AWS, no database, no real auth — everything is mock/local (spec §10).
- Nav is fixed for all users, 8 items, no role-based logic (spec §5): `Inicio · Recordatorios · Pacientes · Agenda · Vacunas · Sala · Registrar · Reportes`.
- Color roles must stay distinct: forest (brand/chrome) ≠ emerald (action/success). Honey is the only warm accent, used sparingly. Danger color is coral `#D8654F`, never fire-engine red (spec §2, §4).
- Radii 16–24px, ultra-soft shadows only, no hard borders (spec §2).
- Fraunces for display/headings, Inter for UI/body, via `next/font/google` (spec §3).
- Light mode is the default theme; dark mode is an explicit opt-in toggle, not system-preference-driven (per the original user brief: "Modo claro por defecto").
- Minimum tap target 44×44px, minimum functional text 14px, 16px on inputs (spec §9).
- All copy in Spanish, warm and human, no technical jargon (spec §9).
- "Hoy" is always derived from `new Date()` at runtime — never a hardcoded ISO string (spec §7, fixing a bug found in the reference project).
- All color usage goes through the semantic CSS variables defined in Task 2 — never literal Tailwind color classes like `bg-green-600`.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `next-env.d.ts`
- Create: `app/layout.tsx` (temporary minimal version, replaced in Task 2)
- Create: `app/page.tsx` (temporary placeholder, replaced in Task 12)

**Interfaces:**
- Produces: a running `npm run dev` server on `http://localhost:3000`, path alias `@/*` → project root, scripts `dev`/`build`/`start`/`lint`/`test`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "vera-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-themes": "^0.4.4",
    "lucide-react": "^0.469.0",
    "recharts": "^2.15.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "class-variance-authority": "^0.7.1"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "@types/node": "^22.10.7",
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.3",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "eslint": "^9.18.0",
    "eslint-config-next": "^15.1.6",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Write `postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Write `.eslintrc.json`**

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

- [ ] **Step 6: Write `.gitignore`**

```
node_modules
.next
out
.env*.local
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 7: Write `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 8: Write temporary `app/layout.tsx`**

```tsx
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Write temporary `app/page.tsx`**

```tsx
export default function Home() {
  return <p>Vera Dashboard — scaffolding in progress.</p>;
}
```

- [ ] **Step 10: Install dependencies**

Run: `npm install`
Expected: exits 0, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 11: Verify the dev server boots**

Run: `npm run dev &` then `sleep 3 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` then stop the server (`kill %1`).
Expected: HTTP status `200`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project with TypeScript and Tailwind v4 tooling"
```

---

### Task 2: Design tokens, global styles, and fonts

**Files:**
- Create: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS variables (`--background`, `--card`, `--vera-forest`, `--vera-emerald`, `--vera-honey`, `--vera-coral`, `--vera-slate-info`, `--vera-ink`, `--vera-ink-soft`, `--whatsapp`, etc.) usable as Tailwind utilities (`bg-background`, `text-vera-forest`, `font-display`, `font-sans`) in every later task. Font CSS variables `--font-display` (Fraunces) and `--font-sans` (Inter) applied on `<html>`.

- [ ] **Step 1: Write `app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-display: var(--font-fraunces);
  --font-sans: var(--font-inter);

  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--card);
  --color-popover-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-vera-forest: var(--vera-forest);
  --color-vera-forest-deep: var(--vera-forest-deep);
  --color-vera-emerald: var(--vera-emerald);
  --color-vera-honey: var(--vera-honey);
  --color-vera-honey-soft: var(--vera-honey-soft);
  --color-vera-coral: var(--vera-coral);
  --color-vera-coral-soft: var(--vera-coral-soft);
  --color-vera-slate-info: var(--vera-slate-info);
  --color-vera-ink: var(--vera-ink);
  --color-vera-ink-soft: var(--vera-ink-soft);
  --color-vera-sage: var(--vera-sage);
  --color-whatsapp: var(--whatsapp);
}

:root {
  --radius: 20px;

  --background: #f4f1e8;
  --foreground: #2a2a26;
  --card: #ffffff;
  --card-foreground: #2a2a26;

  --primary: #1e3a2f;
  --primary-foreground: #f4f1e8;
  --secondary: #e4eae0;
  --secondary-foreground: #1e3a2f;
  --muted: #e4eae0;
  --muted-foreground: #6b6b63;
  --accent: #eef1e6;
  --accent-foreground: #1e3a2f;
  --destructive: #d8654f;
  --destructive-foreground: #ffffff;
  --border: #e2ddc9;
  --input: #e2ddc9;
  --ring: #3e9b6b;

  --vera-forest: #1e3a2f;
  --vera-forest-deep: #14261d;
  --vera-emerald: #3e9b6b;
  --vera-honey: #e0a458;
  --vera-honey-soft: #f6e3c7;
  --vera-coral: #d8654f;
  --vera-coral-soft: #f5dcd5;
  --vera-slate-info: #5a7a8c;
  --vera-ink: #2a2a26;
  --vera-ink-soft: #6b6b63;
  --vera-sage: #e4eae0;
  --whatsapp: #25d366;

  --shadow-card: 0 1px 2px rgba(30, 58, 47, 0.06);
  --shadow-elevated: 0 8px 30px -12px rgba(30, 58, 47, 0.18);
}

.dark {
  --background: #14261d;
  --foreground: #f4f1e8;
  --card: #1c3227;
  --card-foreground: #f4f1e8;

  --primary: #3e9b6b;
  --primary-foreground: #0e1a14;
  --secondary: #22392e;
  --secondary-foreground: #f4f1e8;
  --muted: #22392e;
  --muted-foreground: #a9b5ac;
  --accent: #22392e;
  --accent-foreground: #f4f1e8;
  --destructive: #d8654f;
  --destructive-foreground: #14261d;
  --border: #2a4436;
  --input: #2a4436;
  --ring: #3e9b6b;

  --vera-forest: #dfe9e2;
  --vera-forest-deep: #14261d;
  --vera-emerald: #4db683;
  --vera-honey: #e0a458;
  --vera-honey-soft: #3a2f1e;
  --vera-coral: #e17a63;
  --vera-coral-soft: #3a2420;
  --vera-slate-info: #7fa0b3;
  --vera-sage: #22392e;
  --vera-ink: #f4f1e8;
  --vera-ink-soft: #a9b5ac;
  --whatsapp: #25d366;

  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-elevated: 0 8px 30px -12px rgba(0, 0, 0, 0.5);
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  html,
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  h1,
  h2,
  h3,
  .font-display {
    font-family: var(--font-display);
    letter-spacing: -0.01em;
  }
  .bg-card {
    box-shadow: var(--shadow-card);
  }
}
```

The dark-mode emerald (`#4db683`) is deliberately a touch brighter than the light-mode one (`#3e9b6b`) so it stays visibly "alive" against the deep green background per spec §2, instead of receding into it.

- [ ] **Step 2: Update `app/layout.tsx` with fonts and metadata**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vera — Panel de la clínica",
  description: "Recordatorios automáticos y expedientes para clínicas veterinarias.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

`suppressHydrationWarning` is required on `<html>` because Task 3's theme provider sets the `class` attribute (`dark`/light) on the client before hydration finishes — without it, React logs a benign but noisy warning every load.

- [ ] **Step 3: Verify the build picks up the tokens**

Create a temporary check inline in `app/page.tsx` (overwrite the placeholder from Task 1):

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="font-display text-4xl font-bold text-vera-forest">Vera</h1>
    </main>
  );
}
```

Run: `npm run build`
Expected: build succeeds (`✓ Compiled successfully`), no CSS errors about unknown `--vera-emerald` value.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Vera design tokens, dark mode variables, and Fraunces/Inter fonts"
```

---

### Task 3: Dark mode provider and toggle

**Files:**
- Create: `components/theme-provider.tsx`
- Create: `components/theme-toggle.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `next-themes` package (Task 1 dependency).
- Produces: `<ThemeProvider>` wrapping the app; `<ThemeToggle />` component usable in Task 8's sidebar, exporting a default light theme with a persisted manual override.

- [ ] **Step 1: Write `components/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

`enableSystem={false}` is deliberate: the brief requires light mode by default regardless of the visitor's OS preference, with dark mode only reachable via an explicit toggle.

- [ ] **Step 2: Write `components/theme-toggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition-transform hover:scale-105"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
```

The `mounted` guard prevents a server/client mismatch: `next-themes` doesn't know the real theme until it reads `localStorage` in the browser, so we render an empty placeholder of the same size on the first server-rendered pass.

- [ ] **Step 3: Wrap the app in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vera — Panel de la clínica",
  description: "Recordatorios automáticos y expedientes para clínicas veterinarias.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify manually**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: page renders with hueso background. (The toggle itself has nowhere to live yet — it gets wired into the sidebar in Task 8. This step only confirms the provider doesn't break rendering.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add dark mode provider and toggle, defaulting to light theme"
```

---

### Task 4: shadcn/ui initialization and base primitives

**Files:**
- Create: `components.json` (generated by CLI)
- Create: `lib/utils.ts` (generated by CLI, provides `cn()`)
- Create: `components/ui/button.tsx`, `card.tsx`, `badge.tsx`, `tabs.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `select.tsx`, `switch.tsx`, `tooltip.tsx`, `sheet.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `avatar.tsx` (all generated by CLI)

**Interfaces:**
- Produces: `cn(...)` helper from `@/lib/utils`, and shadcn primitives imported as `@/components/ui/<name>` in every page task from Task 10 onward.

- [ ] **Step 1: Initialize shadcn/ui**

Run: `npx shadcn@latest init -d`
Expected: creates `components.json` and `lib/utils.ts`. If prompted interactively despite `-d` (defaults flag), accept: TypeScript yes, style "new-york" or default, base color "neutral", CSS variables yes, Tailwind config path `app/globals.css`, import alias `@/*`.

- [ ] **Step 2: Confirm `components.json` points at the right CSS file**

Read `components.json` and verify `"tailwind.css"` is `"app/globals.css"` and `"tailwind.baseColor"` doesn't overwrite the tokens written in Task 2. If the CLI appended its own `:root`/`.dark` blocks to `app/globals.css`, remove the CLI-generated color blocks and keep the Task 2 blocks — the CLI's generic gray palette must not replace Vera's tokens. The `@theme inline` mapping already declares shadcn's expected variable names (`--color-primary`, `--color-border`, etc.) pointing at Vera's tokens, so the CLI's own palette is redundant.

- [ ] **Step 3: Install base primitives**

Run: `npx shadcn@latest add button card badge tabs dialog dropdown-menu select switch tooltip sheet input textarea label avatar`
Expected: creates the corresponding files under `components/ui/`, and adds needed `@radix-ui/react-*` packages to `package.json`.

- [ ] **Step 4: Verify the project still type-checks**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: initialize shadcn/ui with base primitives"
```

---

### Task 5: Domain types and utility functions (with tests)

**Files:**
- Create: `lib/data/types.ts`
- Create: `lib/date.ts`
- Create: `lib/date.test.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: all domain types (`Paciente`, `Dueno`, `Visita`, `ServicioVisita`, `Recordatorio`, `Mensaje`, `Conversacion`, `Empleado`, `Estacion`, `SesionActiva`, `SalaEsperaItem`) imported by every seed/data file from Task 6 onward. Produces `edadTexto(fechaNacimiento: string): string`, `hoyISO(): string`, `addDaysISO(days: number): string`, `formatFechaCorta(iso: string): string` from `@/lib/date`.

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Write `lib/data/types.ts`**

```ts
export type Especie = "perro" | "gato" | "otro";

export type ServicioTipo =
  | "vacuna"
  | "desparasitacion"
  | "preventivo"
  | "consulta"
  | "cirugia"
  | "examen"
  | "control";

export type EstadoEsquema = "al_dia" | "falta" | "vencido";

export interface Dueno {
  id: string;
  nombre: string;
  whatsapp: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  especie: Especie;
  raza: string;
  sexo: "M" | "H";
  fechaNacimiento: string;
  fotoUrl: string;
  duenoId: string;
  esterilizado: boolean;
  vacunasCompletas: number;
  vacunasTotal: number;
  estadoEsquema: EstadoEsquema;
  faltaTexto?: string;
}

export interface ServicioVisita {
  id: string;
  pacienteId: string;
  tipo: ServicioTipo;
  producto: string;
  fecha: string;
  vet: string;
  aplicada: boolean;
}

export interface Visita {
  id: string;
  pacienteId: string;
  fechaOffsetDias: number;
  hora?: string;
  motivo: string;
  confirmada: boolean;
}

export interface Recordatorio {
  id: string;
  pacienteId: string;
  tipo: string;
  cuando: string;
  mensaje: string;
}

export interface Mensaje {
  id: string;
  autor: "vera" | "dueno";
  texto: string;
  hora: string;
}

export interface Conversacion {
  id: string;
  duenoNombre: string;
  pacienteId: string;
  pacienteNombre: string;
  ultimoMensaje: string;
  hora: string;
  estado: "enviado" | "respondido" | "agendado" | "sin_respuesta";
  mensajes: Mensaje[];
}

export type Rol = "vet" | "secretaria" | "groomer";

export interface Empleado {
  id: string;
  nombre: string;
  rol: Rol;
  inicial: string;
}

export interface Estacion {
  id: string;
  nombre: string;
  tipo: "consultorio" | "bano";
}

export interface SesionActiva {
  id: string;
  pacienteId: string;
  empleadoId: string;
  estacionId: string;
  motivo: string;
  inicio: string;
  tipo: "consulta" | "grooming";
}

export interface SalaEsperaItem {
  pacienteId: string;
  hora: string;
  motivo: string;
}
```

- [ ] **Step 3: Write `lib/date.ts`**

```ts
export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function edadTexto(fechaNacimiento: string): string {
  const nacida = new Date(fechaNacimiento);
  const meses = Math.floor(
    (Date.now() - nacida.getTime()) / (1000 * 60 * 60 * 24 * 30.44),
  );
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? "año" : "años"}`;
}

export function formatFechaCorta(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
  });
}
```

- [ ] **Step 4: Write the failing tests in `lib/date.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { addDaysISO, edadTexto, formatFechaCorta, hoyISO } from "./date";

describe("hoyISO", () => {
  it("returns today's date in YYYY-MM-DD format", () => {
    const result = hoyISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe(new Date().toISOString().slice(0, 10));
  });
});

describe("addDaysISO", () => {
  it("adds days relative to a fixed reference date", () => {
    const from = new Date("2026-07-20T12:00:00Z");
    expect(addDaysISO(0, from)).toBe("2026-07-20");
    expect(addDaysISO(5, from)).toBe("2026-07-25");
    expect(addDaysISO(-3, from)).toBe("2026-07-17");
  });

  it("rolls over month boundaries", () => {
    const from = new Date("2026-07-30T12:00:00Z");
    expect(addDaysISO(3, from)).toBe("2026-08-02");
  });
});

describe("edadTexto", () => {
  it("shows months for patients under a year old", () => {
    const twoMonthsAgo = addDaysISO(-60);
    expect(edadTexto(twoMonthsAgo)).toMatch(/mes/);
  });

  it("shows years for patients over a year old", () => {
    const threeYearsAgo = addDaysISO(-365 * 3);
    expect(edadTexto(threeYearsAgo)).toBe("3 años");
  });

  it("uses singular 'año' for exactly one year", () => {
    const oneYearAgo = addDaysISO(-365);
    expect(edadTexto(oneYearAgo)).toBe("1 año");
  });
});

describe("formatFechaCorta", () => {
  it("formats an ISO date as day + short month in Spanish", () => {
    expect(formatFechaCorta("2026-08-05")).toBe("5 ago");
  });
});
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run lib/date.test.ts`
Expected: all 6 tests PASS. (These are written test-first conceptually, but since `date.ts` and its test were authored together above, run them now to confirm correctness rather than watching them fail first — the implementation is trivial enough that there's no ambiguous behavior to pin down before writing it.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add domain types and date utilities with unit tests"
```

---

### Task 6: Mock seed data

**Files:**
- Create: `lib/data/seed/empleados.ts`
- Create: `lib/data/seed/estaciones.ts`
- Create: `lib/data/seed/duenos.ts`
- Create: `lib/data/seed/pacientes.ts`
- Create: `lib/data/seed/servicios.ts`
- Create: `lib/data/seed/visitas.ts`
- Create: `lib/data/seed/conversaciones.ts`
- Create: `lib/data/seed/recordatorios.ts`
- Create: `lib/data/seed/sala.ts`

**Interfaces:**
- Consumes: types from `@/lib/data/types` (Task 5).
- Produces: exported const arrays (`EMPLEADOS`, `ESTACIONES`, `DUENOS`, `PACIENTES`, `SERVICIOS`, `VISITAS`, `CONVERSACIONES`, `RECORDATORIOS`, `SESIONES_ACTIVAS`, `SALA_ESPERA`) consumed exclusively by `lib/data/*.ts` access functions in Task 7 — never imported directly by pages.

- [ ] **Step 1: Write `lib/data/seed/empleados.ts`**

```ts
import type { Empleado } from "@/lib/data/types";

export const EMPLEADOS: Empleado[] = [
  { id: "e1", nombre: "Dra. Ramírez", rol: "vet", inicial: "R" },
  { id: "e2", nombre: "Dr. Martínez", rol: "vet", inicial: "M" },
  { id: "e3", nombre: "Dr. Escobar", rol: "vet", inicial: "E" },
  { id: "e4", nombre: "Edgardo", rol: "groomer", inicial: "Ed" },
  { id: "e5", nombre: "Lucía", rol: "groomer", inicial: "L" },
  { id: "e6", nombre: "Karla", rol: "secretaria", inicial: "K" },
];
```

- [ ] **Step 2: Write `lib/data/seed/estaciones.ts`**

```ts
import type { Estacion } from "@/lib/data/types";

export const ESTACIONES: Estacion[] = [
  { id: "c1", nombre: "Consultorio 1", tipo: "consultorio" },
  { id: "c2", nombre: "Consultorio 2", tipo: "consultorio" },
  { id: "b1", nombre: "Baño 1", tipo: "bano" },
  { id: "b2", nombre: "Baño 2", tipo: "bano" },
];
```

- [ ] **Step 3: Write `lib/data/seed/duenos.ts`**

```ts
import type { Dueno } from "@/lib/data/types";

export const DUENOS: Dueno[] = [
  { id: "d1", nombre: "María López", whatsapp: "+503 7123 4567" },
  { id: "d2", nombre: "Carlos Menjívar", whatsapp: "+503 7234 5678" },
  { id: "d3", nombre: "Ana Portillo", whatsapp: "+503 7345 6789" },
  { id: "d4", nombre: "José Hernández", whatsapp: "+503 7456 7890" },
  { id: "d5", nombre: "Sofía Cruz", whatsapp: "+503 7567 8901" },
];
```

- [ ] **Step 4: Write `lib/data/seed/pacientes.ts`**

```ts
import type { Paciente } from "@/lib/data/types";

export const PACIENTES: Paciente[] = [
  {
    id: "p1",
    nombre: "Rocky",
    especie: "perro",
    raza: "Labrador",
    sexo: "M",
    fechaNacimiento: "2022-04-10",
    fotoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    duenoId: "d1",
    esterilizado: true,
    vacunasCompletas: 5,
    vacunasTotal: 5,
    estadoEsquema: "al_dia",
  },
  {
    id: "p2",
    nombre: "Luna",
    especie: "gato",
    raza: "Persa",
    sexo: "H",
    fechaNacimiento: "2025-04-20",
    fotoUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
    duenoId: "d2",
    esterilizado: false,
    vacunasCompletas: 1,
    vacunasTotal: 3,
    estadoEsquema: "falta",
    faltaTexto: "Falta 2ª dosis",
  },
  {
    id: "p3",
    nombre: "Max",
    especie: "perro",
    raza: "Schnauzer",
    sexo: "M",
    fechaNacimiento: "2018-08-15",
    fotoUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    duenoId: "d3",
    esterilizado: true,
    vacunasCompletas: 3,
    vacunasTotal: 5,
    estadoEsquema: "vencido",
    faltaTexto: "Refuerzo vencido",
  },
  {
    id: "p4",
    nombre: "Nala",
    especie: "perro",
    raza: "Criolla",
    sexo: "H",
    fechaNacimiento: "2023-01-05",
    fotoUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
    duenoId: "d4",
    esterilizado: true,
    vacunasCompletas: 5,
    vacunasTotal: 5,
    estadoEsquema: "al_dia",
    faltaTexto: "Control de sutura pendiente",
  },
  {
    id: "p5",
    nombre: "Milo",
    especie: "gato",
    raza: "Criollo",
    sexo: "M",
    fechaNacimiento: "2021-11-02",
    fotoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    duenoId: "d5",
    esterilizado: true,
    vacunasCompletas: 4,
    vacunasTotal: 4,
    estadoEsquema: "al_dia",
  },
  {
    id: "p6",
    nombre: "Toby",
    especie: "perro",
    raza: "Golden Retriever",
    sexo: "M",
    fechaNacimiento: "2024-10-01",
    fotoUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop",
    duenoId: "d1",
    esterilizado: false,
    vacunasCompletas: 2,
    vacunasTotal: 4,
    estadoEsquema: "falta",
    faltaTexto: "Falta 3ª dosis",
  },
];
```

- [ ] **Step 5: Write `lib/data/seed/servicios.ts`**

```ts
import type { ServicioVisita } from "@/lib/data/types";
import { addDaysISO } from "@/lib/date";

export const SERVICIOS: ServicioVisita[] = [
  { id: "s1", pacienteId: "p1", tipo: "vacuna", producto: "Séxtuple - 1ª dosis", fecha: addDaysISO(-400), vet: "Dra. Ramírez", aplicada: true },
  { id: "s2", pacienteId: "p1", tipo: "vacuna", producto: "Séxtuple - 2ª dosis", fecha: addDaysISO(-380), vet: "Dra. Ramírez", aplicada: true },
  { id: "s3", pacienteId: "p1", tipo: "vacuna", producto: "Rabia", fecha: addDaysISO(-350), vet: "Dra. Ramírez", aplicada: true },
  { id: "s4", pacienteId: "p1", tipo: "desparasitacion", producto: "Ivermectina", fecha: addDaysISO(-60), vet: "Dra. Ramírez", aplicada: true },
  { id: "s5", pacienteId: "p1", tipo: "vacuna", producto: "Refuerzo anual séxtuple", fecha: addDaysISO(-3), vet: "Dra. Ramírez", aplicada: true },
  { id: "s6", pacienteId: "p2", tipo: "vacuna", producto: "Triple felina - 1ª dosis", fecha: addDaysISO(-30), vet: "Dra. Ramírez", aplicada: true },
  { id: "s7", pacienteId: "p2", tipo: "desparasitacion", producto: "Ivermectina", fecha: addDaysISO(-30), vet: "Dra. Ramírez", aplicada: true },
  { id: "s8", pacienteId: "p4", tipo: "cirugia", producto: "Esterilización", fecha: addDaysISO(-45), vet: "Dra. Ramírez", aplicada: true },
  { id: "s9", pacienteId: "p4", tipo: "control", producto: "Control de sutura", fecha: addDaysISO(-35), vet: "Dra. Ramírez", aplicada: true },
];
```

- [ ] **Step 6: Write `lib/data/seed/visitas.ts`**

Dates are stored as **offsets in days from today** (`fechaOffsetDias`), resolved to real ISO dates only inside the access-layer functions (Task 7) — this is what keeps the demo perpetually fresh instead of hardcoding a stale date like the reference project's `HOY_ISO`.

```ts
import type { Visita } from "@/lib/data/types";

export const VISITAS: Visita[] = [
  { id: "v1", pacienteId: "p1", fechaOffsetDias: 0, hora: "09:00", motivo: "Refuerzo anual", confirmada: true },
  { id: "v2", pacienteId: "p2", fechaOffsetDias: 0, hora: "10:30", motivo: "2ª dosis séxtuple", confirmada: false },
  { id: "v3", pacienteId: "p4", fechaOffsetDias: 0, hora: "11:15", motivo: "Control de sutura", confirmada: true },
  { id: "v4", pacienteId: "p3", fechaOffsetDias: 0, hora: "14:00", motivo: "Consulta general", confirmada: false },
  { id: "v5", pacienteId: "p5", fechaOffsetDias: 0, hora: "15:30", motivo: "Antipulgas mensual", confirmada: true },
  { id: "v6", pacienteId: "p6", fechaOffsetDias: 0, hora: "16:00", motivo: "3ª dosis séxtuple", confirmada: false },
  { id: "v10", pacienteId: "p2", fechaOffsetDias: 1, hora: "09:30", motivo: "Control post-vacuna", confirmada: false },
  { id: "v11", pacienteId: "p6", fechaOffsetDias: 3, hora: "10:00", motivo: "3ª dosis séxtuple", confirmada: false },
  { id: "v12", pacienteId: "p3", fechaOffsetDias: 3, hora: "15:00", motivo: "Refuerzo anual (vencido)", confirmada: false },
  { id: "v13", pacienteId: "p1", fechaOffsetDias: 5, hora: "11:00", motivo: "Desparasitación", confirmada: true },
  { id: "v14", pacienteId: "p5", fechaOffsetDias: 6, hora: "16:30", motivo: "Consulta dermatológica", confirmada: false },
  { id: "v15", pacienteId: "p4", fechaOffsetDias: 7, hora: "09:00", motivo: "Retiro de puntos", confirmada: true },
  { id: "v16", pacienteId: "p2", fechaOffsetDias: 10, hora: "10:00", motivo: "Triple felina 3ª dosis", confirmada: false },
  { id: "v17", pacienteId: "p6", fechaOffsetDias: 12, hora: "14:30", motivo: "Control de peso", confirmada: false },
  { id: "v18", pacienteId: "p1", fechaOffsetDias: 14, hora: "09:00", motivo: "Baño medicado", confirmada: true },
  { id: "v19", pacienteId: "p3", fechaOffsetDias: 17, hora: "11:00", motivo: "Consulta seguimiento", confirmada: false },
  { id: "v20", pacienteId: "p5", fechaOffsetDias: 19, hora: "15:00", motivo: "Antipulgas mensual", confirmada: true },
];
```

- [ ] **Step 7: Write `lib/data/seed/conversaciones.ts`**

```ts
import type { Conversacion } from "@/lib/data/types";

export const CONVERSACIONES: Conversacion[] = [
  {
    id: "c1",
    duenoNombre: "María López",
    pacienteId: "p1",
    pacienteNombre: "Rocky",
    ultimoMensaje: "Sí, confirmado 👍",
    hora: "8:42 AM",
    estado: "agendado",
    mensajes: [
      { id: "m1", autor: "vera", texto: "¡Hola, María! 👋 Le recordamos la cita de Rocky mañana a las 9:00 AM para su refuerzo anual. ¿Confirma?", hora: "8:40 AM" },
      { id: "m2", autor: "dueno", texto: "Sí, confirmado 👍", hora: "8:42 AM" },
      { id: "m3", autor: "vera", texto: "¡Perfecto! La esperamos. Que tenga buen día.", hora: "8:42 AM" },
    ],
  },
  {
    id: "c2",
    duenoNombre: "Carlos Menjívar",
    pacienteId: "p2",
    pacienteNombre: "Luna",
    ultimoMensaje: "Ok, ahí llego mañana",
    hora: "10:15 AM",
    estado: "respondido",
    mensajes: [
      { id: "m4", autor: "vera", texto: "¡Hola, Carlos! 👋 A Luna le toca su 2ª dosis mañana a las 10:30 AM. ¿Puede venir?", hora: "10:10 AM" },
      { id: "m5", autor: "dueno", texto: "Ok, ahí llego mañana", hora: "10:15 AM" },
    ],
  },
  {
    id: "c3",
    duenoNombre: "Ana Portillo",
    pacienteId: "p3",
    pacienteNombre: "Max",
    ultimoMensaje: "¿Cuánto cuesta el refuerzo?",
    hora: "Ayer",
    estado: "sin_respuesta",
    mensajes: [
      { id: "m6", autor: "vera", texto: "¡Hola, Ana! 👋 El refuerzo anual de Max está vencido. ¿Le agendamos cita esta semana?", hora: "Ayer" },
      { id: "m7", autor: "dueno", texto: "¿Cuánto cuesta el refuerzo?", hora: "Ayer" },
    ],
  },
];
```

- [ ] **Step 8: Write `lib/data/seed/recordatorios.ts`**

```ts
import type { Recordatorio } from "@/lib/data/types";

export const RECORDATORIOS: Recordatorio[] = [
  { id: "r1", pacienteId: "p1", tipo: "Recordatorio de cita", cuando: "Hoy 5:00 PM", mensaje: "Le recordamos la cita de Rocky mañana." },
  { id: "r2", pacienteId: "p6", tipo: "3ª dosis séxtuple", cuando: "Mañana 9:00 AM", mensaje: "A Toby le toca su 3ª dosis." },
  { id: "r3", pacienteId: "p3", tipo: "Refuerzo vencido", cuando: "Miércoles 10:00 AM", mensaje: "El refuerzo anual de Max está pendiente." },
  { id: "r4", pacienteId: "p5", tipo: "Antipulgas mensual", cuando: "Viernes 9:00 AM", mensaje: "Es momento del antipulgas de Milo." },
];
```

- [ ] **Step 9: Write `lib/data/seed/sala.ts`**

```ts
import type { SesionActiva, SalaEsperaItem } from "@/lib/data/types";

export const SESIONES_ACTIVAS: SesionActiva[] = [
  { id: "sa1", pacienteId: "p3", empleadoId: "e2", estacionId: "c1", motivo: "Consulta general", inicio: "09:40", tipo: "consulta" },
  { id: "sa2", pacienteId: "p5", empleadoId: "e3", estacionId: "c2", motivo: "Antipulgas mensual", inicio: "09:55", tipo: "consulta" },
  { id: "sa3", pacienteId: "p6", empleadoId: "e4", estacionId: "b1", motivo: "Baño + corte", inicio: "09:20", tipo: "grooming" },
  { id: "sa4", pacienteId: "p1", empleadoId: "e5", estacionId: "b2", motivo: "Baño medicado", inicio: "09:35", tipo: "grooming" },
];

export const SALA_ESPERA: SalaEsperaItem[] = [
  { pacienteId: "p2", hora: "10:30", motivo: "2ª dosis séxtuple" },
  { pacienteId: "p4", hora: "11:15", motivo: "Control de sutura" },
];
```

- [ ] **Step 10: Verify the project type-checks**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add mock seed data for all Vera domain entities"
```

---

### Task 7: Data access layer (with tests)

**Files:**
- Create: `lib/data/pacientes.ts`
- Create: `lib/data/pacientes.test.ts`
- Create: `lib/data/visitas.ts`
- Create: `lib/data/visitas.test.ts`
- Create: `lib/data/recordatorios.ts`
- Create: `lib/data/sala.ts`

**Interfaces:**
- Consumes: seed arrays from Task 6, `addDaysISO`/`hoyISO` from Task 5.
- Produces: `getPacientes()`, `getPaciente(id)`, `getDueno(id)`, `getPendientesVacunas()`, `getServiciosPorPaciente(id)`, `getVisitasHoy()`, `getVisitasProximas()`, `getVisitasPorPaciente(id)`, `getRecordatoriosProgramados()`, `getConversaciones()`, `getConversacion(id)`, `getSesionesActivas()`, `getSalaEspera()`, `getEstaciones()`, `getEmpleados()`, `getEmpleado(id)`, `getEstacion(id)` — every one an `async function` returning a resolved value, matching the shape a future `fetch("/api/...")` call would have.

- [ ] **Step 1: Write `lib/data/pacientes.ts`**

```ts
import { PACIENTES } from "@/lib/data/seed/pacientes";
import { DUENOS } from "@/lib/data/seed/duenos";
import { SERVICIOS } from "@/lib/data/seed/servicios";
import type { Paciente, Dueno, ServicioVisita } from "@/lib/data/types";

export async function getPacientes(): Promise<Paciente[]> {
  return PACIENTES;
}

export async function getPaciente(id: string): Promise<Paciente | undefined> {
  return PACIENTES.find((p) => p.id === id);
}

export async function getDueno(id: string): Promise<Dueno | undefined> {
  return DUENOS.find((d) => d.id === id);
}

export async function getServiciosPorPaciente(pacienteId: string): Promise<ServicioVisita[]> {
  return SERVICIOS.filter((s) => s.pacienteId === pacienteId);
}

const URGENCIA_ORDEN = { vencido: 0, falta: 1, al_dia: 2 } as const;

export async function getPendientesVacunas(): Promise<Paciente[]> {
  return [...PACIENTES]
    .filter((p) => p.estadoEsquema !== "al_dia")
    .sort((a, b) => URGENCIA_ORDEN[a.estadoEsquema] - URGENCIA_ORDEN[b.estadoEsquema]);
}
```

- [ ] **Step 2: Write the tests in `lib/data/pacientes.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getPaciente, getPacientes, getPendientesVacunas, getServiciosPorPaciente } from "./pacientes";

describe("getPacientes", () => {
  it("returns all seeded patients", async () => {
    const result = await getPacientes();
    expect(result.length).toBeGreaterThan(0);
    expect(result.find((p) => p.nombre === "Rocky")).toBeDefined();
  });
});

describe("getPaciente", () => {
  it("finds a patient by id", async () => {
    const result = await getPaciente("p1");
    expect(result?.nombre).toBe("Rocky");
  });

  it("returns undefined for an unknown id", async () => {
    const result = await getPaciente("does-not-exist");
    expect(result).toBeUndefined();
  });
});

describe("getServiciosPorPaciente", () => {
  it("returns only services for the requested patient", async () => {
    const result = await getServiciosPorPaciente("p1");
    expect(result.every((s) => s.pacienteId === "p1")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns an empty array for a patient with no services", async () => {
    const result = await getServiciosPorPaciente("p6");
    expect(result).toEqual([]);
  });
});

describe("getPendientesVacunas", () => {
  it("excludes patients who are al_dia", async () => {
    const result = await getPendientesVacunas();
    expect(result.every((p) => p.estadoEsquema !== "al_dia")).toBe(true);
  });

  it("sorts vencido before falta", async () => {
    const result = await getPendientesVacunas();
    const indices = result.map((p) => p.estadoEsquema);
    const firstFalta = indices.indexOf("falta");
    const firstVencido = indices.indexOf("vencido");
    if (firstFalta !== -1 && firstVencido !== -1) {
      expect(firstVencido).toBeLessThan(firstFalta);
    }
  });
});
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run lib/data/pacientes.test.ts`
Expected: all tests PASS.

- [ ] **Step 4: Write `lib/data/visitas.ts`**

```ts
import { VISITAS } from "@/lib/data/seed/visitas";
import { addDaysISO } from "@/lib/date";
import type { Visita } from "@/lib/data/types";

export interface VisitaResuelta extends Visita {
  fecha: string;
}

function resolver(v: Visita): VisitaResuelta {
  return { ...v, fecha: addDaysISO(v.fechaOffsetDias) };
}

export async function getVisitasHoy(): Promise<VisitaResuelta[]> {
  return VISITAS.filter((v) => v.fechaOffsetDias === 0).map(resolver);
}

export async function getVisitasProximas(): Promise<VisitaResuelta[]> {
  return VISITAS.map(resolver).sort((a, b) => (a.fecha + (a.hora ?? "")).localeCompare(b.fecha + (b.hora ?? "")));
}

export async function getVisitasPorPaciente(pacienteId: string): Promise<VisitaResuelta[]> {
  return VISITAS.filter((v) => v.pacienteId === pacienteId)
    .map(resolver)
    .sort((a, b) => (a.fecha + (a.hora ?? "")).localeCompare(b.fecha + (b.hora ?? "")));
}
```

- [ ] **Step 5: Write the tests in `lib/data/visitas.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { hoyISO } from "@/lib/date";
import { getVisitasHoy, getVisitasPorPaciente, getVisitasProximas } from "./visitas";

describe("getVisitasHoy", () => {
  it("only returns visits with offset 0, resolved to today's real date", async () => {
    const result = await getVisitasHoy();
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((v) => v.fecha === hoyISO())).toBe(true);
  });
});

describe("getVisitasProximas", () => {
  it("returns visits sorted chronologically", async () => {
    const result = await getVisitasProximas();
    const fechas = result.map((v) => v.fecha + (v.hora ?? ""));
    const sorted = [...fechas].sort();
    expect(fechas).toEqual(sorted);
  });
});

describe("getVisitasPorPaciente", () => {
  it("filters visits to a single patient", async () => {
    const result = await getVisitasPorPaciente("p1");
    expect(result.every((v) => v.pacienteId === "p1")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run lib/data/visitas.test.ts`
Expected: all tests PASS.

- [ ] **Step 7: Write `lib/data/recordatorios.ts`**

```ts
import { RECORDATORIOS } from "@/lib/data/seed/recordatorios";
import { CONVERSACIONES } from "@/lib/data/seed/conversaciones";
import type { Recordatorio, Conversacion } from "@/lib/data/types";

export async function getRecordatoriosProgramados(): Promise<Recordatorio[]> {
  return RECORDATORIOS;
}

export async function getConversaciones(): Promise<Conversacion[]> {
  return CONVERSACIONES;
}

export async function getConversacion(id: string): Promise<Conversacion | undefined> {
  return CONVERSACIONES.find((c) => c.id === id);
}
```

- [ ] **Step 8: Write `lib/data/sala.ts`**

```ts
import { SESIONES_ACTIVAS, SALA_ESPERA } from "@/lib/data/seed/sala";
import { ESTACIONES } from "@/lib/data/seed/estaciones";
import { EMPLEADOS } from "@/lib/data/seed/empleados";
import type { SesionActiva, SalaEsperaItem, Estacion, Empleado } from "@/lib/data/types";

export async function getSesionesActivas(): Promise<SesionActiva[]> {
  return SESIONES_ACTIVAS;
}

export async function getSalaEspera(): Promise<SalaEsperaItem[]> {
  return SALA_ESPERA;
}

export async function getEstaciones(): Promise<Estacion[]> {
  return ESTACIONES;
}

export async function getEstacion(id: string): Promise<Estacion | undefined> {
  return ESTACIONES.find((e) => e.id === id);
}

export async function getEmpleados(): Promise<Empleado[]> {
  return EMPLEADOS;
}

export async function getEmpleado(id: string): Promise<Empleado | undefined> {
  return EMPLEADOS.find((e) => e.id === id);
}
```

- [ ] **Step 9: Run the full test suite**

Run: `npm test`
Expected: all test files pass (date.test.ts, pacientes.test.ts, visitas.test.ts).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add async data access layer shaped after the future Django API"
```

---

### Task 8: AppShell — Sidebar and mobile navigation

**Files:**
- Create: `components/app-shell/nav-items.ts`
- Create: `components/app-shell/sidebar.tsx`
- Create: `components/app-shell/mobile-nav.tsx`
- Create: `components/app-shell/app-shell.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` (Task 3), `cn` (Task 4).
- Produces: `<AppShell>{children}</AppShell>` consumed by the `(dashboard)` route group layout in Task 11.

- [ ] **Step 1: Write `components/app-shell/nav-items.ts`**

```ts
import type { LucideIcon } from "lucide-react";
import { BarChart3, Bell, CalendarDays, Home, LayoutGrid, PawPrint, PlusCircle, Syringe } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/recordatorios", label: "Recordatorios", icon: Bell },
  { href: "/pacientes", label: "Pacientes", icon: PawPrint },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/vacunas", label: "Vacunas", icon: Syringe },
  { href: "/sala", label: "Sala", icon: LayoutGrid },
  { href: "/registrar", label: "Registrar", icon: PlusCircle },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
];
```

- [ ] **Step 2: Write `components/app-shell/sidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-primary text-primary-foreground lg:flex">
      <div className="flex items-center gap-2.5 px-6 pb-6 pt-8">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-vera-emerald text-primary">
          <span className="font-display text-[15px] font-bold">V</span>
        </div>
        <span className="font-display text-lg font-bold tracking-tight">Vera</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                active ? "bg-vera-emerald/20 text-primary-foreground" : "text-primary-foreground/70 hover:bg-white/5",
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
        <span className="text-xs text-primary-foreground/60">Vet. San Rafael</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Write `components/app-shell/mobile-nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

const MOBILE_ITEMS = NAV_ITEMS.slice(0, 5);

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card lg:hidden">
      <div className="grid grid-cols-5">
        {MOBILE_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                active ? "text-vera-emerald" : "text-muted-foreground",
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Write `components/app-shell/app-shell.tsx`**

```tsx
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1200px] px-4 pb-28 pt-6 lg:px-10 lg:pb-10 lg:pt-10">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
```

- [ ] **Step 5: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add AppShell with desktop sidebar and mobile bottom nav"
```

---

### Task 9: Shared display components

**Files:**
- Create: `components/shared/metric-hero.tsx`
- Create: `components/shared/urgency-badge.tsx`
- Create: `components/shared/whatsapp-bubble.tsx`
- Create: `components/shared/reminder-queue-item.tsx`
- Create: `components/shared/vaccine-timeline.tsx`

**Interfaces:**
- Consumes: `cn` (Task 4), `EstadoEsquema`/`ServicioVisita`/`Paciente` types (Task 5).
- Produces: components imported by pages from Task 12 onward — `<MetricHero label value hint? />`, `<UrgencyBadge estado>`, `<WhatsAppBubble autor texto hora />`, `<ReminderQueueItem recordatorio paciente onTogglePause onEdit />`, `<VaccineTimeline servicios vacunasCompletas vacunasTotal />`.

- [ ] **Step 1: Write `components/shared/metric-hero.tsx`**

```tsx
interface MetricHeroProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function MetricHero({ label, value, hint }: MetricHeroProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold tabular-nums tracking-tight text-vera-forest lg:text-6xl">
          {value}
        </span>
        {hint && <span className="text-sm text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/shared/urgency-badge.tsx`**

```tsx
import type { EstadoEsquema } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const STYLES: Record<EstadoEsquema, string> = {
  vencido: "bg-vera-coral-soft text-vera-coral",
  falta: "bg-vera-honey-soft text-vera-honey",
  al_dia: "bg-vera-sage text-vera-emerald",
};

const LABELS: Record<EstadoEsquema, string> = {
  vencido: "Vencido",
  falta: "Falta vacuna",
  al_dia: "Al día",
};

export function UrgencyBadge({ estado, texto }: { estado: EstadoEsquema; texto?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", STYLES[estado])}>
      {texto ?? LABELS[estado]}
    </span>
  );
}
```

- [ ] **Step 3: Write `components/shared/whatsapp-bubble.tsx`**

```tsx
import type { Mensaje } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function WhatsAppBubble({ mensaje }: { mensaje: Mensaje }) {
  const esDueno = mensaje.autor === "dueno";
  return (
    <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug", esDueno ? "ml-auto bg-vera-sage" : "bg-muted")}>
      <p>{mensaje.texto}</p>
      <span className="mt-1 block text-[11px] text-muted-foreground">{mensaje.hora}</span>
    </div>
  );
}
```

- [ ] **Step 4: Write `components/shared/reminder-queue-item.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Edit3, MessageCircle, Pause, Play, X } from "lucide-react";
import type { Recordatorio } from "@/lib/data/types";

interface Props {
  recordatorio: Recordatorio;
  pacienteNombre: string;
  fotoUrl?: string;
}

export function ReminderQueueItem({ recordatorio, pacienteNombre, fotoUrl }: Props) {
  const [pausado, setPausado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(recordatorio.mensaje);

  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      {fotoUrl ? (
        <img src={fotoUrl} alt={pacienteNombre} className="h-10 w-10 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-sm font-bold">{pacienteNombre}</span>
          <span className="text-xs text-muted-foreground">· {recordatorio.tipo}</span>
          <span className={pausado ? "ml-auto text-xs font-medium text-vera-honey" : "ml-auto text-xs font-medium text-vera-emerald"}>
            {recordatorio.cuando}
          </span>
        </div>

        {editando ? (
          <div className="mt-2 flex items-start gap-2">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={2}
              className="min-h-11 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-base outline-none focus:border-primary md:text-sm"
            />
            <button
              onClick={() => setEditando(false)}
              className="min-h-11 rounded-xl bg-vera-emerald px-3 py-2 text-xs font-semibold text-white"
            >
              Guardar
            </button>
          </div>
        ) : (
          <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
            <MessageCircle size={12} className="mt-0.5 shrink-0 text-whatsapp" />
            {texto}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3 text-xs">
          <button
            onClick={() => setPausado((v) => !v)}
            className="inline-flex items-center gap-1 font-medium hover:underline"
          >
            {pausado ? <Play size={12} /> : <Pause size={12} />}
            {pausado ? "Reanudar" : "Pausar"}
          </button>
          <button
            onClick={() => setEditando((v) => !v)}
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
          >
            {editando ? <X size={12} /> : <Edit3 size={12} />}
            {editando ? "Cancelar" : "Editar mensaje"}
          </button>
        </div>
      </div>
    </li>
  );
}
```

- [ ] **Step 5: Write `components/shared/vaccine-timeline.tsx`**

```tsx
import { Check, Syringe } from "lucide-react";
import type { ServicioVisita } from "@/lib/data/types";
import { formatFechaCorta } from "@/lib/date";

interface Props {
  servicios: ServicioVisita[];
  vacunasCompletas: number;
  vacunasTotal: number;
}

export function VaccineTimeline({ servicios, vacunasCompletas, vacunasTotal }: Props) {
  const vacunas = servicios.filter((s) => s.tipo === "vacuna");
  const pendientes = Math.max(vacunasTotal - vacunasCompletas, 0);

  return (
    <ol className="relative ml-3 space-y-5 border-l-2 border-border pl-6">
      {vacunas.map((v) => (
        <li key={v.id} className="relative">
          <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-vera-emerald text-white">
            <Check size={13} />
          </span>
          <div className="font-display text-sm font-bold">{v.producto}</div>
          <div className="text-xs text-muted-foreground">{formatFechaCorta(v.fecha)} · {v.vet}</div>
        </li>
      ))}
      {Array.from({ length: pendientes }).map((_, i) => (
        <li key={`pendiente-${i}`} className="relative opacity-70">
          <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full border-2 border-dashed border-vera-honey bg-card text-vera-honey">
            <Syringe size={12} />
          </span>
          <div className="font-display text-sm font-bold text-vera-honey">Dosis pendiente</div>
          <div className="text-xs text-muted-foreground">Por programar</div>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 6: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add shared display components (MetricHero, UrgencyBadge, WhatsAppBubble, ReminderQueueItem, VaccineTimeline)"
```

---

### Task 10: Login page

**Files:**
- Create: `app/login/page.tsx`

**Interfaces:**
- Consumes: shadcn `Button`, `Input`, `Label` (Task 4).
- Produces: `/login` route, standalone (no `AppShell`), submitting redirects to `/`.

- [ ] **Step 1: Write `app/login/page.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-vera-emerald text-white">
            <span className="font-display text-lg font-bold">V</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-vera-forest">Bienvenido a Vera</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ingresa para ver tu clínica</p>
        </div>

        <form action="/" className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" placeholder="tu@clinica.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="min-h-11 w-full bg-vera-emerald text-white hover:bg-vera-emerald/90">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="underline hover:text-foreground">
            Continuar como invitado (demo)
          </Link>
        </p>
      </div>
    </main>
  );
}
```

`action="/"` is a plain HTML form submission (no client JS, no real auth) — matches spec §10 ("login es visual/simulado").

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/login`.
Expected: form renders, no sidebar visible, submitting redirects to `/`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add simulated login page"
```

---

### Task 11: Dashboard route group layout

**Files:**
- Create: `app/(dashboard)/layout.tsx`
- Modify: `app/page.tsx` (delete — moves to `app/(dashboard)/page.tsx` in Task 12)

**Interfaces:**
- Consumes: `AppShell` (Task 8).
- Produces: every route placed under `app/(dashboard)/` automatically renders inside `<AppShell>`.

- [ ] **Step 1: Write `app/(dashboard)/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

- [ ] **Step 2: Delete the placeholder root page**

Run: `rm app/page.tsx`
(Task 12 creates `app/(dashboard)/page.tsx`, which maps to the same `/` URL since route groups don't add a path segment.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add dashboard route group layout wrapping routes in AppShell"
```

(This commit will show `app/page.tsx` deleted and no new page yet — that's expected and gets filled by Task 12 immediately after. If your workflow prefers, squash Tasks 11 and 12's commits; otherwise leave as-is, since each is independently revertable.)

---

### Task 12: Inicio page

**Files:**
- Create: `app/(dashboard)/page.tsx`

**Interfaces:**
- Consumes: `getVisitasHoy` (Task 7), `getPendientesVacunas` (Task 7), `getConversaciones` (Task 7), `getPaciente`/`getDueno` (Task 7), `MetricHero` (Task 9), `UrgencyBadge` (Task 9), `WhatsAppBubble` (Task 9).

- [ ] **Step 1: Write `app/(dashboard)/page.tsx`**

```tsx
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { MetricHero } from "@/components/shared/metric-hero";
import { UrgencyBadge } from "@/components/shared/urgency-badge";
import { WhatsAppBubble } from "@/components/shared/whatsapp-bubble";
import { getPaciente, getDueno } from "@/lib/data/pacientes";
import { getVisitasHoy } from "@/lib/data/visitas";
import { getConversaciones } from "@/lib/data/recordatorios";

export default async function InicioPage() {
  const visitasHoy = await getVisitasHoy();
  const conversaciones = await getConversaciones();
  const conv = conversaciones[0];

  const visitasConDatos = await Promise.all(
    visitasHoy.map(async (v) => ({
      visita: v,
      paciente: await getPaciente(v.pacienteId),
      dueno: await getDueno((await getPaciente(v.pacienteId))?.duenoId ?? ""),
    })),
  );

  const sinConfirmar = visitasHoy.filter((v) => !v.confirmada).length;

  return (
    <div>
      <header className="pb-8">
        <p className="text-sm font-medium text-muted-foreground">
          {new Date().toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-vera-forest lg:text-4xl">Buenos días, Dra. Ramírez</h1>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricHero label="Clientes recuperados" value={23} hint="este mes" />
        <MetricHero label="Recordatorios enviados" value={8} hint="hoy" />
        <MetricHero label="Citas confirmadas" value={visitasHoy.length - sinConfirmar} hint={`de ${visitasHoy.length}`} />
        <MetricHero label="Ingresos recuperados" value="$487" hint="este mes" />
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Pacientes que vuelven esta semana</h2>
          <ul className="space-y-3">
            {visitasConDatos.map(({ visita, paciente, dueno }) => (
              <li key={visita.id}>
                <Link
                  href={`/pacientes/${paciente?.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-[var(--shadow-elevated)]"
                >
                  {paciente && <img src={paciente.fotoUrl} alt={paciente.nombre} className="h-14 w-14 rounded-full object-cover" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-base font-bold">{paciente?.nombre}</span>
                      <span className="truncate text-xs text-muted-foreground">· {dueno?.nombre}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{visita.motivo}</p>
                  </div>
                  {paciente && paciente.estadoEsquema !== "al_dia" && (
                    <UrgencyBadge estado={paciente.estadoEsquema} texto={paciente.faltaTexto} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-whatsapp">
              <MessageCircle size={12} className="text-white" />
            </span>
            <h3 className="font-display text-sm font-bold">Vera responde</h3>
          </div>
          <p className="mb-2 text-xs text-muted-foreground">{conv.duenoNombre} · sobre {conv.pacienteNombre}</p>
          <div className="space-y-1.5">
            {conv.mensajes.map((m) => (
              <WhatsAppBubble key={m.id} mensaje={m} />
            ))}
          </div>
          <Link
            href="/recordatorios"
            className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-vera-emerald hover:bg-secondary"
          >
            Ver todas las conversaciones <ArrowUpRight size={13} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/`.
Expected: sidebar visible, greeting, 4 metric cards, patient list, WhatsApp panel all render without errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Inicio dashboard page"
```

---

### Task 13: Pacientes list page

**Files:**
- Create: `app/(dashboard)/pacientes/page.tsx`

**Interfaces:**
- Consumes: `getPacientes`, `getDueno` (Task 7), `UrgencyBadge` (Task 9), `edadTexto` (Task 5).

- [ ] **Step 1: Write `app/(dashboard)/pacientes/page.tsx`**

```tsx
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { getPacientes, getDueno } from "@/lib/data/pacientes";
import { UrgencyBadge } from "@/components/shared/urgency-badge";
import { edadTexto } from "@/lib/date";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

export default async function PacientesPage() {
  const pacientes = await getPacientes();
  const conDuenos = await Promise.all(
    pacientes.map(async (p) => ({ paciente: p, dueno: await getDueno(p.duenoId) })),
  );

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Pacientes</h1>
        <p className="mt-1 text-sm text-muted-foreground">{pacientes.length} en la clínica</p>
      </header>

      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4">
        <Search size={16} className="text-muted-foreground" />
        <input
          placeholder="Buscar por paciente o dueño…"
          className="min-h-12 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {conDuenos.map(({ paciente, dueno }) => (
          <li key={paciente.id}>
            <Link
              href={`/pacientes/${paciente.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
            >
              <img src={paciente.fotoUrl} alt={paciente.nombre} className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-base font-bold">{paciente.nombre}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {edadTexto(paciente.fechaNacimiento)} · {dueno?.nombre}
                </div>
              </div>
              {paciente.estadoEsquema !== "al_dia" && (
                <UrgencyBadge estado={paciente.estadoEsquema} texto={paciente.faltaTexto} />
              )}
              <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Search is presentational-only in this phase (no client-side filtering wired) — that interactivity is optional polish, not required by spec §6.4, and can be added later without changing the page's structure.

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/pacientes`.
Expected: list of 6 patients with photos, badges on the 3 non-"al_dia" patients.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Pacientes list page"
```

---

### Task 14: Pacientes detail (expediente) page

**Files:**
- Create: `app/(dashboard)/pacientes/[id]/page.tsx`
- Create: `app/(dashboard)/pacientes/[id]/not-found.tsx`

**Interfaces:**
- Consumes: `getPaciente`, `getDueno`, `getServiciosPorPaciente` (Task 7), `getVisitasPorPaciente` (Task 7), `VaccineTimeline` (Task 9), `edadTexto`/`formatFechaCorta` (Task 5).

- [ ] **Step 1: Write `app/(dashboard)/pacientes/[id]/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, MessageCircle } from "lucide-react";
import { getPaciente, getDueno, getServiciosPorPaciente } from "@/lib/data/pacientes";
import { getVisitasPorPaciente } from "@/lib/data/visitas";
import { VaccineTimeline } from "@/components/shared/vaccine-timeline";
import { edadTexto, formatFechaCorta } from "@/lib/date";

const ESPECIE_LABEL = { perro: "Perro", gato: "Gato", otro: "Otro" } as const;

export default async function ExpedientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await getPaciente(id);
  if (!paciente) notFound();

  const dueno = await getDueno(paciente.duenoId);
  const servicios = await getServiciosPorPaciente(paciente.id);
  const proximas = (await getVisitasPorPaciente(paciente.id)).filter((v) => v.fecha >= new Date().toISOString().slice(0, 10));

  return (
    <div>
      <Link href="/pacientes" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeft size={14} /> Pacientes
      </Link>

      <section className="flex flex-wrap items-center gap-6 pb-6">
        <img src={paciente.fotoUrl} alt={paciente.nombre} className="h-24 w-24 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold text-vera-forest">{paciente.nombre}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ESPECIE_LABEL[paciente.especie]} · {paciente.raza} · {edadTexto(paciente.fechaNacimiento)} · {paciente.sexo === "M" ? "Macho" : "Hembra"}
          </p>
          <p className="mt-2 text-sm">
            Dueño: <span className="font-semibold">{dueno?.nombre}</span>{" "}
            <span className="text-muted-foreground">· {dueno?.whatsapp}</span>
          </p>
        </div>
        <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-white">
          <MessageCircle size={16} /> Escribir a {dueno?.nombre.split(" ")[0]}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Ciclo de vacunación</h2>
          <div className="rounded-2xl border border-border bg-card p-6">
            <VaccineTimeline servicios={servicios} vacunasCompletas={paciente.vacunasCompletas} vacunasTotal={paciente.vacunasTotal} />
          </div>

          <h2 className="mb-3 mt-8 font-display text-lg font-bold">Historial clínico</h2>
          <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {servicios.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Sin visitas registradas.</li>}
            {servicios.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-bold">{s.producto}</div>
                  <div className="text-xs text-muted-foreground">{formatFechaCorta(s.fecha)} · {s.vet}</div>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.tipo}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display text-sm font-bold">Próximas visitas</h3>
            {proximas.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">Sin visitas programadas.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {proximas.slice(0, 5).map((v) => (
                  <li key={v.id} className="text-sm">
                    <div className="font-medium">{v.motivo}</div>
                    <div className="text-xs text-muted-foreground">{formatFechaCorta(v.fecha)}{v.hora ? ` · ${v.hora}` : ""}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href={`/carnet/${paciente.id}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:bg-secondary/50"
          >
            <div>
              <div className="font-display text-sm font-bold">Carnet del dueño</div>
              <div className="text-xs text-muted-foreground">Lo que ve {dueno?.nombre.split(" ")[0]}</div>
            </div>
            <ExternalLink size={16} className="text-vera-emerald" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/(dashboard)/pacientes/[id]/not-found.tsx`**

```tsx
export default function PacienteNotFound() {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <p className="font-display text-xl font-bold">Paciente no encontrado</p>
      <p className="mt-2 text-sm text-muted-foreground">Revisa el enlace o vuelve a la lista de pacientes.</p>
    </div>
  );
}
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/pacientes/p1` and `http://localhost:3000/pacientes/does-not-exist`.
Expected: `p1` shows Rocky's timeline and history; the unknown id shows the not-found message.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add patient detail page with vaccine timeline"
```

---

### Task 15: Agenda page (weekly calendar)

**Files:**
- Create: `app/(dashboard)/agenda/page.tsx`

**Interfaces:**
- Consumes: `getVisitasProximas` (Task 7), `getPaciente`/`getDueno` (Task 7).

- [ ] **Step 1: Write `app/(dashboard)/agenda/page.tsx`**

```tsx
import { getVisitasProximas } from "@/lib/data/visitas";
import { getPaciente, getDueno } from "@/lib/data/pacientes";
import { hoyISO } from "@/lib/date";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function inicioSemana(iso: string): Date {
  const d = new Date(`${iso}T12:00:00`);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return d;
}

export default async function AgendaPage() {
  const visitas = await getVisitasProximas();
  const hoy = hoyISO();
  const inicio = inicioSemana(hoy);
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const porFecha = new Map<string, typeof visitas>();
  for (const v of visitas) {
    porFecha.set(v.fecha, [...(porFecha.get(v.fecha) ?? []), v]);
  }

  const visitasConDatos = await Promise.all(
    dias.map(async (fecha) => ({
      fecha,
      citas: await Promise.all(
        (porFecha.get(fecha) ?? []).map(async (v) => ({
          visita: v,
          paciente: await getPaciente(v.pacienteId),
          dueno: await getDueno((await getPaciente(v.pacienteId))?.duenoId ?? ""),
        })),
      ),
    })),
  );

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Agenda</h1>
        <p className="mt-1 text-sm text-muted-foreground">Semana del {new Date(`${dias[0]}T12:00:00`).toLocaleDateString("es-SV", { day: "numeric", month: "long" })}</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-7">
        {visitasConDatos.map(({ fecha, citas }, i) => (
          <div key={fecha} className="rounded-2xl border border-border bg-card p-3">
            <div className="mb-2 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{DIAS[i]}</div>
              <div className={fecha === hoy ? "font-display text-lg font-bold text-vera-emerald" : "font-display text-lg font-bold"}>
                {new Date(`${fecha}T12:00:00`).getDate()}
              </div>
            </div>
            <ul className="space-y-2">
              {citas.map(({ visita, paciente, dueno }) => (
                <li
                  key={visita.id}
                  className={
                    visita.confirmada
                      ? "rounded-xl bg-vera-sage p-2 text-xs"
                      : "rounded-xl border border-dashed border-border p-2 text-xs"
                  }
                >
                  <div className="font-semibold">{visita.hora}</div>
                  <div className="truncate">{paciente?.nombre} · {dueno?.nombre}</div>
                </li>
              ))}
              {citas.length === 0 && <li className="py-4 text-center text-[11px] text-muted-foreground">—</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/agenda`.
Expected: 7-day grid, today's column highlighted, confirmed visits shown with a sage background, unconfirmed with a dashed border.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add weekly Agenda page"
```

---

### Task 16: Vacunas page

**Files:**
- Create: `app/(dashboard)/vacunas/page.tsx`

**Interfaces:**
- Consumes: `getPendientesVacunas` (Task 7), `getDueno` (Task 7), `UrgencyBadge` (Task 9).

- [ ] **Step 1: Write `app/(dashboard)/vacunas/page.tsx`**

```tsx
import { MessageCircle } from "lucide-react";
import { getPendientesVacunas, getDueno } from "@/lib/data/pacientes";
import { UrgencyBadge } from "@/components/shared/urgency-badge";

export default async function VacunasPage() {
  const pendientes = await getPendientesVacunas();
  const conDuenos = await Promise.all(pendientes.map(async (p) => ({ paciente: p, dueno: await getDueno(p.duenoId) })));

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">A quién le toca</h1>
        <p className="mt-1 text-sm text-muted-foreground">La memoria automática de Vera, priorizada por urgencia.</p>
      </header>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {conDuenos.map(({ paciente, dueno }) => (
          <li key={paciente.id} className="flex items-center gap-4 px-5 py-4">
            <img src={paciente.fotoUrl} alt={paciente.nombre} className="h-12 w-12 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-base font-bold">{paciente.nombre}</div>
              <div className="truncate text-xs text-muted-foreground">{dueno?.nombre}</div>
            </div>
            <UrgencyBadge estado={paciente.estadoEsquema} texto={paciente.faltaTexto} />
            <button className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-whatsapp px-3 text-xs font-semibold text-white">
              <MessageCircle size={13} /> Avisar
            </button>
          </li>
        ))}
        {conDuenos.length === 0 && (
          <li className="p-10 text-center">
            <p className="font-display text-lg font-bold">Todos al día</p>
            <p className="mt-1 text-sm text-muted-foreground">No hay vacunas pendientes esta semana.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/vacunas`.
Expected: 3 patients listed (Luna, Max, Toby), Max (vencido) sorted before Luna/Toby (falta).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Vacunas priority page"
```

---

### Task 17: Recordatorios page (Conversaciones + Programados tabs)

**Files:**
- Create: `app/(dashboard)/recordatorios/page.tsx`
- Create: `app/(dashboard)/recordatorios/conversaciones-tab.tsx`
- Create: `app/(dashboard)/recordatorios/programados-tab.tsx`

**Interfaces:**
- Consumes: `getConversaciones` (Task 7), `getRecordatoriosProgramados` (Task 7), `getPaciente` (Task 7), `WhatsAppBubble`/`ReminderQueueItem` (Task 9), shadcn `Tabs` (Task 4).

- [ ] **Step 1: Write `app/(dashboard)/recordatorios/conversaciones-tab.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Conversacion } from "@/lib/data/types";
import { WhatsAppBubble } from "@/components/shared/whatsapp-bubble";
import { cn } from "@/lib/utils";

const ESTADO_LABEL: Record<Conversacion["estado"], string> = {
  enviado: "Enviado",
  respondido: "Respondido",
  agendado: "Agendado",
  sin_respuesta: "Sin respuesta",
};

const ESTADO_COLOR: Record<Conversacion["estado"], string> = {
  enviado: "bg-muted text-muted-foreground",
  respondido: "bg-vera-sage text-vera-emerald",
  agendado: "bg-vera-sage text-vera-emerald",
  sin_respuesta: "bg-vera-honey-soft text-vera-honey",
};

export function ConversacionesTab({ conversaciones }: { conversaciones: Conversacion[] }) {
  const [openId, setOpenId] = useState(conversaciones[0]?.id ?? null);
  const open = conversaciones.find((c) => c.id === openId);

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <ul className="space-y-2">
        {conversaciones.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => setOpenId(c.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border bg-card p-3 text-left",
                openId === c.id ? "border-vera-emerald" : "border-border",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-sm font-bold">{c.duenoNombre} — {c.pacienteNombre}</span>
                  <span className="text-[11px] text-muted-foreground">{c.hora}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{c.ultimoMensaje}</div>
                <span className={cn("mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold", ESTADO_COLOR[c.estado])}>
                  {ESTADO_LABEL[c.estado]}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4">
            <div className="font-display text-lg font-bold">{open.duenoNombre}</div>
            <div className="text-sm text-muted-foreground">Sobre {open.pacienteNombre}</div>
          </div>
          <div className="space-y-2">
            {open.mensajes.map((m) => (
              <WhatsAppBubble key={m.id} mensaje={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write `app/(dashboard)/recordatorios/programados-tab.tsx`**

```tsx
import { ReminderQueueItem } from "@/components/shared/reminder-queue-item";
import type { Paciente, Recordatorio } from "@/lib/data/types";

interface Props {
  recordatorios: { recordatorio: Recordatorio; paciente: Paciente | undefined }[];
}

export function ProgramadosTab({ recordatorios }: Props) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Estos son los recordatorios que Vera enviará. Puedes pausarlos o editarlos antes de que salgan.
      </p>
      <ul className="space-y-3">
        {recordatorios.map(({ recordatorio, paciente }) => (
          <ReminderQueueItem
            key={recordatorio.id}
            recordatorio={recordatorio}
            pacienteNombre={paciente?.nombre ?? "—"}
            fotoUrl={paciente?.fotoUrl}
          />
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Write `app/(dashboard)/recordatorios/page.tsx`**

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getConversaciones, getRecordatoriosProgramados } from "@/lib/data/recordatorios";
import { getPaciente } from "@/lib/data/pacientes";
import { ConversacionesTab } from "./conversaciones-tab";
import { ProgramadosTab } from "./programados-tab";

export default async function RecordatoriosPage() {
  const conversaciones = await getConversaciones();
  const recordatorios = await getRecordatoriosProgramados();
  const recordatoriosConPaciente = await Promise.all(
    recordatorios.map(async (r) => ({ recordatorio: r, paciente: await getPaciente(r.pacienteId) })),
  );

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Recordatorios</h1>
        <p className="mt-1 text-sm text-muted-foreground">El corazón de Vera: lo que se envió y lo que está por salir.</p>
      </header>

      <Tabs defaultValue="conversaciones">
        <TabsList>
          <TabsTrigger value="conversaciones">Conversaciones</TabsTrigger>
          <TabsTrigger value="programados">Programados</TabsTrigger>
        </TabsList>
        <TabsContent value="conversaciones" className="mt-5">
          <ConversacionesTab conversaciones={conversaciones} />
        </TabsContent>
        <TabsContent value="programados" className="mt-5">
          <ProgramadosTab recordatorios={recordatoriosConPaciente} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 4: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/recordatorios`.
Expected: two tabs; Conversaciones shows 3 threads with a WhatsApp-style chat on the right; Programados shows 4 reminders each with working pause/edit buttons.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Recordatorios page merging conversations and scheduled queue"
```

---

### Task 18: Sala page

**Files:**
- Create: `app/(dashboard)/sala/page.tsx`

**Interfaces:**
- Consumes: `getSesionesActivas`, `getSalaEspera`, `getEstaciones`, `getEmpleado` (Task 7), `getPaciente`/`getDueno` (Task 7).

- [ ] **Step 1: Write `app/(dashboard)/sala/page.tsx`**

```tsx
import { Clock } from "lucide-react";
import { getSesionesActivas, getSalaEspera, getEstaciones, getEmpleado } from "@/lib/data/sala";
import { getPaciente, getDueno } from "@/lib/data/pacientes";

export default async function SalaPage() {
  const [sesiones, espera, estaciones] = await Promise.all([getSesionesActivas(), getSalaEspera(), getEstaciones()]);

  const tarjetas = await Promise.all(
    estaciones.map(async (estacion) => {
      const sesion = sesiones.find((s) => s.estacionId === estacion.id);
      if (!sesion) return { estacion, sesion: null, paciente: null, dueno: null, empleado: null };
      const paciente = await getPaciente(sesion.pacienteId);
      const dueno = paciente ? await getDueno(paciente.duenoId) : undefined;
      const empleado = await getEmpleado(sesion.empleadoId);
      return { estacion, sesion, paciente, dueno, empleado };
    }),
  );

  const esperaConDatos = await Promise.all(
    espera.map(async (e) => ({ item: e, paciente: await getPaciente(e.pacienteId) })),
  );

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Sala</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quién atiende a quién, en vivo.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {tarjetas.map(({ estacion, sesion, paciente, dueno, empleado }) => (
          <div
            key={estacion.id}
            className={
              sesion
                ? "rounded-2xl border border-vera-emerald bg-vera-sage p-4"
                : "rounded-2xl border border-dashed border-border bg-card p-4"
            }
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-vera-emerald">{estacion.nombre}</span>
              {sesion ? (
                <span className="rounded-full bg-vera-emerald px-2 py-0.5 text-[10px] font-medium text-white">en curso</span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Libre</span>
              )}
            </div>
            {sesion && paciente ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <img src={paciente.fotoUrl} alt={paciente.nombre} className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="truncate font-display text-base font-bold">{paciente.nombre}</div>
                    <div className="truncate text-xs text-muted-foreground">{dueno?.nombre}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                  <span className="font-medium">{empleado?.nombre}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={12} /> desde {sesion.inicio}
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">Sin sesión activa</p>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-display text-lg font-bold">Sala de espera</h2>
      {esperaConDatos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nadie esperando ahora.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {esperaConDatos.map(({ item, paciente }) => (
            <li key={item.pacienteId} className="flex items-center gap-3 px-5 py-4">
              <div className="rounded-xl bg-vera-sage px-2.5 py-1.5 text-center font-display text-sm font-bold text-vera-emerald">
                {item.hora}
              </div>
              {paciente && <img src={paciente.fotoUrl} alt={paciente.nombre} className="h-10 w-10 rounded-full object-cover" />}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{paciente?.nombre}</div>
                <div className="truncate text-xs text-muted-foreground">{item.motivo}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/sala`.
Expected: 4 station cards (2 occupied consultorios, 2 occupied groomer baths — all 4 seeded stations are busy), waiting room list with 2 patients.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Sala live board page"
```

---

### Task 19: Registrar page

**Files:**
- Create: `app/(dashboard)/registrar/registrar-client.tsx`
- Create: `app/(dashboard)/registrar/page.tsx`

**Interfaces:**
- Consumes: `getPacientes` (Task 7), shadcn `Button`/`Textarea` (Task 4).

- [ ] **Step 1: Write `app/(dashboard)/registrar/registrar-client.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Bug, Check, Scissors, Shield, Stethoscope, Syringe, X } from "lucide-react";
import type { Paciente } from "@/lib/data/types";
import type { ServicioTipo } from "@/lib/data/types";
import { Textarea } from "@/components/ui/textarea";

const TIPOS: { key: ServicioTipo; label: string; icon: typeof Syringe; productos: string[] }[] = [
  { key: "vacuna", label: "Vacuna", icon: Syringe, productos: ["Séxtuple", "Rabia", "Triple felina", "Refuerzo anual"] },
  { key: "desparasitacion", label: "Desparasitación", icon: Bug, productos: ["Ivermectina", "Praziquantel"] },
  { key: "preventivo", label: "Preventivo", icon: Shield, productos: ["Antipulgas mensual"] },
  { key: "consulta", label: "Consulta", icon: Stethoscope, productos: ["General", "Dermatológica"] },
  { key: "cirugia", label: "Cirugía", icon: Scissors, productos: ["Esterilización", "Extracción dental"] },
];

export function RegistrarClient({ pacientes }: { pacientes: Paciente[] }) {
  const [selectedId, setSelectedId] = useState(pacientes[0]?.id ?? "");
  const [tipo, setTipo] = useState<ServicioTipo | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);
  const paciente = pacientes.find((p) => p.id === selectedId);
  const tipoObj = TIPOS.find((t) => t.key === tipo);

  function registrar(producto: string) {
    if (!paciente) return;
    setConfirmacion(`${paciente.nombre} · ${producto}. Vera programó el recordatorio automáticamente.`);
    setTipo(null);
    setTimeout(() => setConfirmacion(null), 6000);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {pacientes.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={
              p.id === selectedId
                ? "flex items-center gap-2 rounded-full bg-vera-forest px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                : "flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
            }
          >
            <img src={p.fotoUrl} alt={p.nombre} className="h-5 w-5 rounded-full object-cover" />
            {p.nombre}
          </button>
        ))}
      </div>

      {paciente && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section>
            {!tipo ? (
              <>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">¿Qué se hizo?</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TIPOS.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTipo(key)}
                      className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left hover:border-vera-emerald"
                    >
                      <Icon size={20} className="text-vera-emerald" />
                      <span className="font-display text-sm font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-2.5 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tipoObj?.label}: elige el producto</h3>
                  <button onClick={() => setTipo(null)} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <X size={13} /> Cancelar
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {tipoObj?.productos.map((prod) => (
                    <button
                      key={prod}
                      onClick={() => registrar(prod)}
                      className="rounded-xl bg-vera-emerald px-4 py-3 text-left text-sm font-semibold text-white"
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nota clínica (opcional)</label>
              <Textarea rows={3} placeholder="Escribe la nota…" className="mt-2" />
            </div>
          </section>

          <aside className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-display text-sm font-bold">¿Qué hará Vera?</h3>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
              <li>Guarda la visita en el expediente.</li>
              <li>Programa el próximo recordatorio automáticamente.</li>
              <li>Envía el aviso por WhatsApp cuando toque.</li>
            </ul>
          </aside>
        </div>
      )}

      {confirmacion && (
        <div className="fixed bottom-24 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-2xl bg-vera-emerald p-4 text-white shadow-[var(--shadow-elevated)] lg:bottom-8">
          <Check size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{confirmacion}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write `app/(dashboard)/registrar/page.tsx`**

```tsx
import { getPacientes } from "@/lib/data/pacientes";
import { RegistrarClient } from "./registrar-client";

export default async function RegistrarPage() {
  const pacientes = await getPacientes();

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Registrar visita</h1>
        <p className="mt-1 text-sm text-muted-foreground">Un tap. Vera programa el recordatorio automáticamente.</p>
      </header>
      <RegistrarClient pacientes={pacientes} />
    </div>
  );
}
```

The page itself stays a Server Component that fetches data; all interactivity (selecting a patient, choosing a service, showing the toast) lives in the client child, following the same split used in Task 17.

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/registrar`.
Expected: patient chips, service type grid, selecting a product shows the green confirmation toast at the bottom.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Registrar quick-visit-logging page"
```

---

### Task 20: Reportes page

**Files:**
- Create: `app/(dashboard)/reportes/reportes-charts.tsx`
- Create: `app/(dashboard)/reportes/page.tsx`

**Interfaces:**
- Consumes: Recharts (Task 1 dependency).

- [ ] **Step 1: Write `app/(dashboard)/reportes/reportes-charts.tsx`**

```tsx
"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ENVIADOS = [
  { semana: "Sem 1", enviados: 18, respondidos: 12 },
  { semana: "Sem 2", enviados: 22, respondidos: 16 },
  { semana: "Sem 3", enviados: 19, respondidos: 14 },
  { semana: "Sem 4", enviados: 25, respondidos: 20 },
];

const INGRESOS = [
  { mes: "Abr", monto: 320 },
  { mes: "May", monto: 410 },
  { mes: "Jun", monto: 398 },
  { mes: "Jul", monto: 487 },
];

export function ReportesCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-sm font-bold">Recordatorios: enviados vs. respondidos</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ENVIADOS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="semana" stroke="var(--vera-ink-soft)" fontSize={12} />
              <YAxis stroke="var(--vera-ink-soft)" fontSize={12} />
              <Tooltip />
              <Bar dataKey="enviados" fill="var(--vera-slate-info)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="respondidos" fill="var(--vera-emerald)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-sm font-bold">Ingresos recuperados por mes ($)</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={INGRESOS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--vera-ink-soft)" fontSize={12} />
              <YAxis stroke="var(--vera-ink-soft)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="monto" stroke="var(--vera-emerald)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/(dashboard)/reportes/page.tsx`**

```tsx
import { MetricHero } from "@/components/shared/metric-hero";
import { ReportesCharts } from "./reportes-charts";

export default function ReportesPage() {
  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Reportes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cómo le está yendo a tu clínica con Vera.</p>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricHero label="Enviados este mes" value={84} />
        <MetricHero label="Tasa de respuesta" value="72%" />
        <MetricHero label="Citas recuperadas" value={23} />
        <MetricHero label="Ingresos recuperados" value="$487" />
      </section>

      <ReportesCharts />
    </div>
  );
}
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/reportes`.
Expected: 4 metric cards, a bar chart, and a line chart render without console errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Reportes page with Recharts visualizations"
```

---

### Task 21: Carnet público page

**Files:**
- Create: `app/carnet/[id]/page.tsx`
- Create: `app/carnet/[id]/not-found.tsx`

**Interfaces:**
- Consumes: `getPaciente`, `getServiciosPorPaciente`, `getDueno` (Task 7). Lives outside `(dashboard)` — no sidebar.

- [ ] **Step 1: Write `app/carnet/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";
import { getPaciente, getDueno, getServiciosPorPaciente } from "@/lib/data/pacientes";
import { edadTexto, formatFechaCorta } from "@/lib/date";

export default async function CarnetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await getPaciente(id);
  if (!paciente) notFound();

  const dueno = await getDueno(paciente.duenoId);
  const vacunas = (await getServiciosPorPaciente(paciente.id)).filter((s) => s.tipo === "vacuna");

  return (
    <div className="min-h-screen bg-vera-sage py-10">
      <div className="mx-auto w-full max-w-[390px] rounded-[36px] border-8 border-vera-forest bg-card p-6 shadow-[var(--shadow-elevated)]">
        <div className="text-center">
          <img src={paciente.fotoUrl} alt={paciente.nombre} className="mx-auto h-28 w-28 rounded-full object-cover" />
          <h1 className="mt-4 font-display text-2xl font-bold">{paciente.nombre}</h1>
          <p className="text-sm text-muted-foreground">{paciente.raza} · {edadTexto(paciente.fechaNacimiento)}</p>
        </div>

        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold">Vacunas</h2>
          <ul className="mt-3 space-y-2">
            {vacunas.map((v) => (
              <li key={v.id} className="flex items-center justify-between rounded-2xl bg-vera-sage p-3">
                <div>
                  <div className="font-medium">{v.producto}</div>
                  <div className="text-xs text-vera-emerald">{formatFechaCorta(v.fecha)}</div>
                </div>
                <Check size={20} className="text-vera-emerald" />
              </li>
            ))}
          </ul>
        </section>

        <a
          href={`https://wa.me/${dueno?.whatsapp.replace(/\D/g, "")}`}
          className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-whatsapp text-lg font-semibold text-white"
        >
          <MessageCircle size={22} />
          Agendar por WhatsApp
        </a>

        <p className="mt-6 text-center text-xs text-muted-foreground">Carnet digital por Vera</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/carnet/[id]/not-found.tsx`**

```tsx
export default function CarnetNotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-8 text-center text-muted-foreground">
      Carnet no encontrado.
    </div>
  );
}
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/carnet/p1` on a narrow viewport (or browser dev tools mobile emulation).
Expected: phone-card layout, no sidebar, WhatsApp CTA link has the correct `wa.me` href built from Rocky's owner's number.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add public Carnet digital page"
```

---

### Task 22: Final verification pass, README, and cleanup commit

**Files:**
- Create: `README.md`
- No other files modified (verification-only task, plus fixing anything the walkthrough surfaces)

**Interfaces:**
- Consumes: nothing new — this task exercises everything built in Tasks 1–21.

- [ ] **Step 1: Run the full automated check suite**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: all Vitest tests pass, no TypeScript errors, production build succeeds.

- [ ] **Step 2: Manual browser walkthrough**

Run: `npm run dev`, then in a browser visit every route and confirm against the spec:
- `/login` — form renders, submit goes to `/`.
- `/` — greeting, 4 metrics, patient list, WhatsApp panel.
- `/recordatorios` — both tabs work, pause/edit buttons respond.
- `/pacientes` — list + badges; `/pacientes/p1` — timeline + history; `/pacientes/does-not-exist` — not-found page.
- `/agenda` — 7-day grid, today highlighted.
- `/vacunas` — 3 pending patients, Max (vencido) first.
- `/sala` — 4 station cards occupied, 2 in waiting room.
- `/registrar` — full flow to the confirmation toast.
- `/reportes` — both charts render.
- `/carnet/p1` — phone-card layout, WhatsApp link.
- Toggle dark mode from the sidebar on at least 3 pages (`/`, `/pacientes/p1`, `/recordatorios`) and confirm: text stays readable (no invisible text), coral/honey/emerald are still visually distinct from each other, no page shows pure-black-on-pure-white or unstyled Tailwind defaults.
- Resize to a mobile width (375px) on `/` and `/pacientes`: bottom nav appears, sidebar disappears, no horizontal scroll.

If anything looks broken, fix it directly in the relevant component/page file before proceeding — do not defer visual bugs found here.

- [ ] **Step 3: Write `README.md`**

```markdown
# Vera Dashboard

Panel de gestión para clínicas veterinarias — Fase 1 (frontend).

## Stack
Next.js 15 (App Router) · Tailwind CSS v4 · shadcn/ui · next-themes · Recharts.

## Desarrollo

\`\`\`bash
npm install
npm run dev
\`\`\`

Abre `http://localhost:3000`.

## Pruebas

\`\`\`bash
npm test
\`\`\`

## Estado

Fase 1 completa: frontend con datos mock (`lib/data/`), sin backend real todavía.
Ver `docs/superpowers/specs/2026-07-20-vera-dashboard-design.md` para el diseño completo
y `docs/superpowers/plans/2026-07-20-vera-dashboard-plan.md` para el plan de implementación.
Fases futuras (fuera de este repo por ahora): API en Django, infraestructura en AWS.
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add README and complete Fase 1 verification pass"
```

---

## Post-plan note

This plan delivers a fully mock-data frontend matching spec `2026-07-20-vera-dashboard-design.md`. Two follow-on specs are needed before Fases 2–3 can be planned the same way: one for the Django API (models, endpoints matching `lib/data/`'s function names, auth), one for AWS infrastructure (hosting for Next.js, hosting for Django, database, CI/CD). Neither is in scope here.
