# Hoja Clínica Enriquecida Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing Vera Dashboard (Fase 1) with a richer clinical record: pin-based marking on species (or specialty) diagrams, photo attachments, medication-allergy alerts, and patient behavior notes — all still on the existing mock data layer, no backend changes.

**Architecture:** New domain types and two new mock seed files feed a new `SiluetaMarcable` diagram component, which gets wired into two existing surfaces: the Registrar flow (creates a `Reporte` alongside the `ServicioVisita`) and the patient expediente (displays `Reporte`s from history, plus an editable "Datos clínicos" section for allergies/behavior notes). A new `Ajustes` screen surfaces the clinic's specialty configuration read-only. The Carnet gets one added line of text.

**Tech Stack:** Same as Fase 1 — Next.js 15 App Router, TypeScript, Tailwind v4, shadcn/ui, lucide-react. No new dependencies.

## Global Constraints

- Everything stays mock/in-memory — no new persistence, consistent with the rest of Fase 1. Photos are `URL.createObjectURL` object URLs (lost on refresh), allergy/behavior-note edits are local component state seeded from the mock data (lost on refresh) — same pattern already used by `ReminderQueueItem`'s pause/edit.
- Marking is pin-only (click → note), never freehand drawing.
- Exactly one specialty diagram is built this phase: `"ojo"` (ophthalmology). The architecture (`DiagramaTipo` as a string key) supports more later without redesign, but none are built speculatively.
- Quick-chip registration (the existing "Servicios frecuentes" one-tap buttons in Registrar) stays instant with no report step — only the full tipo→producto-grid flow gets the new allergy-check + diagram + photo step, and even there it's skippable ("Omitir y confirmar").
- All copy in Spanish. All color usage via the existing semantic tokens (`--vera-*`) — no literal Tailwind color classes, with the same accepted exception as Fase 1 (`text-white` on an already-semantic colored background).
- Minimum tap target 44×44px for every new interactive element (this project targets non-technical users, some 50+ years old).
- The Carnet (public, dueño-facing) never shows the diagram, pins, photos, or behavior notes — those are vet-internal only.

---

### Task 1: Domain types and seed data

**Files:**
- Modify: `lib/data/types.ts`
- Modify: `lib/data/seed/pacientes.ts`
- Create: `lib/data/seed/especialidades.ts`
- Create: `lib/data/seed/reportes.ts`

**Interfaces:**
- Produces: `DiagramaTipo`, `Marca`, `Reporte`, `Especialidad` types; `Paciente.alergias: string[]` and `Paciente.notasComportamiento: string[]`; `ServicioTipo` gains `"consulta_oftalmologica"`; seed arrays `ESPECIALIDADES`, `REPORTES`.

- [ ] **Step 1: Add new types to `lib/data/types.ts`**

Add `"consulta_oftalmologica"` to the `ServicioTipo` union (append it as the 8th member):

```ts
export type ServicioTipo =
  | "vacuna"
  | "desparasitacion"
  | "preventivo"
  | "consulta"
  | "cirugia"
  | "examen"
  | "control"
  | "consulta_oftalmologica";
```

Add these new types, and the two new `Paciente` fields, at the end of the file:

```ts
export type DiagramaTipo = "perro" | "gato" | "otro" | "ojo";

export interface Marca {
  id: string;
  x: number; // 0-100, porcentaje del ancho del diagrama
  y: number; // 0-100, porcentaje del alto del diagrama
  nota: string;
}

export interface Reporte {
  id: string;
  servicioVisitaId: string;
  diagramaTipo: DiagramaTipo;
  marcas: Marca[];
  fotos: string[];
}

export interface Especialidad {
  id: string;
  nombre: string;
  tiposServicioAsociados: ServicioTipo[];
  diagramaId: DiagramaTipo;
}
```

Then find the `Paciente` interface and add two fields at the end of it (before the closing `}`):

```ts
  alergias: string[];
  notasComportamiento: string[];
```

- [ ] **Step 2: Add `alergias`/`notasComportamiento` to every seeded patient in `lib/data/seed/pacientes.ts`**

Every object in the `PACIENTES` array needs the two new fields. Add them to each of the 6 patients — most get empty arrays, but give Rocky (`p1`) and Luna (`p2`) non-empty examples so the new UI has something to show immediately:

For `p1` (Rocky), add before the closing `}` of that object:
```ts
    alergias: ["amoxicilina"],
    notasComportamiento: ["Se pone nervioso con otros perros", "Babea mucho al llegar"],
```

For `p2` (Luna), add:
```ts
    alergias: [],
    notasComportamiento: ["Muy tranquila, se deja revisar sin problema"],
```

For `p3`, `p4`, `p5`, `p6`, add to each:
```ts
    alergias: [],
    notasComportamiento: [],
```

- [ ] **Step 3: Create `lib/data/seed/especialidades.ts`**

