// Genera las versiones pequeñas de las fotos oficiales de public/brand/ a partir de los archivos maestros (que no se tocan).
// Un celular de 375 px con pantalla 2x pide ~750 px: sin estas versiones bajaría la de 900 px o la de 1600 px completa.
// Uso: node scripts/imagenes.mjs   (se vuelve a correr solo si cambia un archivo maestro)
import { statSync } from 'node:fs';
import sharp from 'sharp';

const TAREAS = [
  { de: 'fuentes/hero-cover.jpg', a: 'public/brand/hero-cover.webp', ancho: 1600, calidad: 84 },
  { de: 'fuentes/hero-cover.jpg', a: 'public/brand/hero-cover-900.webp', ancho: 900, calidad: 82 },
  { de: 'fuentes/hero-cover.jpg', a: 'public/brand/hero-cover-640.webp', ancho: 640, calidad: 80 },
  { de: 'public/brand/floating.webp', a: 'public/brand/floating-640.webp', ancho: 640, calidad: 80 },
  { de: 'fuentes/logo-gold.webp', a: 'public/brand/logo-gold-240.webp', ancho: 240, calidad: 90 },
];

for (const { de, a, ancho, calidad } of TAREAS) {
  await sharp(de).resize({ width: ancho }).webp({ quality: calidad, effort: 6 }).toFile(a);
  console.log(`${a}: ${(statSync(a).size / 1024).toFixed(1)} KB (de ${(statSync(de).size / 1024).toFixed(1)} KB)`);
}
