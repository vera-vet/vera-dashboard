# Vera Dashboard — Fase 1 (Frontend Next.js) — Design Spec

**Fecha:** 2026-07-20
**Estado:** Aprobado por el usuario, pendiente de plan de implementación.
**Proyecto base de referencia:** `/Users/luismerino/Desktop/vera-saas` (Lovable / TanStack Start / Vite — no se reutiliza código, solo sirve de referencia funcional de qué pantallas y datos existen).

## 1. Contexto y objetivo

Vera es un sistema de gestión para clínicas veterinarias en Latinoamérica. El proyecto base (`vera-saas`) es un prototipo hecho en Lovable con TanStack Start, con datos 100% mock, pensado como demo de producto. El usuario quiere un proyecto **nuevo, desde cero, en carpeta separada**, con stack profesional (Next.js + Tailwind + Django + AWS) y un sistema de diseño mucho más pulido y "premium".

Este spec cubre **solo la Fase 1**: el frontend Next.js del dashboard, con datos mock, sin backend real. Django (API/modelos/auth) y AWS (infraestructura/deploy) son fases futuras, cada una con su propio spec cuando llegue el momento.

**Usuarios objetivo:** veterinarios y recepcionistas no técnicos, incluyendo personas de 50+ años. La interfaz debe entenderse en 5 segundos, sin curva de aprendizaje.

**Ubicación del nuevo proyecto:** `/Users/luismerino/Desktop/vera-dashboard` (repo git propio, ya inicializado, independiente del repo `vera-saas`).

## 2. Estética — "Bold minimalism" premium

Minimalismo audaz, editorial, futurista pero cálido (no fintech fría). Referencias de vibe: MediMonks (calidez, cards de features) y TrueVox (claridad de flujos/"cómo funciona"), pero en verde en vez de azul.

Principios no negociables:
- **Un elemento protagonista por vista.** Todo lo demás respira alrededor de él.
- **Espacio negativo generoso.** Si hay duda entre agregar o quitar, se quita.
- **Contraste de escala brutal:** números clave gigantes (48–64px, peso 700+), labels diminutos en mayúsculas con letter-spacing amplio (ej. "CLIENTES RECUPERADOS").
- **Restricción de color estricta:** verde bosque (marca) y esmeralda (acción/éxito) son visualmente distintos a propósito — nunca se funden. Miel es el único acento cálido y se usa con moderación quirúrgica (si aparece en más de ~10% de la superficie de una vista, es demasiado).
- **Pulido en el detalle**, no en el volumen: hover con elevación sutil (1–2px, sombra que crece), transiciones 150–200ms ease-out, focus rings consistentes y visibles (accesibilidad), esquinas 16–24px en cards, sombras ultra suaves (nunca duras/negras planas).
- La barra de calidad es "lo hizo un diseñador senior": grid de spacing consistente (escala 4/8px, nunca valores sueltos como 13px o 22px salvo en tipografía), tipografía con jerarquía deliberada, cero elementos decorativos que no cumplan una función.

## 3. Stack técnico

- **Next.js 15**, App Router, TypeScript estricto, Server Components por defecto (Client Components solo donde haya interactividad: tabs, dropdowns, formularios, toggles).
- **Tailwind CSS v4** con tokens semánticos vía `@theme inline` (mismo patrón que `vera-saas/src/styles.css`, adaptado a la paleta nueva) — evitar clases con colores literales (`bg-green-600`), todo vía variables semánticas.
- **shadcn/ui** (Radix + Tailwind) como base de primitivos accesibles: dialog, dropdown-menu, tabs, select, switch, tooltip, sheet (para nav mobile).
- **next-themes** para dark mode con toggle persistido (localStorage + `prefers-color-scheme` como default inicial).
- **Recharts** para los gráficos de Reportes (ya usado en el proyecto base, funciona bien con React 19/Next 15).
- **Fraunces** (Google Fonts, variable, pesos editoriales) para títulos/saludos/estados vacíos. **Inter** (Google Fonts, variable) para UI y cuerpo. Ambas vía `next/font/google` (self-hosted automáticamente, sin CLS).
- Gestor de paquetes: a decidir en el plan (npm/pnpm/bun) — no es una decisión de diseño.

## 4. Paleta y tokens