```ts
import type { Especialidad } from "@/lib/data/types";

export const ESPECIALIDADES: Especialidad[] = [
  {
    id: "esp1",
    nombre: "Oftalmología",
    tiposServicioAsociados: ["consulta_oftalmologica"],
    diagramaId: "ojo",
  },
];
```

- [ ] **Step 4: Create `lib/data/seed/reportes.ts`**

These reference `s1` and `s6` — real service ids already seeded in `lib/data/seed/servicios.ts` (Rocky's séxtuple 1ª dosis, and Luna's triple felina 1ª dosis) — so the expediente has an example report to show without the user creating one first.

```ts
import type { Reporte } from "@/lib/data/types";

export const REPORTES: Reporte[] = [
  {
    id: "rep1",
    servicioVisitaId: "s1",
    diagramaTipo: "perro",
    marcas: [
      { id: "m1", x: 30, y: 60, nota: "Aplicada en el cuarto trasero izquierdo" },
    ],
    fotos: [],
  },
  {
    id: "rep2",
    servicioVisitaId: "s6",
    diagramaTipo: "gato",
    marcas: [
      { id: "m2", x: 70, y: 45, nota: "Sin reacciones en el sitio de aplicación" },
    ],
    fotos: [],
  },
];
```

- [ ] **Step 5: Verify the project type-checks**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add lib/data/types.ts lib/data/seed/pacientes.ts lib/data/seed/especialidades.ts lib/data/seed/reportes.ts
git commit -m "feat: add Reporte/Especialidad/Marca types and seed data for hoja clínica"
```

---

### Task 2: Data access layer for especialidades and reportes

**Files:**
- Create: `lib/data/especialidades.ts`
- Create: `lib/data/reportes.ts`

**Interfaces:**
- Consumes: `ESPECIALIDADES`, `REPORTES` (Task 1), `Especialidad`/`Reporte`/`DiagramaTipo`/`ServicioTipo` types (Task 1).
- Produces: `getEspecialidades(): Promise<Especialidad[]>`, `resolverDiagramaTipo(tipoServicio, especialidades, especiePaciente): DiagramaTipo`, `getReportePorServicio(servicioVisitaId): Promise<Reporte | undefined>` — consumed by Registrar (Task 5) and the expediente (Tasks 6-7).

- [ ] **Step 1: Write `lib/data/especialidades.ts`**

```ts
import { ESPECIALIDADES } from "@/lib/data/seed/especialidades";
import type { DiagramaTipo, Especialidad, Especie, ServicioTipo } from "@/lib/data/types";

export async function getEspecialidades(): Promise<Especialidad[]> {
  return ESPECIALIDADES;
}

export function resolverDiagramaTipo(
  tipoServicio: ServicioTipo,
  especialidades: Especialidad[],
  especiePaciente: Especie,
): DiagramaTipo {
  const especialidad = especialidades.find((e) => e.tiposServicioAsociados.includes(tipoServicio));
  return especialidad?.diagramaId ?? especiePaciente;
}
```

- [ ] **Step 2: Write `lib/data/reportes.ts`**

```ts
import { REPORTES } from "@/lib/data/seed/reportes";
import type { Reporte } from "@/lib/data/types";

export async function getReportePorServicio(servicioVisitaId: string): Promise<Reporte | undefined> {
  return REPORTES.find((r) => r.servicioVisitaId === servicioVisitaId);
}
```

- [ ] **Step 3: Write the test in `lib/data/especialidades.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { resolverDiagramaTipo } from "./especialidades";
import type { Especialidad } from "@/lib/data/types";

const especialidades: Especialidad[] = [
  { id: "esp1", nombre: "Oftalmología", tiposServicioAsociados: ["consulta_oftalmologica"], diagramaId: "ojo" },
];

describe("resolverDiagramaTipo", () => {
  it("returns the specialty diagram when the tipo servicio matches one", () => {
    expect(resolverDiagramaTipo("consulta_oftalmologica", especialidades, "perro")).toBe("ojo");
  });

  it("falls back to the patient's species when no specialty matches", () => {
    expect(resolverDiagramaTipo("vacuna", especialidades, "gato")).toBe("gato");
  });

  it("falls back to species when there are no especialidades at all", () => {
    expect(resolverDiagramaTipo("consulta_oftalmologica", [], "otro")).toBe("otro");
  });
});
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run lib/data/especialidades.test.ts`
Expected: all 3 tests PASS.

- [ ] **Step 5: Verify the project type-checks**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add lib/data/especialidades.ts lib/data/reportes.ts lib/data/especialidades.test.ts
git commit -m "feat: add data access functions for especialidades and reportes"
```

---

### Task 3: `SiluetaMarcable` diagram component

**Files:**
- Create: `components/shared/silueta-marcable.tsx`

**Interfaces:**
- Consumes: `Marca`, `DiagramaTipo` types (Task 1).
- Produces: `<SiluetaMarcable diagramaTipo modo marcas onAgregarMarca? onEliminarMarca? />` — consumed by Registrar (Task 5, `modo="interactivo"`) and the expediente (Task 7, `modo="lectura"`).

