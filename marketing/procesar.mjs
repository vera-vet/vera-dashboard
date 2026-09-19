// Convierte las capturas PNG a WebP y AVIF (1x y 2x) y el video a MP4 y WebM con poster.
// Uso: node marketing/procesar.mjs  (después de `playwright test -c marketing/playwright.config.ts`)
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegStatic from "ffmpeg-static";
import sharp from "sharp";

const SALIDA = path.join(path.dirname(fileURLToPath(import.meta.url)), "salida");
const WEB = path.join(SALIDA, "web");
const LIMITE_IMAGEN = 200 * 1024;
const LIMITE_VIDEO = 3 * 1024 * 1024;
mkdirSync(WEB, { recursive: true });

const kb = (archivo) => Math.round(statSync(archivo).size / 1024);
const avisos = [];

// Escritorio se captura a 1440 px @2x y móvil a 390 px @3x: se exportan en 1x y 2x del ancho CSS.
for (const archivo of readdirSync(path.join(SALIDA, "capturas")).filter((a) => a.endsWith(".png"))) {
  const nombre = archivo.replace(/\.png$/, "");
  const origen = path.join(SALIDA, "capturas", archivo);
  const { width } = await sharp(origen).metadata();
  const anchoCss = nombre.startsWith("movil") ? Math.round(width / 3) : Math.round(width / 2);
  for (const escala of [1, 2]) {
    const base = sharp(origen).resize({ width: anchoCss * escala });
    const salidas = [
      [`${nombre}@${escala}x.webp`, base.clone().webp({ quality: 78, effort: 6 })],
      [`${nombre}@${escala}x.avif`, base.clone().avif({ quality: 55, effort: 6 })],
    ];
    for (const [destino, imagen] of salidas) {
      const ruta = path.join(WEB, destino);
      await imagen.toFile(ruta);
      if (statSync(ruta).size > LIMITE_IMAGEN) avisos.push(`${destino}: ${kb(ruta)} KB (> 200 KB)`);
    }
  }
  console.log(`imagen  ${nombre}  (${anchoCss}px)`);
}

const webm = path.join(SALIDA, "video", "vera-demo.webm");
// ffmpeg-static trae un binario con libx264 y libvpx: no depende del ffmpeg del sistema.
const ffmpeg = (...args) => execFileSync(ffmpegStatic, ["-y", "-nostdin", "-loglevel", "error", "-i", webm, ...args]);
const mp4 = path.join(WEB, "vera-demo.mp4");
const webmFinal = path.join(WEB, "vera-demo.webm");
ffmpeg("-an", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4);
ffmpeg("-an", "-c:v", "libvpx-vp9", "-crf", "44", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", webmFinal);
const posterPng = path.join(SALIDA, "video", "poster.png");
ffmpeg("-ss", "2", "-frames:v", "1", posterPng);
await sharp(posterPng).webp({ quality: 78 }).toFile(path.join(WEB, "vera-demo-poster.webp"));
for (const ruta of [mp4, webmFinal]) {
  console.log(`video   ${path.basename(ruta)}  ${kb(ruta)} KB`);
  if (statSync(ruta).size > LIMITE_VIDEO) avisos.push(`${path.basename(ruta)}: ${kb(ruta)} KB (> 3 MB)`);
}

if (avisos.length) {
  console.error(`\nFuera de presupuesto:\n  ${avisos.join("\n  ")}`);
  process.exitCode = 1;
}
console.log(`\nListo: ${WEB}`);