Todos los colores viven como variables CSS semánticas (`--background`, `--card`, `--vera-forest`, etc.), mapeadas a utilidades Tailwind vía `@theme inline`, igual que hace el proyecto base hoy. Dos temas: `:root` (light, default) y `.dark` (dark).

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--vera-forest` | `#1E3A2F` | `#1E3A2F` (se mantiene vivo) | Marca: sidebar, headers, texto fuerte |
| `--vera-forest-deep` | `#14261D` | `#14261D` (fondo base dark) | Superficies oscuras |
| `--background` | `#F4F1E8` (hueso cálido) | `#14261D` | Fondo principal |
| `--card` | `#FFFFFF` | superficie verde oscura elevada (derivada, ej. `#1B2E23`) | Cards y superficies elevadas |
| `--sage` | `#E4EAE0` | variante oscura equivalente | Fondos de sección suaves |
| `--emerald` (éxito/acción) | `#3E9B6B` | `#3E9B6B` | CTAs, botones primarios, confirmado |
| `--honey` (acento único) | `#E0A458` | `#E0A458` | Badges de advertencia, "refuerzo pronto" |
| `--coral` (peligro) | `#D8654F` | `#D8654F` | Vencido, cita perdida — nunca rojo bomberil |
| `--slate-info` | `#5A7A8C` | `#5A7A8C` | Info neutral |
| `--ink` / `--ink-soft` | `#2A2A26` / `#6B6B63` | invertidos apropiadamente | Texto principal/secundario |

Radii: `--radius-md: 16px`, `--radius-lg: 20px`, `--radius-xl: 24px`. Sombras: `--shadow-card` (ultra suave, `0 1px 2px rgba(30,58,47,0.06)`), `--shadow-elevated` (`0 8px 30px -12px rgba(30,58,47,0.18)`).

## 5. Información y navegación

Nav fija (sin lógica de roles en esta fase — se puede reintroducir en una fase futura si el negocio lo pide), 8 items, sidebar con íconos + labels en desktop, colapsable a sheet en mobile:

`Inicio · Recordatorios · Pacientes · Agenda · Vacunas · Sala · Registrar · Reportes`

`/carnet/[id]` y `/login` viven fuera del shell de navegación (sin sidebar).

## 6. Pantallas — especificación por página

### 6.1 `/login`
Pantalla simulada, cálida, con el sistema de diseño nuevo (fondo hueso, tipografía Fraunces en el saludo/nombre del producto). Formulario simple (email/password) sin validación real contra backend — submit redirige a `/`. Sienta las bases visuales para cuando exista Django + auth real.

### 6.2 `/` Inicio
- Saludo grande en Fraunces: "Buenos días, Dr. Álvarez".
- Fila de métricas hero: 4 números gigantes con label diminuto en mayúsculas — Clientes recuperados este mes, Recordatorios enviados, Citas confirmadas, Ingresos recuperados ($).
- Card destacada "Pacientes que vuelven esta semana": fotos de mascotas + nombre + motivo (2da dosis, refuerzo, control post-op). Debe ser escaneable en 5 segundos — sin texto de relleno.
- Fecha "hoy" derivada de `new Date()` real (corrige el bug del `HOY_ISO` hardcodeado del proyecto base).

### 6.3 `/recordatorios` (fusiona Recordatorios + Mensajes del proyecto base)
El corazón del producto. Dos tabs:
- **Conversaciones**: bandeja estilo WhatsApp real — burbujas de chat con los mensajes automáticos de Vera (ej. "¡Hola, María! A Rocky le toca su refuerzo de vacuna esta semana en [Su Clínica]. ¿Le agendo el jueves a las 4:00 p.m.?"). Estados con color: enviado / respondido / agendado / sin respuesta.
- **Programados**: cola de próximos envíos, con pausar/reanudar y editar mensaje antes de que salga (igual funcionalidad que `recordatorios.tsx` del proyecto base).
Debe sentirse vivo y automático, no un CRM aburrido.

### 6.4 `/pacientes` y `/pacientes/[id]`
- Lista: foto, especie, dueño, "próximo pendiente" (badge miel/coral si aplica). Buscador + filtros por estado (igual funcionalidad que hoy).
- Expediente (`[id]`): header con foto grande + datos. **Timeline visual de vacunas** (reemplaza el anillo de progreso `PatientRing` del proyecto base) — dosis aplicadas marcadas ✓ en orden cronológico, próximas dosis pendientes visibles en la misma línea de tiempo. Debajo: consultas, exámenes, procedimientos (historial clínico, igual estructura que hoy). Botón WhatsApp directo al dueño. Link a carnet público.

### 6.5 `/agenda`
Calendario **semanal** (cambio respecto al mensual del proyecto base, según el brief). Citas confirmadas por WhatsApp resaltadas visualmente distinto de las no confirmadas. Mucho aire entre celdas — no debe sentirse una hoja de cálculo.