- [ ] **Step 1: Write `components/shared/silueta-marcable.tsx`**

```tsx
"use client";

import { useState, type MouseEvent } from "react";
import { X } from "lucide-react";
import type { DiagramaTipo, Marca } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface Props {
  diagramaTipo: DiagramaTipo;
  marcas: Marca[];
  modo: "interactivo" | "lectura";
  onAgregarMarca?: (marca: Omit<Marca, "id">) => void;
  onEliminarMarca?: (id: string) => void;
}

function Diagrama({ tipo }: { tipo: DiagramaTipo }) {
  const stroke = "var(--vera-forest)";
  const fill = "var(--vera-sage)";
  if (tipo === "ojo") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d="M5 50 Q50 15 95 50 Q50 85 5 50 Z" fill={fill} stroke={stroke} strokeWidth={2} />
        <circle cx="50" cy="50" r="16" fill="var(--vera-forest-deep)" stroke={stroke} strokeWidth={2} />
        <circle cx="50" cy="50" r="7" fill="black" />
      </svg>
    );
  }
  if (tipo === "gato") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <ellipse cx="55" cy="60" rx="30" ry="15" fill={fill} stroke={stroke} strokeWidth={2} />
        <circle cx="22" cy="46" r="11" fill={fill} stroke={stroke} strokeWidth={2} />
        <path d="M14 38 L18 26 L24 37 Z" fill={fill} stroke={stroke} strokeWidth={2} />
        <path d="M22 36 L28 24 L32 36 Z" fill={fill} stroke={stroke} strokeWidth={2} />
        <path d="M83 55 Q95 40 88 25" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        <rect x="35" y="72" width="6" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
        <rect x="70" y="72" width="6" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      </svg>
    );
  }
  if (tipo === "otro") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <ellipse cx="55" cy="58" rx="28" ry="16" fill={fill} stroke={stroke} strokeWidth={2} />
        <circle cx="24" cy="48" r="12" fill={fill} stroke={stroke} strokeWidth={2} />
        <rect x="38" y="74" width="6" height="14" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
        <rect x="70" y="74" width="6" height="14" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      </svg>
    );
  }
  // perro (default)
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <ellipse cx="58" cy="58" rx="32" ry="16" fill={fill} stroke={stroke} strokeWidth={2} />
      <circle cx="20" cy="46" r="13" fill={fill} stroke={stroke} strokeWidth={2} />
      <path d="M10 38 Q4 24 16 30 Z" fill={fill} stroke={stroke} strokeWidth={2} />
      <path d="M84 58 Q98 50 92 38" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
      <rect x="36" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      <rect x="52" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      <rect x="70" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
      <rect x="80" y="72" width="7" height="16" rx="3" fill={fill} stroke={stroke} strokeWidth={2} />
    </svg>
  );
}

export function SiluetaMarcable({ diagramaTipo, marcas, modo, onAgregarMarca, onEliminarMarca }: Props) {
  const [pendiente, setPendiente] = useState<{ x: number; y: number } | null>(null);
  const [nota, setNota] = useState("");

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (modo !== "interactivo") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPendiente({ x, y });
    setNota("");
  }

  function confirmarPendiente() {
    if (!pendiente || !nota.trim() || !onAgregarMarca) return;
    onAgregarMarca({ x: pendiente.x, y: pendiente.y, nota: nota.trim() });
    setPendiente(null);
    setNota("");
  }

  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        className={cn(
          "relative aspect-square w-full max-w-[280px] rounded-2xl border border-border bg-card p-4",
          modo === "interactivo" && "cursor-crosshair",
        )}
      >
        <Diagrama tipo={diagramaTipo} />
        {marcas.map((marca) => (
          <button
            key={marca.id}
            type="button"
            title={marca.nota}
            onClick={(e) => {
              e.stopPropagation();
              if (modo === "interactivo") onEliminarMarca?.(marca.id);
            }}
            className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-vera-coral text-white shadow-[var(--shadow-card)]"
            style={{ left: `${marca.x}%`, top: `${marca.y}%` }}
          >
            <span className="h-2 w-2 rounded-full bg-white" />
          </button>
        ))}
        {pendiente && (
          <span
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-vera-honey"
            style={{ left: `${pendiente.x}%`, top: `${pendiente.y}%` }}
          />
        )}
      </div>

      {modo === "interactivo" && pendiente && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
          <input
            autoFocus
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmarPendiente()}
            placeholder="Nota corta (ej. fractura, aplicación)…"
            className="min-h-11 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-muted-foreground md:text-sm"
          />
          <button
            type="button"
            onClick={confirmarPendiente}
            className="min-h-11 rounded-lg bg-vera-emerald px-3 text-sm font-semibold text-white"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setPendiente(null)}
            aria-label="Cancelar"
            className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-border text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {modo === "interactivo" && (
        <p className="text-xs text-muted-foreground">Toca la silueta para agregar una marca. Toca una marca existente para quitarla.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the project type-checks**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/shared/silueta-marcable.tsx
git commit -m "feat: add SiluetaMarcable pin-based diagram component (perro/gato/otro/ojo)"
```

