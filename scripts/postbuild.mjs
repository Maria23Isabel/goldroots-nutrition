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

const products = JSON.parse(readFileSync('src/data/productos.generado.json', 'utf8'));
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
writeFileSync(
  resolve(DIST, '_redirects'),
  [...REDIRECCIONES.flatMap(([desde, hacia]) => [`${desde} ${hacia} 301`, `${desde}/ ${hacia} 301`]), '/product/:slug /producto/:slug/ 301', '/product/:slug/ /producto/:slug/ 301', ''].join('\n'),
);
writeFileSync(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTAS.map((r) => `  <url><loc>${url(r)}</loc></url>`).join('\n')}
</urlset>\n`);
writeFileSync(resolve(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${url('/sitemap.xml')}\n`);

console.log(`postbuild: 404.html, sitemap.xml (${ROUTAS.length} URLs) y robots.txt en dist/`);
