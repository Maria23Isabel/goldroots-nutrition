// Lo que va después de `vite build`:
//   - 404.html: GitHub Pages no reenvía las rutas limpias al index; con esta copia /product/shilajit-gold abre igual
//   - sitemap.xml y robots.txt: para que Google lea las 14 fichas y el catálogo
//   - .nojekyll: Pages no procese los archivos con Jekyll
// Uso: node scripts/postbuild.mjs [--pages]
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST = resolve('dist');
const BASE = process.argv.includes('--pages') ? '/goldroots-nutrition/' : '/';
const HOST = process.env.VITE_SITE_URL || (process.argv.includes('--pages') ? 'https://maria23isabel.github.io' : 'http://localhost:5176');
const url = (path) => `${HOST}${BASE}${String(path).replace(/^\//, '')}`;

const products = JSON.parse(readFileSync('src/data/productos.generado.json', 'utf8'));
const ROUTAS = ['/', '/catalog', '/wholesale', '/about', '/contact', '/legal/terms', '/legal/privacy', ...products.map((p) => `/product/${p.slug}`)];

copyFileSync(resolve(DIST, 'index.html'), resolve(DIST, '404.html'));
writeFileSync(resolve(DIST, '.nojekyll'), '');
writeFileSync(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTAS.map((r) => `  <url><loc>${url(r)}</loc></url>`).join('\n')}
</urlset>\n`);
writeFileSync(resolve(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${url('/sitemap.xml')}\n`);

console.log(`postbuild: 404.html, sitemap.xml (${ROUTAS.length} URLs) y robots.txt en dist/`);