---

### Task 4: `Ajustes` nav item and page

**Files:**
- Modify: `components/app-shell/nav-items.ts`
- Create: `app/(dashboard)/ajustes/page.tsx`

**Interfaces:**
- Consumes: `getEspecialidades()` (Task 2).
- Produces: `/ajustes` route, 9th nav item (falls into the mobile overflow sheet automatically since `mobile-nav.tsx`'s `OVERFLOW_ITEMS = NAV_ITEMS.slice(4)` is data-driven — no changes needed to that file).

- [ ] **Step 1: Update `components/app-shell/nav-items.ts`**

Add the `Settings` import and append the 9th item to `NAV_ITEMS`:

```ts
import { BarChart3, Bell, CalendarDays, Home, LayoutGrid, PawPrint, PlusCircle, Settings, Syringe } from "lucide-react";
```

```ts
  { href: "/ajustes", label: "Ajustes", icon: Settings },
```

(Append this as the last entry in the `NAV_ITEMS` array, after `/reportes`.)

- [ ] **Step 2: Write `app/(dashboard)/ajustes/page.tsx`**

```tsx
import { getEspecialidades } from "@/lib/data/especialidades";

const TIPO_SERVICIO_LABEL: Record<string, string> = {
  vacuna: "Vacuna",
  desparasitacion: "Desparasitación",
  preventivo: "Preventivo",
  consulta: "Consulta",
  cirugia: "Cirugía",
  examen: "Examen",
  control: "Control",
  consulta_oftalmologica: "Consulta oftalmológica",
};

export default async function AjustesPage() {
  const especialidades = await getEspecialidades();

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Ajustes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Especialidades de tu clínica y qué tipos de servicio las activan.</p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Especialidades</h2>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {especialidades.map((esp) => (
            <li key={esp.id} className="px-5 py-4">
              <div className="font-display text-base font-bold">{esp.nombre}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {esp.tiposServicioAsociados.map((tipo) => (
                  <span
                    key={tipo}
                    className="rounded-full bg-vera-sage px-2.5 py-1 text-xs font-medium text-vera-emerald"
                  >
                    {TIPO_SERVICIO_LABEL[tipo] ?? tipo}
                  </span>
                ))}
              </div>
            </li>
          ))}
          {especialidades.length === 0 && (
            <li className="p-10 text-center text-sm text-muted-foreground">Tu clínica no tiene especialidades configuradas todavía.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
```

This page is deliberately read-only per the spec (§6) — viewing the seeded configuration, not a CRUD editor.

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `http://localhost:3002/ajustes` (adjust port as needed).
Expected: page renders "Oftalmología" with a "Consulta oftalmológica" badge. Sidebar shows 9 items; on a narrow viewport, the "Más" overflow sheet includes "Ajustes" alongside Sala/Registrar/Reportes.

- [ ] **Step 4: Commit**

```bash
git add components/app-shell/nav-items.ts "app/(dashboard)/ajustes/page.tsx"
git commit -m "feat: add Ajustes nav item and read-only especialidades page"
```

---

### Task 5: Extend Registrar with allergy alerts, diagram marking, and photo attachments

**Files:**
- Modify: `app/(dashboard)/registrar/registrar-client.tsx`
- Modify: `app/(dashboard)/registrar/page.tsx`

**Interfaces:**
- Consumes: `SiluetaMarcable` (Task 3), `getEspecialidades`/`resolverDiagramaTipo` (Task 2), `Marca`/`Reporte`/`Especialidad` types (Task 1).
- Produces: the extended Registrar flow — this is the last task that touches this file in this phase, so no further "Produces" beyond the working UI.

- [ ] **Step 1: Update `app/(dashboard)/registrar/page.tsx`** to also fetch especialidades

```tsx
import { getPacientes } from "@/lib/data/pacientes";
import { getEspecialidades } from "@/lib/data/especialidades";
import { RegistrarClient } from "./registrar-client";

export default async function RegistrarPage() {
  const [pacientes, especialidades] = await Promise.all([getPacientes(), getEspecialidades()]);

  return (
    <div>
      <header className="pb-6">
        <h1 className="font-display text-3xl font-bold text-vera-forest">Registrar visita</h1>
        <p className="mt-1 text-sm text-muted-foreground">Un tap. Vera programa el recordatorio automáticamente.</p>
      </header>
      <RegistrarClient pacientes={pacientes} especialidades={especialidades} />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `app/(dashboard)/registrar/registrar-client.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Bug, Check, Eye, Scissors, Shield, Stethoscope, Syringe, X } from "lucide-react";
