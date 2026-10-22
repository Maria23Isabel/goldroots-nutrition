// Lo que va después de `vite build`:
//   - una carpeta con su index.html por ruta: GitHub Pages responde 404 a las rutas limpias aunque tengan contenido,
//     y así el catálogo y las 14 fichas salen en 200 para el navegador y para Google
//   - 404.html: sigue haciendo falta para cualquier dirección escrita a mano que no exista
//   - sitemap.xml y robots.txt: para que Google lea las 14 fichas y el catálogo
//   - .nojekyll: Pages no procese los archivos con Jekyll
// Uso: node scripts/postbuild.mjs [--pages]
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST = resolve('dist');
const BASE = process.argv.includes('--pages') ? '/goldroots-nutrition/' : '/';
const HOST = process.env.VITE_SITE_URL || (process.argv.includes('--pages') ? 'https://maria23isabel.github.io' : 'http://localhost:5176');
const url = (path) => {
  const clean = String(path).replace(/^\/|\/$/g, '');
  return `${HOST}${BASE}${clean ? `${clean}/` : ''}`;
};

// Las fichas vienen de Herbavida, no del código: para el mapa del sitio (y una carpeta por ficha) se leen del mismo catálogo público al compilar.
// Si Herbavida no responde, el mapa lleva solo las páginas fijas y se avisa; las fichas siguen abriendo en vivo (la configuración de Cloudflare cae a la aplicación).
let products = [];
if (process.env.VITE_CATALOG_API) {
  try {
    const response = await fetch(`${process.env.VITE_CATALOG_API}/api/public/sites/goldroots/catalog`, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`respondió ${response.status}`);
    products = ((await response.json()).products ?? []).filter((p) => typeof p.slug === 'string' && /^[a-z0-9-]+$/.test(p.slug));
  } catch (error) {
    console.warn(`postbuild: no se pudo leer el catálogo de Herbavida (${error.message}); el mapa del sitio sale sin fichas.`);
  }
}
const ROUTAS = ['/', '/catalogo', '/nosotros', '/contacto', '/legal/terminos', '/legal/privacidad', ...products.map((p) => `/producto/${p.slug}`)];

const pagina = readFileSync(resolve(DIST, 'index.html'), 'utf8');
writeFileSync(resolve(DIST, '404.html'), pagina);
for (const ruta of ROUTAS) {
  if (ruta === '/') continue;
  const carpeta = resolve(DIST, `.${ruta}`);
  mkdirSync(carpeta, { recursive: true });
  writeFileSync(resolve(carpeta, 'index.html'), pagina);
}
writeFileSync(resolve(DIST, '.nojekyll'), '');
// Cloudflare lee _redirects (GitHub Pages lo ignora): las rutas comerciales que ya no existen y las direcciones en inglés de la
// primera versión (con sus QR ya impresos) llevan por 301 a su página nueva, con barra final para no dar un segundo salto.
const REDIRECCIONES = [
  ['/mayoristas', '/catalogo/'],
  ['/wholesale', '/catalogo/'],
  ['/catalog', '/catalogo/'],
  ['/about', '/nosotros/'],
  ['/contact', '/contacto/'],
];
// Las direcciones de producto de la primera versión (/producto/zinc-triple-play) llevan por 301 a la ficha actual del mismo producto: la dirección nueva sale del
// catálogo de Herbavida (lleva su código -hv-NNNNN), por eso solo se escriben las que se pueden resolver ahora. Las que no, siguen resolviéndose en la aplicación.
const legacy = JSON.parse(readFileSync('src/lib/legacy-slugs.json', 'utf8'));
const sinCodigo = (slug) => slug.replace(/-hv-\d+(-\d+)?$/, '');
const heredadas = Object.entries(legacy).flatMap(([antigua, base]) => {
  const actual = products.find((p) => sinCodigo(p.slug) === base);
  return actual ? [`/producto/${antigua} /producto/${actual.slug}/ 301`, `/producto/${antigua}/ /producto/${actual.slug}/ 301`] : [];
});
writeFileSync(
  resolve(DIST, '_redirects'),
  [...heredadas, ...REDIRECCIONES.flatMap(([desde, hacia]) => [`${desde} ${hacia} 301`, `${desde}/ ${hacia} 301`]), '/product/:slug /producto/:slug/ 301', '/product/:slug/ /producto/:slug/ 301', ''].join('\n'),
);
writeFileSync(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTAS.map((r) => `  <url><loc>${url(r)}</loc></url>`).join('\n')}
</urlset>\n`);
writeFileSync(resolve(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${url('/sitemap.xml')}\n`);

console.log(`postbuild: 404.html, sitemap.xml (${ROUTAS.length} URLs) y robots.txt en dist/`);
