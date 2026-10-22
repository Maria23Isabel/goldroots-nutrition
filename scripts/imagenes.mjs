// Genera las versiones pequeñas de las fotos oficiales de public/brand/ a partir de los archivos maestros (que no se tocan).
// Un celular de 375 px con pantalla 2x pide ~750 px: sin estas versiones bajaría la de 900 px o la de 1600 px completa.
// Uso: node scripts/imagenes.mjs   (se vuelve a correr solo si cambia un archivo maestro)
import { statSync } from 'node:fs';
import sharp from 'sharp';

const TAREAS = [
  { de: 'fuentes/hero-gold.jpg', a: 'public/brand/hero-gold.webp', ancho: 1600, calidad: 84 },
  { de: 'fuentes/hero-gold.jpg', a: 'public/brand/hero-gold-900.webp', ancho: 900, calidad: 82 },
  { de: 'fuentes/hero-gold.jpg', a: 'public/brand/hero-gold-640.webp', ancho: 640, calidad: 80 },
  { de: 'public/brand/floating.webp', a: 'public/brand/floating-640.webp', ancho: 640, calidad: 80 },
  { de: 'fuentes/logo-gold.webp', a: 'public/brand/logo-gold-240.webp', ancho: 240, calidad: 90 },
];

// Imagen de respaldo de las fichas: la marca, discreta, sobre blanco (las fotos se funden con multiply, así que el blanco no deja recuadro).
// Se usa solo cuando un producto no tiene foto o no carga; no representa ningún producto.
const logo = await sharp('fuentes/logo-gold.webp').resize({ width: 300 }).ensureAlpha().toBuffer();
const tenue = await sharp(logo).composite([{ input: Buffer.from([0, 0, 0, 110]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: 'dest-in' }]).png().toBuffer();
await sharp({ create: { width: 604, height: 900, channels: 3, background: '#ffffff' } })
  .composite([{ input: tenue, gravity: 'centre' }])
  .webp({ quality: 80, effort: 6 })
  .toFile('public/brand/placeholder-producto.webp');
console.log(`public/brand/placeholder-producto.webp: ${(statSync('public/brand/placeholder-producto.webp').size / 1024).toFixed(1)} KB`);

for (const { de, a, ancho, calidad } of TAREAS) {
  await sharp(de).resize({ width: ancho }).webp({ quality: calidad, effort: 6 }).toFile(a);
  console.log(`${a}: ${(statSync(a).size / 1024).toFixed(1)} KB (de ${(statSync(de).size / 1024).toFixed(1)} KB)`);
}