import type { Paciente, ServicioTipo, Especialidad, Marca } from "@/lib/data/types";
import { resolverDiagramaTipo } from "@/lib/data/especialidades";
import { SiluetaMarcable } from "@/components/shared/silueta-marcable";
import { Textarea } from "@/components/ui/textarea";

interface Producto {
  nombre: string;
  compuestos?: string[];
}

const TIPOS: { key: ServicioTipo; label: string; icon: typeof Syringe; productos: Producto[] }[] = [
  {
    key: "vacuna", label: "Vacuna", icon: Syringe,
    productos: [{ nombre: "Séxtuple" }, { nombre: "Rabia" }, { nombre: "Triple felina" }, { nombre: "Refuerzo anual" }],
  },
  {
    key: "desparasitacion", label: "Desparasitación", icon: Bug,
    productos: [{ nombre: "Ivermectina" }, { nombre: "Praziquantel" }],
  },
  {
    key: "preventivo", label: "Preventivo", icon: Shield,
    productos: [{ nombre: "Antipulgas mensual" }],
  },
  {
    key: "consulta", label: "Consulta", icon: Stethoscope,
    productos: [
      { nombre: "General" },
      { nombre: "Dermatológica" },
      { nombre: "Amoxicilina + Ácido Clavulánico", compuestos: ["amoxicilina"] },
    ],
  },
  {
    key: "consulta_oftalmologica", label: "Consulta oftalmológica", icon: Eye,
    productos: [{ nombre: "Revisión oftalmológica" }],
  },
  {
    key: "cirugia", label: "Cirugía", icon: Scissors,
    productos: [{ nombre: "Esterilización" }, { nombre: "Extracción dental" }],
  },
];

