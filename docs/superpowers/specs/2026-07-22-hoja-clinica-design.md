# Hoja Clínica Enriquecida — Design Spec

**Fecha:** 2026-07-22
**Estado:** Aprobado, pendiente de plan de implementación.
**Proyecto:** `/Users/luismerino/Desktop/vera-dashboard` (extiende Fase 1 — sigue sobre datos mock, sin backend real).

## 1. Contexto y objetivo

Los veterinarios (feedback directo de una reunión con clínicas reales) pidieron que el expediente del paciente se sienta como una verdadera hoja clínica médica: un diagrama del cuerpo del animal donde se marca la zona tratada (como cuando un doctor humano anota en una silueta dónde te dolió o qué se trató), soporte para especialidades (ej. una clínica con oftalmólogo puede usar un diagrama de ojo en vez de la silueta genérica), fotos adjuntas, alertas automáticas de alergias a medicamentos, y notas de comportamiento/temperamento del paciente.

Esta spec cubre las 5 piezas juntas, todas como una sola expansión cohesiva del expediente existente (Fase 1, Task 14) y del flujo de Registrar (Task 19). **Sigue siendo mock**: no hay persistencia real todavía (un refresh resetea todo, igual que el resto de Fase 1) — eso llega cuando se conecte `vera-api` (Fase 2B, fuera de alcance aquí).

## 2. Modelo de datos (extensiones a `lib/data/types.ts` + nuevos seeds)

### Tipos nuevos

```ts
export type DiagramaTipo = "perro" | "gato" | "otro" | "ojo";

export interface Marca {
  id: string;
  x: number; // 0-100, porcentaje relativo al ancho del diagrama
  y: number; // 0-100, porcentaje relativo al alto del diagrama
  nota: string;
}

export interface Reporte {
  id: string;
  servicioVisitaId: string; // FK al ServicioVisita de esa consulta
  diagramaTipo: DiagramaTipo;
  marcas: Marca[];
  fotos: string[]; // object URLs (URL.createObjectURL) — no persisten tras refresh
}

export interface Especialidad {
  id: string;
  nombre: string; // "Oftalmología"
  tiposServicioAsociados: ServicioTipo[]; // qué tipos de servicio activan esta especialidad
  diagramaId: DiagramaTipo; // "ojo" — qué diagrama usar en vez de la silueta de especie
}
```

### Extensiones a tipos existentes

- `Paciente` gana dos campos: `alergias: string[]` (nombres de compuestos, ej. `["amoxicilina"]`) y `notasComportamiento: string[]` (rasgos libres, ej. `["Babea mucho", "Ladra al llegar"]`). Ambos por defecto arrays vacíos en el seed existente, editables desde el expediente.
- Los objetos de producto usados hoy en `registrar.tsx`'s `TIPOS` (actualmente `{ tipo, label, icon, productos: string[] }`) cambian su `productos` de `string[]` a `{ nombre: string; compuestos?: string[] }[]` — solo los productos con compuestos conocidos (antibióticos, principalmente) llevan `compuestos`; el resto omite el campo.
- `ServicioTipo` (el union existente de 7 valores) NO gana un nuevo valor genérico "especialidad" — en su lugar, los tipos de servicio existentes (`consulta`, `control`, etc.) simplemente pueden estar asociados a una `Especialidad` vía `tiposServicioAsociados`. Para el ejemplo concreto de oftalmología, se agrega **un** valor nuevo al union: `"consulta_oftalmologica"`, que es un tipo de servicio real seleccionable en Registrar como cualquier otro, no una categoría abstracta.

### Nuevos archivos seed

- `lib/data/seed/especialidades.ts` — un único registro sembrado: Oftalmología, asociada a `consulta_oftalmologica`, `diagramaId: "ojo"`.
- `lib/data/seed/reportes.ts` — 1-2 reportes de ejemplo con pines ya puestos, para que el expediente tenga algo que mostrar sin que el usuario tenga que crear uno primero.

## 3. Componente `SiluetaMarcable` (nuevo, `components/shared/silueta-marcable.tsx`)

Un componente que recibe `diagramaTipo` y `marcas`, renderiza un SVG simple (silueta esquemática, no anatómicamente detallada — de perfil, con las zonas grandes reconocibles: cabeza, cuerpo, patas delanteras/traseras, cola; el diagrama de "ojo" es un primer plano esquemático del ojo con zonas como párpado/córnea/etc.), y expone:
- Modo interactivo (usado en Registrar): click en cualquier punto agrega un pin nuevo; un pin existente se puede click para editar/eliminar su nota antes de confirmar.
- Modo solo-lectura (usado en el expediente): los pines se muestran fijos, con su nota visible al hacer hover/tap.

