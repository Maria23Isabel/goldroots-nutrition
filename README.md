# Gold Roots Nutrition — experiencia de marca

Sitio **corporativo e informativo** de la línea. Sus marcas y productos se administran en **Herbavida** (el ERP) y esta web los lee en vivo: cuando algo cambia allá, aquí se ve sin compilar ni desplegar de nuevo.
No es una tienda: no muestra precios, stock ni carrito, y lo único que guarda en el navegador es la última copia del catálogo para abrir más rápido.

## Qué es

- **Solo información**: catálogo con búsqueda y filtros por los 6 objetivos, fichas con descripción, ingredientes, presentación y beneficios declarados, más la marca, el contacto y las páginas legales.
- **El catálogo viene de Herbavida**: una sola petición pública de solo lectura (`GET /api/public/sites/goldroots/catalog`, ver abajo) trae las marcas habilitadas para este sitio con sus productos publicados. No hay productos en el código. `src/lib/catalog.ts` la lee una vez por visita, la comparte entre pantallas, guarda la última respuesta buena (se pinta al instante y se revisa en segundo plano) y maneja carga, error («Reintentar») y vacío. **Nunca** muestra productos de ejemplo.
- **Identidad sacada de sus propios archivos**: marfil `--color-canvas`, azul tinta `--color-night` `#22375c`, dorado `--color-accent` `#c09550` (versión legible `--color-accent-deep` `#826018`) y verde botánico secundario, con Playfair Display para títulos e Inter para lectura (`src/styles.css`). El logo y la foto de la línea están en `public/brand/`.
- **Narrativa de scroll** en la portada: héroe editorial con luces en movimiento y escena fija (`sticky`) donde las placas de los frascos se recomponen con el scroll (Motion para React). Todo el movimiento pesado se apaga por debajo de 900 px y con `prefers-reduced-motion`.
- **Direcciones de producto**: `/producto/<dirección de Herbavida>` (la dirección lleva el código del producto, p. ej. `zinc-triple-goldroots-hv-01461`). Las de la primera versión (`/producto/zinc-triple-play`…) siguen abriendo: `src/lib/legacy-slugs.json` las relaciona con la ficha actual, `scripts/postbuild.mjs` escribe las redirecciones **301** reales en `_redirects` y la aplicación las resuelve igual si la ficha es nueva. Cloudflare cae a la aplicación (`single-page-application`) para que una ficha creada después del último despliegue abra directo, sin 404.
- **Rutas limpias**: `/catalogo`, `/producto/…`, `/nosotros`, `/contacto`, `/legal/…`. `/mayoristas` y `/wholesale` redirigen al catálogo; `scripts/postbuild.mjs` escribe el `sitemap.xml` (con las fichas que traiga Herbavida al compilar), las carpetas por ruta y `robots.txt`.
- **Accesible y rápida**: texto salteable, LANDMARKS reales, filtros con `aria-pressed`, foco visible, contraste AA, `prefers-reduced-motion`, fotos con `lazy`/`decoding` y espacio reservado, `sitemap.xml` y metadatos por pantalla.

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:5176
npm run test       # vitest
npm run typecheck
npm run build      # dist/ + 404.html + sitemap.xml + robots.txt
```

## De dónde sale cada dato (Herbavida) y qué pasa si falta

Cada campo viene de Herbavida; lo que falta **no se inventa**: se usa un texto neutro (todos juntos en `src/lib/defaults.ts`) o la sección no se muestra.

| Campo de la ficha | Dónde está en Herbavida | Si falta |
|---|---|---|
| Nombre, dirección (slug) | producto | no se publica la ficha |
| Marca | marca (`tb_009`) asignada al sitio (`tb_034_brand_sites`) | el producto no sale |
| Foto principal y galería | fotos del producto (`tb_012`), en el bucket R2 | imagen de respaldo `brand/placeholder-producto.webp` (también si la foto no carga, sin ciclo de error) |
| Descripción corta | descripción corta | «Suplemento alimenticio de la línea Gold Roots…» |
| Beneficios | beneficios (una línea cada uno) | la sección no se muestra |
| Ingredientes | ingredientes (una línea cada uno) | «Información de ingredientes no disponible.» |
| Presentación | presentación | «Por confirmar» |
| Objetivo | rasgo «Objetivo» del producto | «General» (los objetivos sin fórmulas no salen como filtro; sin ningún objetivo se ocultan las «seis puertas» y el explorador) |
| Titular / Frase corta | rasgos «Titular» y «Frase corta» | textos neutros |
| Modo de uso | rasgo «Modo de uso» | no se muestra (nunca se inventa una dosis) |
| Otros datos (origen, país, duración del envase) | rasgos del producto | no se muestran |

Las fotos se piden del tamaño que se ven (`src/lib/images.ts`): del almacén de Herbavida usa las versiones `-480`/`-160`; de Google Drive, el ancho justo. El catálogo de QA sale de `https://qa.herbavidaperu.com` y el de producción de `https://herbavidaperu.com`: `scripts/desplegar.mjs` fija cada uno al compilar y los permite en la CSP.

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

