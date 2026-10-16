# Gold Roots Nutrition — vitrina de producto

Réplica mejorada de [goldrootsvitamins.com](https://goldrootsvitamins.com/) pensada para **mostrar** la línea, no para cobrar.
Versión nueva, en paralelo al prototipo `goldroots-glow` (que queda intacto).

## Qué es

- **Vitrina, sin carrito ni pagos**: cada ficha invita a preguntar o a comprar en la tienda de la marca.
- **Los 14 productos reales**: nombre, precio, beneficios, ingredientes, formato y foto salen de la tienda (`npm run datos`).
- **QR por producto**: cada ficha genera su código QR con la dirección de esa ficha, para imprimirlo en el envase o en el mostrador, con descarga en PNG y el enlace copiable.
- **Todos los productos visibles**: portada con la lista completa, catálogo en rejilla y en tabla de especificaciones, filtros por los 6 objetivos.
- **Rutas limpias**: `/catalog`, `/product/shilajit-gold`. En GitHub Pages las resuelve el `404.html` que escribe `scripts/postbuild.mjs`.
- **Accesible y rápida**: texto salteable, LANDMARKS reales, filtros con `aria-pressed`, contador con `aria-live`, foco visible, contraste AA, `prefers-reduced-motion`, fotos con `lazy`/`decoding` y espacio reservado, `sitemap.xml` y metadatos por pantalla.

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:5176
npm run test       # vitest
npm run typecheck
npm run build      # dist/ + 404.html + sitemap.xml + robots.txt
```

## Datos del negocio que faltan

No se inventa nada. Mientras la marca no lo confirme, la pantalla lo muestra con un sello `to be confirmed`:

- teléfono / WhatsApp, correo, correo de mayoreo, dirección y redes → `src/lib/site.ts`
- envío y devoluciones, texto legal, precios de distribuidor y cantidad mínima
- aviso FDA definitivo (el texto actual es el de la tienda original, pendiente de revisión)

## Publicar

```bash
VITE_SITE_URL=https://eldominio.com npm run build   # con dominio propio
npm run build:pages                                 # vista previa en /goldroots-nutrition/
```

`VITE_SITE_URL` se usa para el QR, el `canonical`, los `og:` y el sitemap. Si no se define, el QR toma el origen por el que se está navegando, así que sigue funcionando en la vista previa.

## Estructura

```
src/data/productos.generado.json  catálogo leído de la tienda (lo escribe npm run datos)
src/lib/products.ts               tipos, objetivos, búsqueda, precios y direcciones absolutas
src/lib/site.ts                   datos del negocio (null = pendiente de confirmar)
src/lib/meta.ts                   título, descripción, canonical y og por pantalla
src/components/QrCard.tsx         QR del producto, copiar enlace y descargar PNG
src/pages/                        inicio, catálogo, ficha, mayoreo, marca, contacto, legal
scripts/postbuild.mjs             404.html, sitemap.xml y robots.txt
```