### 6.6 `/vacunas` (pantalla nueva)
La "memoria automática" de Vera. Lista de pacientes priorizada por urgencia (vencido = coral, por vencer pronto = miel, al día = no aparece o aparece al final atenuado). Botón de "enviar recordatorio" en un tap por fila. Es una vista derivada/filtrada de la misma data de pacientes — no una entidad nueva en el modelo de datos.

### 6.7 `/sala`
Tablero en vivo: quién atiende a quién y dónde (consultorios, estaciones de grooming, sala de espera), con el mismo modelo conceptual que `sala.tsx` del proyecto base, rediseñado con el nuevo sistema visual (sin estilos inline, tokens consistentes).

### 6.8 `/registrar`
Flujo rápido de registro de visita: buscar paciente → elegir tipo de servicio → producto → nota clínica opcional → confirmación con toast explicando qué recordatorio se programó automáticamente. Misma lógica que `registrar.tsx` del proyecto base, nuevo look.

### 6.9 `/reportes` (pantalla nueva)
Gráficos simples con Recharts: recordatorios enviados vs. respondidos por semana/mes, ingresos recuperados por mes. Debe mantener la misma disciplina visual (nada de dashboards de BI recargados) — 2-3 gráficos grandes y claros, no una grilla de 12 mini-charts.

### 6.10 `/carnet/[id]`
Página pública, mobile-only, estilo "Apple Wallet", sin nav del dashboard. Vacunas del paciente, próxima cita, CTA de WhatsApp para agendar. Es el "loop viral" — el dueño de la mascota la ve y comparte/vuelve.

## 7. Capa de datos mock

`lib/data/` contiene funciones async por entidad, con el mismo nombre y forma que tendrán los futuros endpoints de Django REST:

```
lib/data/
  pacientes.ts    → getPacientes(), getPaciente(id), getPendientesVacunas()
  visitas.ts      → getVisitasHoy(), getVisitasProximas(fecha)
  recordatorios.ts→ getRecordatoriosProgramados(), getConversaciones()
  sala.ts         → getSesionesActivas(), getSalaEspera(), getEstaciones()
  empleados.ts    → getEmpleados()
  seed/           → datos estáticos TS (migrados y ampliados desde vera-data.ts del proyecto base)
```

Cada función hoy resuelve sobre los datos estáticos de `seed/`, envueltos en una promesa (`async function getPacientes() { return PACIENTES_SEED; }`). En Fase 2, el cuerpo de estas funciones cambia a `fetch(DJANGO_API_URL + "/pacientes")` — los call sites (Server Components que las invocan) no cambian. La fecha "hoy" de referencia se deriva de `new Date()` en tiempo de ejecución, nunca hardcodeada.

## 8. Componentes propios clave

- `AppShell` / `Sidebar` / `MobileNav` — shell de navegación, sin estilos inline, solo utilidades Tailwind sobre tokens.
- `VaccineTimeline` — pieza visual insignia del expediente (reemplaza `PatientRing`).
- `MetricHero` — número gigante + label mayúscula, reusado en Inicio y Reportes.
- `WhatsAppBubble` — burbuja de chat, variantes por autor (vera/dueño).
- `ReminderQueueItem` — fila de la cola de programados con pausar/editar.
- `UrgencyBadge` — badge coral/miel/esmeralda reusado en Pacientes, Vacunas, Agenda.
- `ThemeToggle` — switch de dark mode.

## 9. Accesibilidad y UX para usuarios no técnicos

- Contraste AA mínimo en todos los pares texto/fondo, incluyendo los estados coral/miel sobre blanco y sobre verde oscuro.
- Tamaños de texto base generosos (nunca menor a 14px para texto funcional; 16px en inputs para evitar zoom automático en iOS).
- Áreas táctiles mínimas 44×44px en toda acción (botones, filas de lista, badges clicables).
- Sin jerga técnica en ningún copy — todo en español cercano y humano, igual tono que el proyecto base.
- Estados vacíos con tipografía grande y amable (Fraunces), nunca un mensaje gris genérico de "no data".

## 10. No-goals de esta fase

- Sin Django, sin base de datos real, sin AWS/infra/deploy.
- Sin autenticación real (login es visual/simulado).
- Sin landing page de marketing pública.
- Sin lógica de roles/permisos (nav fija para todos).
- Tests: unitarios básicos opcionales, a definir en el plan de implementación — no es bloqueante para el diseño.

## 11. Referencias

- Proyecto base funcional (qué pantallas y datos existen hoy): `/Users/luismerino/Desktop/vera-saas`.
- Brief de diseño completo proporcionado por el usuario (paleta, tipografía, layout, pantallas clave) — capturado íntegramente en las secciones 2–6 de este documento.