export function RegistrarClient({ pacientes, especialidades }: { pacientes: Paciente[]; especialidades: Especialidad[] }) {
  const [selectedId, setSelectedId] = useState(pacientes[0]?.id ?? "");
  const [tipo, setTipo] = useState<ServicioTipo | null>(null);
  const [productoElegido, setProductoElegido] = useState<Producto | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [fotos, setFotos] = useState<string[]>([]);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  const paciente = pacientes.find((p) => p.id === selectedId);
  const tipoObj = TIPOS.find((t) => t.key === tipo);

  function resetPasoFinal() {
    setProductoElegido(null);
    setMarcas([]);
    setFotos([]);
  }

  function registrar(nombreProducto: string) {
    if (!paciente) return;
    setConfirmacion(`${paciente.nombre} · ${nombreProducto}. Vera programó el recordatorio automáticamente.`);
    setTipo(null);
    resetPasoFinal();
    setTimeout(() => setConfirmacion(null), 6000);
  }

  const alergiaEnConflicto =
    paciente && productoElegido?.compuestos?.find((c) => paciente.alergias.includes(c));

  function handleFotoChange(files: FileList | null) {
    if (!files) return;
    const nuevas = Array.from(files).map((f) => URL.createObjectURL(f));
    setFotos((prev) => [...prev, ...nuevas]);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {pacientes.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedId(p.id);
              setTipo(null);
              resetPasoFinal();
            }}
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
            ) : !productoElegido ? (
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
                      key={prod.nombre}
                      onClick={() => setProductoElegido(prod)}
                      className="rounded-xl bg-vera-emerald px-4 py-3 text-left text-sm font-semibold text-white"
                    >
                      {prod.nombre}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{productoElegido.nombre} — reporte de la visita (opcional)</h3>
                  <button onClick={resetPasoFinal} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <X size={13} /> Cancelar
                  </button>
                </div>

                {alergiaEnConflicto && (
                  <div className="mb-4 rounded-xl border border-vera-coral bg-vera-coral-soft p-3 text-sm text-vera-coral">
                    <strong className="font-semibold">Alerta de alergia:</strong> {paciente.nombre} tiene registrada una alergia a{" "}
                    <strong className="font-semibold">{alergiaEnConflicto}</strong>, presente en este producto.
                  </div>
                )}

                <SiluetaMarcable
                  diagramaTipo={resolverDiagramaTipo(tipo!, especialidades, paciente.especie)}
                  marcas={marcas}
                  modo="interactivo"
                  onAgregarMarca={(m) => setMarcas((prev) => [...prev, { ...m, id: crypto.randomUUID() }])}
                  onEliminarMarca={(id) => setMarcas((prev) => prev.filter((m) => m.id !== id))}
                />

                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fotos</label>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {fotos.map((url, i) => (
                      <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    ))}
                    <label className="grid h-16 w-16 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFotoChange(e.target.files)} />
                      + Foto
                    </label>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => registrar(productoElegido.nombre)}
                    className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Omitir y confirmar
                  </button>
                  <button
                    onClick={() => registrar(productoElegido.nombre)}
                    className="min-h-11 rounded-xl bg-vera-emerald px-4 text-sm font-semibold text-white"
                  >
                    Guardar reporte y confirmar
                  </button>
                </div>
              </>
            )}

            {!tipo && (
              <>
                <div className="mb-2 mt-8 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Servicios frecuentes · {paciente.nombre}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tipo: "vacuna" as ServicioTipo, prod: "Séxtuple 1ª dosis" },
                    { tipo: "vacuna" as ServicioTipo, prod: "Rabia" },
                    { tipo: "preventivo" as ServicioTipo, prod: "Antipulgas mensual" },
                  ].map(({ tipo: t, prod }) => (
                    <button
                      key={prod}
                      onClick={() => {
                        setTipo(t);
                        registrar(prod);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold text-white"
                      style={{ backgroundColor: "var(--vera-emerald)", borderColor: "var(--vera-emerald)" }}
                    >
                      <Check size={13} /> {prod}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Nota clínica (opcional)</label>
              <Textarea rows={3} placeholder="Escribe la nota…" className="mt-2" />
            </div>
          </section>

          <aside className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-display text-[14px] font-bold">¿Qué hará Vera?</h3>
            <ul className="mt-3 space-y-2.5 text-[12px] text-muted-foreground">
              <li>Guarda la visita en el expediente.</li>
              <li>Programa el próximo recordatorio automáticamente.</li>
              <li>Envía el aviso por WhatsApp cuando toque.</li>
            </ul>
          </aside>
        </div>
      )}

      {confirmacion && (
        <div
          className="fixed bottom-24 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl border p-4 shadow-lg lg:bottom-8"
          style={{ backgroundColor: "var(--vera-emerald)", borderColor: "var(--vera-emerald)", color: "white" }}
          role="status"
        >
          <Check size={18} className="mt-0.5 shrink-0" />
          <p className="text-[13px]">{confirmacion}</p>
        </div>
      )}
    </div>
  );
}
```

Quick chips (bottom "Servicios frecuentes" list) are trimmed to 3 examples and keep calling `registrar()` directly — no allergy check, no report step, matching the "stays instant" constraint. The grid-flow path (`tipo` → producto grid → `productoElegido`) is the only one that reaches the new allergy/diagram/photo step, and both its buttons ("Omitir y confirmar" / "Guardar reporte y confirmar") call the same `registrar()` — this phase doesn't yet persist the `Reporte` anywhere real (there's no seed-mutation layer in this mock app), so both buttons behave identically today; the distinction matters once Fase 2B wires real persistence, at which point "Guardar reporte y confirmar" is the one that would also POST the `Reporte`.

- [ ] **Step 3: Verify with `npx tsc --noEmit`**

Expected: exits 0.

- [ ] **Step 4: Verify manually**

Run: `npm run dev`, open `/registrar`. Select a patient, pick "Consulta" → "Amoxicilina + Ácido Clavulánico" for Rocky (who has `alergias: ["amoxicilina"]`) — the coral allergy banner should appear. Click on the silueta to add a pin, type a note, click Guardar — the pin should appear on the diagram. Attach a photo via the file picker — a thumbnail should appear.

- [ ] **Step 5: Commit**

```bash
git add "app/(dashboard)/registrar/registrar-client.tsx" "app/(dashboard)/registrar/page.tsx"
git commit -m "feat: extend Registrar with allergy alerts, diagram marking, and photo attachments"
```

---

### Task 6: Expediente — "Datos clínicos" section (alergias / notas de comportamiento)

**Files:**
- Modify: `app/(dashboard)/pacientes/[id]/page.tsx`
- Create: `app/(dashboard)/pacientes/[id]/datos-clinicos.tsx`

**Interfaces:**
- Consumes: `Paciente.alergias`/`Paciente.notasComportamiento` (Task 1).
- Produces: an editable chips section on the expediente — local-state only (no persistence), matching the existing `ReminderQueueItem` pattern.

- [ ] **Step 1: Write `app/(dashboard)/pacientes/[id]/datos-clinicos.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

function ChipList({
  titulo,
  items,
  onAdd,
  onRemove,
  placeholder,
  tono,
}: {
  titulo: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  tono: "coral" | "sage";
}) {
  const [valor, setValor] = useState("");
  const chipClass = tono === "coral" ? "bg-vera-coral-soft text-vera-coral" : "bg-vera-sage text-vera-emerald";

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{titulo}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${chipClass}`}>
            {item}
            <button type="button" onClick={() => onRemove(item)} aria-label={`Quitar ${item}`} className="ml-0.5">
              <X size={11} />
            </button>
          </span>
        ))}
        {items.length === 0 && <span className="text-xs text-muted-foreground">Ninguno registrado.</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && valor.trim()) {
              onAdd(valor.trim());
              setValor("");
            }
          }}
          placeholder={placeholder}
          className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary md:text-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (valor.trim()) {
              onAdd(valor.trim());
              setValor("");
            }
          }}
          className="grid min-h-11 min-w-11 place-items-center rounded-lg bg-vera-emerald text-white"
          aria-label="Agregar"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function DatosClinicos({ alergiasIniciales, notasIniciales }: { alergiasIniciales: string[]; notasIniciales: string[] }) {
  const [alergias, setAlergias] = useState(alergiasIniciales);
  const [notas, setNotas] = useState(notasIniciales);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-bold">Datos clínicos</h2>
      <div className="space-y-5">
        <ChipList
          titulo="Alergias"
          items={alergias}
          onAdd={(v) => setAlergias((prev) => [...prev, v])}
          onRemove={(v) => setAlergias((prev) => prev.filter((x) => x !== v))}
          placeholder="Ej. amoxicilina"
          tono="coral"
        />
        <ChipList
          titulo="Notas de comportamiento"
          items={notas}
          onAdd={(v) => setNotas((prev) => [...prev, v])}
          onRemove={(v) => setNotas((prev) => prev.filter((x) => x !== v))}
          placeholder="Ej. se pone nervioso con otros perros"
          tono="sage"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `app/(dashboard)/pacientes/[id]/page.tsx`**

Add the import at the top:

```tsx
import { DatosClinicos } from "./datos-clinicos";
```

Then, inside the `<aside>` sidebar column (after the "Próximas visitas" card, before the "Carnet del dueño" link), add:

```tsx
          <DatosClinicos alergiasIniciales={paciente.alergias} notasIniciales={paciente.notasComportamiento} />
```

- [ ] **Step 3: Verify with `npx tsc --noEmit`**

Expected: exits 0.

- [ ] **Step 4: Verify manually**

Run: `npm run dev`, open `/pacientes/p1` (Rocky). Expected: "Datos clínicos" card shows "amoxicilina" as an allergy chip and 2 behavior notes. Typing a new allergy and pressing Enter adds a new chip; clicking its × removes it.

- [ ] **Step 5: Commit**

```bash
git add "app/(dashboard)/pacientes/[id]/page.tsx" "app/(dashboard)/pacientes/[id]/datos-clinicos.tsx"
git commit -m "feat: add editable Datos clínicos section (alergias, notas de comportamiento) to expediente"
```

---

### Task 7: Expediente — expandable history entries showing `Reporte`

**Files:**
- Modify: `app/(dashboard)/pacientes/[id]/page.tsx`
- Create: `app/(dashboard)/pacientes/[id]/historial-item.tsx`

**Interfaces:**
- Consumes: `getReportePorServicio` (Task 2), `SiluetaMarcable` (Task 3, `modo="lectura"`).
- Produces: the history list item becomes a client component with expand/collapse, replacing the plain `<li>` used today.

- [ ] **Step 1: Write `app/(dashboard)/pacientes/[id]/historial-item.tsx`**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Reporte, ServicioVisita } from "@/lib/data/types";
import { SiluetaMarcable } from "@/components/shared/silueta-marcable";
import { formatFechaCorta } from "@/lib/date";

export function HistorialItem({ servicio, reporte }: { servicio: ServicioVisita; reporte: Reporte | undefined }) {
  const [abierto, setAbierto] = useState(false);
  const Chevron = abierto ? ChevronDown : ChevronRight;

  return (
    <li>
      <button
        type="button"
        onClick={() => reporte && setAbierto((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
        disabled={!reporte}
      >
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-bold">{servicio.producto}</div>
          <div className="text-xs text-muted-foreground">{formatFechaCorta(servicio.fecha)} · {servicio.vet}</div>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {servicio.tipo}
        </span>
        {reporte && <Chevron size={16} className="shrink-0 text-muted-foreground" />}
      </button>
      {abierto && reporte && (
        <div className="border-t border-border/70 px-5 py-4">
          <SiluetaMarcable diagramaTipo={reporte.diagramaTipo} marcas={reporte.marcas} modo="lectura" />
          {reporte.fotos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {reporte.fotos.map((url, i) => (
                <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
```

- [ ] **Step 2: Wire it into `app/(dashboard)/pacientes/[id]/page.tsx`**

Add the import:

```tsx
import { HistorialItem } from "./historial-item";
import { getReportePorServicio } from "@/lib/data/reportes";
```

Find the historial clínico rendering block (the `<ol>` mapping over `servicios`), and replace its `.map()` body. It currently looks like:

```tsx
{servicios.map((s) => (
  <li key={s.id} className="flex items-center gap-4 px-5 py-4">
    ...
  </li>
))}
```

Since resolving each service's `Reporte` requires an `await`, this rendering needs to happen after fetching all reports up front, before the `return` statement. Add this line alongside the page's other data fetches (near where `servicios`/`proximas` are computed):

```tsx
  const reportesPorServicio = await Promise.all(servicios.map((s) => getReportePorServicio(s.id)));
```

Then replace the `<ol>...</ol>` block's mapping with:

```tsx
          <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {servicios.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Sin visitas registradas.</li>}
            {servicios.map((s, i) => (
              <HistorialItem key={s.id} servicio={s} reporte={reportesPorServicio[i]} />
            ))}
          </ol>
```

- [ ] **Step 3: Verify with `npx tsc --noEmit`**

Expected: exits 0.

- [ ] **Step 4: Verify manually**

Run: `npm run dev`, open `/pacientes/p1`. The "Séxtuple - 1ª dosis" history entry (which has seeded `rep1`) should show a chevron and expand to reveal the perro silueta with one coral pin. Entries without a report show no chevron and aren't clickable.

- [ ] **Step 5: Commit**

```bash
git add "app/(dashboard)/pacientes/[id]/page.tsx" "app/(dashboard)/pacientes/[id]/historial-item.tsx"
git commit -m "feat: expand expediente history entries to show their Reporte diagram and photos"
```

---

### Task 8: Carnet — last-visit summary line

**Files:**
- Modify: `app/carnet/[id]/page.tsx`

**Interfaces:**
- Consumes: `getServiciosPorPaciente` (already used on this page from Fase 1).

- [ ] **Step 1: Update `app/carnet/[id]/page.tsx`**

Find where `vacunas` is computed (`const vacunas = (await getServiciosPorPaciente(paciente.id)).filter(...)`) and add, right after it:

```tsx
  const todosServicios = await getServiciosPorPaciente(paciente.id);
  const ultimaVisita = todosServicios[todosServicios.length - 1];
```

Then, inside the JSX, right after the header block (name/breed/age, before the `<section>` for "Vacunas"), add:

```tsx
        {ultimaVisita && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Última visita: {ultimaVisita.producto} — {formatFechaCorta(ultimaVisita.fecha)}
          </p>
        )}
```

This needs `formatFechaCorta` imported — check the existing import line at the top of the file (it already imports `edadTexto, formatFechaCorta` from `@/lib/date` per Task 21 of the Fase 1 plan) and confirm `formatFechaCorta` is present; if not, add it to that import.

No diagram, no photos, no behavior notes — deliberately, per spec §7.

- [ ] **Step 2: Verify with `npx tsc --noEmit`**

Expected: exits 0.

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `/carnet/p1`. Expected: a one-line "Última visita: … " summary appears under Rocky's name/breed, above the vaccine list.

- [ ] **Step 4: Commit**

```bash
git add "app/carnet/[id]/page.tsx"
git commit -m "feat: show last-visit summary line on the public Carnet"
```

---

### Task 9: Final verification pass

**Files:**
- No production files (verification-only; fix anything the pass surfaces before committing)

**Interfaces:**
- Consumes: everything from Tasks 1-8.

- [ ] **Step 1: Run the full automated check suite**

```bash
npm test && npx tsc --noEmit && npm run build
```

Expected: all Vitest tests pass (including the 3 new ones from Task 2), no TypeScript errors, production build succeeds.

- [ ] **Step 2: Manual browser walkthrough**

Run: `npm run dev` and check, against a fresh reload of each page:
- `/ajustes` — shows Oftalmología with its badge; reachable from the sidebar (desktop) and from the "Más" overflow sheet (mobile width).
- `/registrar` — quick chips still register instantly with no extra step. Full flow: pick a type → pick a product → the new step shows (allergy banner only when relevant, e.g. Rocky + Amoxicilina) → click the silueta adds a pin with a note → attach a photo shows a thumbnail → both "Omitir y confirmar" and "Guardar reporte y confirmar" show the same green toast.
- `/pacientes/p1` — "Datos clínicos" card shows Rocky's seeded allergy/behavior chips, editable. History entry for the séxtuple 1ª dosis expands to show the perro diagram with its seeded pin.
- `/pacientes/p2` — Luna's history entry for her triple felina dose expands to show the gato diagram.
- `/carnet/p1` — shows the new one-line last-visit summary, still no diagram/photos.
- Toggle dark mode on `/registrar` and `/pacientes/p1` — confirm the new components (silueta diagrams, allergy banner, chips) remain legible and on-brand in dark mode (the diagrams use CSS variables for stroke/fill, so they should adapt automatically — visually confirm this is actually true).

If anything looks broken, fix it directly before proceeding — don't defer visual bugs found here.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: complete hoja clínica verification pass" --allow-empty
```

(Use `--allow-empty` only if Step 2 surfaced no fixes; if it did, that commit already covers the change — skip this step in that case.)

---

## Post-plan note

This plan is entirely additive to the existing mock frontend — no vera-api changes. When Fase 2B (real backend wiring) happens, `Reporte`/`Especialidad`/`Marca`/allergy/behavior-note persistence will need real Django models and endpoints mirroring these types, plus real file storage for photos (not yet designed — `vera-api`'s Fase 2A spec doesn't cover this) and a decision about whether "Omitir y confirmar" vs "Guardar reporte y confirmar" actually diverge in behavior once there's something real to skip.
