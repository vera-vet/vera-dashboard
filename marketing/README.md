# Capturas y video de marketing (VER-83)

Genera las capturas y el video de la landing con **Vera real** corriendo contra la clínica
ficticia "Clínica Veterinaria San Benito" (`seed_marketing` en `vera-api`). Nada es simulado:
solo se muestran flujos que existen, y las cifras salen de los datos sembrados.

## Requisitos

- La API corriendo en `localhost:8000` (ver `../vera-api/AGENTS.md`) y `vera-api` clonado al lado.
- `npm run build` hecho (se captura el build de producción).
- Opcional: `vera-landing-page` clonado al lado, para mostrar la foto de Dante.

## Uso

```bash
npm run build
npm run capturas
```

`npm run capturas`:

1. recrea la clínica demo con una contraseña aleatoria (`marketing/setup.ts`);
2. toma las capturas (`capturas.captura.ts`) y graba el video con subtítulos
   (`video.captura.ts`);
3. convierte todo con `procesar.mjs`: WebP y AVIF en 1x y 2x (menos de 200 KB cada una), y
   MP4 (H.264) y WebM con poster (menos de 3 MB). Si algo se pasa, falla.

La salida queda en `marketing/salida/web/` (ignorada por git). De ahí se copian a
`vera-landing-page/public/producto/` en un PR de la landing.

## Qué se captura

- **Escritorio** (1440×900 @2x): Inicio, Agenda, expediente de Dante y Reportes.
- **Móvil** (390×844 @3x): Registrar, la conversación de WhatsApp (solo el panel, para ponerla
  en un marco de teléfono en la landing) y el carnet digital.
- **Video** (1280×800, unos 30 s): Inicio → registrar Rabia a Dante en un toque → confirmación
  de que Vera programó el recordatorio → conversación de WhatsApp confirmada → agenda → Reportes.

El saludo del Inicio depende de la hora real de El Salvador: para que diga "Buenos días", corre
el script entre las 5:00 y las 11:59.

Cuando exista la atribución de citas recuperadas, se agrega esa escena.
