// Trae las marcas publicadas (con página generada) y sus productos desde Herbavida, y los deja listos para la vitrina:
//   - src/data/marcas.generado.json  → marcas con página generada y sus productos
//   - src/data/categorias.generado.json → categorías de los productos
//   - public/products/<slug>.webp      → foto reducida a 900 px de alto
// Uso: npm run datos:herbavida
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const HERBAVIDA_API = process.env.HERBAVIDA_API_URL ?? 'https://herbavidaperu.com';

const res = await fetch(`${HERBAVIDA_API}/api/showcase/brands`);
if (!res.ok) throw new Error(`Herbavida respondió ${res.status}`);
const brands = await res.json();

mkdirSync('public/products', { recursive: true });
mkdirSync('src/data', { recursive: true });

const allCategories = new Map();
const allProducts = [];

for (const brand of brands) {
  console.log(`\n${brand.name}: ${brand.products.length} productos`);

  for (const p of brand.products) {
    // Descargar la foto si existe
    if (p.image?.url) {
      try {
        const bytes = Buffer.from(await (await fetch(p.image.url)).arrayBuffer());
        await sharp(bytes).resize({ height: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/products/${p.slug}.webp`);
        p.image.localPath = `products/${p.slug}.webp`;
      } catch (err) {
        console.warn(`  ⚠ No se pudo descargar la foto de ${p.slug}: ${err.message}`);
        p.image.localPath = null;
      }
    } else {
      p.image = { localPath: null };
    }

    // Acumular categorías
    if (p.category) {
      allCategories.set(p.category.id, p.category);
    }

    allProducts.push({
      slug: p.slug,
      name: p.name,
      brandId: brand.id,
      brandName: brand.name,
      categoryId: p.category?.id ?? null,
      categoryName: p.category?.name ?? null,
      categorySlug: p.category?.slug ?? null,
      price: p.retailPrice,
      compareAt: p.priceTiers?.[0]?.originalPrice ?? null,
      presentation: p.presentation,
      productForm: p.productForm,
      shortDescription: p.shortDescription,
      image: p.image.localPath,
      isFeatured: p.isFeatured,
      availability: p.availability,
    });

    console.log(`  ${p.slug}: ${p.retailPrice ? `S/ ${p.retailPrice}` : 'sin precio'}`);
  }
}

const categorias = [...allCategories.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));

writeFileSync('src/data/marcas.generado.json', `${JSON.stringify(brands, null, 2)}\n`);
writeFileSync('src/data/categorias.generado.json', `${JSON.stringify(categorias, null, 2)}\n`);
writeFileSync('src/data/productos.generado.json', `${JSON.stringify(allProducts, null, 2)}\n`);

console.log(`\nListo: ${brands.length} marcas, ${categorias.length} categorías, ${allProducts.length} productos`);
