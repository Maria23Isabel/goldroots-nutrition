# Gold Roots Nutrition — experiencia de marca

Sitio **corporativo e informativo** de la línea, sobre los productos reales de [goldrootsvitamins.com](https://goldrootsvitamins.com/).
No es una tienda: no muestra precios, no tiene carrito, cantidades ni flujo de compra, y no guarda nada en el navegador.

## Qué es

- **Solo información**: catálogo con búsqueda y filtros por los 6 objetivos, fichas con descripción, ingredientes, presentación y beneficios declarados, más la marca, el contacto y las páginas legales.
- **Los 14 productos reales**: nombre, beneficios, ingredientes, formato y foto salen de la tienda (`npm run datos`). El JSON conserva los precios de origen, pero `src/lib/products.ts` los deja fuera del contrato del sitio (lo comprueba `tests/products.test.ts`).
- **Identidad sacada de sus propios archivos**: marfil `--color-canvas`, azul tinta `--color-night` `#22375c`, dorado `--color-accent` `#c09550` (versión legible `--color-accent-deep` `#826018`) y verde botánico secundario, con Playfair Display para títulos e Inter para lectura (`src/styles.css`). El logo y la foto de la línea están en `public/brand/`.
- **Narrativa de scroll** en la portada: héroe editorial con luces en movimiento y escena fija (`sticky`) donde las placas de los frascos se recomponen con el scroll (Motion para React). Todo el movimiento pesado se apaga por debajo de 900 px y con `prefers-reduced-motion`.
- **Todo en español**: la traducción de los 14 productos vive en `src/data/productos.es.ts` (el JSON de la tienda sigue en inglés y `lib/products.ts` los une por `slug`). Las direcciones en inglés de la versión anterior redirigen a las nuevas.
- **Rutas limpias**: `/catalogo`, `/producto/shilajit-gold`, `/nosotros`, `/contacto`, `/legal/…`. `/mayoristas` y `/wholesale` redirigen a `/nosotros`; las carpetas con `index.html` por ruta y el `404.html` las escribe `scripts/postbuild.mjs`.
- **Accesible y rápida**: texto salteable, LANDMARKS reales, filtros con `aria-pressed`, foco visible, contraste AA, `prefers-reduced-motion`, fotos con `lazy`/`decoding` y espacio reservado, `sitemap.xml` y metadatos por pantalla.

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:5176
npm run test       # vitest
npm run typecheck
npm run build      # dist/ + 404.html + sitemap.xml + robots.txt
```

## Datos del negocio que faltan

No se inventa nada. Mientras la marca no lo confirme, la pantalla lo muestra como pendiente:

- **WhatsApp oficial** (hoy `src/lib/site.ts` trae un número provisional de ejemplo, +1 202 555 0143, para ver el diseño completo; **no es de la marca**. Para el oficial: ponerlo en `site.ts` o pasar `VITE_WHATSAPP` al compilar), horario, dirección y redes → `src/lib/site.ts`
- textos legales definitivos y aviso FDA (el texto actual es el de la tienda original, pendiente de revisión)
- certificaciones que aparecen en el arte de las fotos pero no están confirmadas (orgánico, third-party tested, GMP, Made in USA, vegano): no se publican y esas imágenes no se usan

## Publicar

El hosting es Cloudflare (Worker de solo archivos, `wrangler.jsonc`):

```bash
npx wrangler login          # una vez
npm run desplegar:qa        # QA: Worker aparte goldroots-nutrition-qa → https://qa.goldrootsvitamins.com (y *.workers.dev), con noindex
npm run desplegar:dominio   # PRODUCCIÓN: Worker goldroots-nutrition → goldrootsvitamins.com y www (solo con aprobación)
```

Antes de desplegar: `npm run typecheck && npm test && npm run build`. Las cabeceras de seguridad y de caché (`dist/_headers`) las genera `scripts/cabeceras.mjs` según el ambiente; los 301 de rutas viejas, `scripts/postbuild.mjs`.

### Rendimiento (QA, Lighthouse 12, 22 oct 2026)

Móvil (4G simulada, CPU ×4): Performance 82, Accesibilidad 100, Buenas prácticas 100, LCP 3,7 s (**por encima de 2,5 s**), CLS 0, TBT 150 ms. Escritorio: Performance 99, LCP 0,9 s, CLS 0,001. SEO sale 69 solo porque QA lleva `noindex` a propósito. Carga inicial ≈ 80 KB de JS comprimido: las páginas y las escenas pesadas se cargan bajo demanda (`src/lib/lazy.tsx`), las funciones de layout de Motion aparte (`LayoutMotion`) y las fuentes van locales en `src/assets/fonts/`. INP no se midió (hace falta interacción real).

`VITE_SITE_URL` se usa para el `canonical`, los `og:` y el sitemap. Cada ruta limpia lleva su propia carpeta con `index.html` (la escribe `scripts/postbuild.mjs`) y `404.html` cubre las direcciones escritas a mano que no cuadran.

> `npm run publicar` (rama `gh-pages`) quedó como la ruta vieja: no la uses para este sitio.

## Estructura

```
public/brand/                     logo oficial, foto de la línea y bodegón (WebP optimizados)
src/data/productos.generado.json  catálogo leído de la tienda (lo escribe npm run datos)
src/data/productos.es.ts          textos de los 14 productos en español
src/styles.css                    identidad Gold Roots: tokens, escenas de scroll, motion guard
src/lib/products.ts               tipos, objetivos, búsqueda informativa y direcciones absolutas
src/lib/whatsapp.ts               solo enlace y mensaje de consulta (sin pedido ni cantidades)
src/lib/site.ts                   datos del negocio (null = pendiente de confirmar)
src/lib/meta.ts                   título, descripción, canonical y og por pantalla
src/components/FormulaFinder.tsx  explorador por objetivo
src/pages/                        inicio (scroll storytelling), catálogo, ficha, marca, contacto, legal
scripts/postbuild.mjs             404.html, sitemap.xml y robots.txt
```

## Cloudflare (hosting definitivo)

El sitio también se publica en Cloudflare como Worker de solo archivos (`wrangler.jsonc`):

```bash
npx wrangler login          # una vez
npm run desplegar:qa        # QA aparte (goldroots-nutrition-qa), con noindex
npm run desplegar:dominio   # producción: goldrootsvitamins.com y www (el dominio tiene que estar ya en la cuenta de Cloudflare)
```

Cómo mover el dominio desde Shopify/GoDaddy a Cloudflare, paso a paso: [docs/dominio-cloudflare.md](docs/dominio-cloudflare.md).