Móvil (4G simulada, CPU ×4): Performance 80–84, Accesibilidad 100, Buenas prácticas 100, LCP 3,7–4,0 s (**por encima de 2,5 s**), CLS 0, TBT 150 ms. Escritorio: Performance 99, LCP 0,9 s, CLS 0,001. SEO sale 69 solo porque QA lleva `noindex` a propósito. Carga inicial ≈ 80 KB de JS comprimido: las páginas y las escenas pesadas se cargan bajo demanda (`src/lib/lazy.tsx`), las funciones de layout de Motion aparte (`LayoutMotion`) y las fuentes van locales en `src/assets/fonts/`. INP no se midió (hace falta interacción real).

`VITE_SITE_URL` se usa para el `canonical`, los `og:` y el sitemap. Cada ruta limpia lleva su propia carpeta con `index.html` (la escribe `scripts/postbuild.mjs`) y `404.html` cubre las direcciones escritas a mano que no cuadran.

> `npm run publicar` (rama `gh-pages`) quedó como la ruta vieja: no la uses para este sitio.

## Estructura

```
public/brand/                     logo oficial, foto de la línea y bodegón (WebP optimizados)
src/lib/catalog.ts                lee el catálogo de Herbavida: petición única, copia local, estados
src/lib/defaults.ts               valores predeterminados (textos neutros, imagen de respaldo)
src/lib/legacy-slugs.json         direcciones de la primera versión → ficha actual
tests/fixtures/catalog-qa.json    foto real de lo que entrega Herbavida QA, para las pruebas
src/styles.css                    identidad Gold Roots: tokens, escenas de scroll, motion guard
src/lib/products.ts               tipos, objetivos y funciones puras de búsqueda sobre la lista recibida
src/lib/whatsapp.ts               solo enlace y mensaje de consulta (sin pedido ni cantidades)
src/lib/site.ts                   datos del negocio (null = pendiente de confirmar)
src/lib/meta.ts                   título, descripción, canonical y og por pantalla
src/components/FormulaFinder.tsx  explorador por objetivo
src/pages/                        inicio (scroll storytelling), catálogo, ficha, marca, contacto, legal
scripts/postbuild.mjs             404.html, sitemap.xml, robots.txt y redirecciones 301 de las direcciones antiguas
```

## Cloudflare (hosting definitivo)

El sitio también se publica en Cloudflare como Worker de solo archivos (`wrangler.jsonc`):

```bash
npx wrangler login          # una vez
npm run desplegar:qa        # QA aparte (goldroots-nutrition-qa), con noindex
npm run desplegar:dominio   # producción: goldrootsvitamins.com y www (el dominio tiene que estar ya en la cuenta de Cloudflare)
```

Cómo mover el dominio desde Shopify/GoDaddy a Cloudflare, paso a paso: [docs/dominio-cloudflare.md](docs/dominio-cloudflare.md).