Tres diagramas base construidos en esta fase: `perro`, `gato`, `otro` (silueta genérica de mamífero pequeño, mismas zonas básicas), más `ojo` (el único diagrama de especialidad concreto de esta fase). La arquitectura (un `diagramaId` de string mapeado a un componente SVG) permite agregar más diagramas de especialidad después sin rediseño, pero no se construye ninguno adicional ahora — no hay otra especialidad pedida.

## 4. Flujo de Registrar (extiende Task 19)

Después de elegir producto (paso existente), se agrega un paso final **opcional** (el vet puede confirmar sin completarlo, igual que hoy):
1. Si el producto elegido tiene `compuestos` que intersectan `paciente.alergias`, se muestra una alerta bloqueante (banner rojo/coral con la coincidencia exacta) antes de poder continuar a este paso — el vet puede igual proceder tras verla (no se le impide dar el medicamento, es una alerta informativa, la decisión clínica es suya), pero no puede ignorarla sin verla.
2. `SiluetaMarcable` en modo interactivo — `diagramaTipo` se resuelve así: si el tipo de servicio elegido está en `tiposServicioAsociados` de alguna `Especialidad`, se usa su `diagramaId` (ej. "ojo"); si no, se usa la especie del paciente (`perro`/`gato`/`otro`).
3. Botón "Agregar foto" — `<input type="file" accept="image/*">`, cada archivo elegido se previsualiza vía `URL.createObjectURL` y se agrega a `fotos` (solo en memoria del componente — no persiste tras refresh, mismo comportamiento que el resto del mock).
4. Confirmar crea el `ServicioVisita` (como hoy) más un `Reporte` nuevo vinculado a él.

## 5. Expediente del paciente (extiende Task 14)

- Nueva sección "Datos clínicos": `alergias` y `notasComportamiento`, cada una como una lista de chips editable (agregar/quitar) — mismo patrón visual que los badges de urgencia ya usados en la app.
- El historial de visitas (lista existente de `ServicioVisita`) ahora es expandible: si un servicio tiene un `Reporte` asociado, un chevron lo expande mostrando `SiluetaMarcable` en modo solo-lectura + las fotos adjuntas de esa consulta.

## 6. Ajustes (nav item nuevo — 9no ítem)

Nueva ruta `/ajustes`, nueva entrada de nav (ícono `Settings` de lucide-react). Pantalla simple: lista de especialidades de la clínica (solo Oftalmología sembrada), cada una mostrando su nombre y los tipos de servicio asociados. Por ahora de solo lectura/demo (ver la config, no un CRUD completo de especialidades) — construir un editor completo de especialidades no fue pedido; lo pedido es que el sistema *use* la especialidad para elegir el diagrama correcto, que es lo que Registrar y el expediente ya hacen.

## 7. Carnet público (extiende Task 21) — cambio mínimo

Se agrega una línea de texto: resumen de la última visita (ej. "Última visita: Consulta general — 12 de julio"). Sin diagrama, sin fotos, sin notas de comportamiento — eso es exclusivamente para uso interno del vet, nunca visible al dueño.

## 8. No-goals de esta fase

- Sin persistencia real — todo se resetea al refrescar, igual que el resto de Fase 1.
- Sin dibujo libre sobre el diagrama — solo pines con nota de texto.
- Sin más de un diagrama de especialidad construido (solo "ojo") — la arquitectura soporta más, pero no se construyen especialidades hipotéticas.
- Sin CRUD completo de especialidades en Ajustes — solo lectura de la configuración sembrada.
- Sin el diagrama/fotos/notas de comportamiento visibles en el Carnet del dueño.
- Sin subida real de archivos (las fotos son URLs de objeto en memoria del navegador, no se suben a ningún lado).

## 9. Referencias

- Spec y plan de Fase 1: `docs/superpowers/specs/2026-07-20-vera-dashboard-design.md`, `docs/superpowers/plans/2026-07-20-vera-dashboard-plan.md`.
- Página de expediente actual: `app/(dashboard)/pacientes/[id]/page.tsx` (Task 14).
- Flujo de Registrar actual: `app/(dashboard)/registrar/registrar-client.tsx` (Task 19).
- Carnet actual: `app/carnet/[id]/page.tsx` (Task 21).
