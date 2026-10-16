// Trae el catálogo de la tienda actual (https://goldrootsvitamins.com/products.json, público) y lo deja listo para el prototipo:
//   - src/data/productos.generado.json  → nombre, precio, precio anterior, beneficios, ingredientes, formato, objetivo y foto
//   - public/products/<enlace>.webp      → foto reducida a 900 px de alto (así el prototipo no depende de Shopify cuando se cancele)
// Uso: npm run datos
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SHOP = 'https://goldrootsvitamins.com';

// Los cuatro productos de ejemplo de la tienda traen un enlace de plantilla; aquí se les da uno propio
const SLUGS = {
  'asset-pack-42263216130-example-product-1': 'beet-root-complex-l-arginine',
  'asset-pack-42263216130-example-product-2': 'maca-root-extra-strength',
  'asset-pack-42263216130-example-product-3': 'selenium-200-mcg',
  'asset-pack-42263216130-example-product-4': 'zinc-triple-play',
};

// Para qué sirve cada uno (filtro del catálogo)
const GOAL = {
  'shilajit-gold': 'energy',
  'maca-root-extra-strength': 'energy',
  'nad-resveratrol-coenzyme-q10': 'energy',
  'nitric-oxide-l-arginine-l-citrulline': 'heart',
  'beet-root-complex-l-arginine': 'heart',
  'vitamin-k2-d3': 'heart',
  'lions-mane-blend-complex': 'brain',
  'ashwagandha-melatonin-magnesium': 'sleep',
  'vision-pro': 'eye-skin',
  astaxanthin: 'eye-skin',
  'zinc-triple-play': 'immune',
  'selenium-200-mcg': 'immune',
  'turmeric-curcumin': 'immune',
  'milk-thistle': 'immune',
};

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const strip = (html) => decode(html.replace(/<br[^>]*>/gi, '\n').replace(/<[^>]+>/g, ''));
// La tienda trae un carácter roto delante de cada viñeta («�»): se quita junto con cualquier símbolo suelto
const clean = (line) => line.replace(/^[^\p{L}\p{N}(]+/u, '').trim();

function parse(html) {
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => m[1]);
  const out = { headline: '', summary: '', benefits: [], ingredients: [], format: '' };
  for (const raw of paragraphs) {
    const text = strip(raw).trim();
    if (/^key benefits/i.test(text)) out.benefits = text.split('\n').slice(1).map(clean).filter(Boolean);
    else if (/^ingredients/i.test(text)) out.ingredients = text.split('\n').slice(1).join(' ').split(/[•·�]/).map(clean).filter(Boolean);
    else if (/capsules|softgels|tablets|gummies|powder/i.test(text) && text.length < 60) out.format = text;
    else if (!out.headline) out.headline = text;
    else if (!out.summary) out.summary = text;
  }
  return out;
}

const res = await fetch(`${SHOP}/products.json?limit=250`);
if (!res.ok) throw new Error(`La tienda respondió ${res.status}`);
const { products } = await res.json();
mkdirSync('public/products', { recursive: true });

const result = [];
for (const [index, p] of products.entries()) {
  const slug = SLUGS[p.handle] ?? p.handle;
  const variant = p.variants[0];
  const price = Number(variant.price);
  const compareAt = variant.compare_at_price ? Number(variant.compare_at_price) : null;
  const info = parse(p.body_html ?? '');
  const image = p.images[0];
  if (image) {
    const bytes = Buffer.from(await (await fetch(image.src)).arrayBuffer());
    await sharp(bytes).resize({ height: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/products/${slug}.webp`);
  }
  result.push({
    slug,
    name: p.title,
    goal: GOAL[slug] ?? 'immune',
    price: price > 0 ? price : null,
    compareAt: compareAt && compareAt > price ? compareAt : null,
    ...info,
    image: image ? `products/${slug}.webp` : null,
    featured: index < 14 && ['zinc-triple-play', 'selenium-200-mcg', 'maca-root-extra-strength', 'beet-root-complex-l-arginine'].includes(slug),
  });
  console.log(`${slug}: ${info.benefits.length} beneficios, ${info.ingredients.length} ingredientes, $${price}`);
}

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/productos.generado.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(`Listo: ${result.length} productos`);
