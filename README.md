# Gold Roots Nutrition — vitrina de producto

Réplica mejorada de [goldrootsvitamins.com](https://goldrootsvitamins.com/) pensada para **mostrar** la línea, no para cobrar.
Versión nueva, en paralelo al prototipo `goldroots-glow` (que queda intacto).

## Qué es

- **Vitrina, sin carrito ni pagos**: todo el contacto y los pedidos van por **WhatsApp**. Cada producto, el formulario de contacto y el de mayoreo abren el chat con el mensaje ya escrito (`src/lib/whatsapp.ts`); hay un botón flotante en todas las páginas. El sitio no recibe ni guarda lo que se escribe.
- **Los 14 productos reales**: nombre, precio, beneficios, ingredientes, formato y foto salen de la tienda (`npm run datos`).
- **QR por producto**: cada ficha genera su código QR con la dirección de esa ficha, para imprimirlo en el envase o en el mostrador, con descarga en PNG y el enlace copiable.
- **Todos los productos visibles**: portada con la lista completa, catálogo en rejilla y en tabla de especificaciones, filtros por los 6 objetivos.
- **Todo en español**: la traducción de los 14 productos vive en `src/data/productos.es.ts` (el JSON de la tienda sigue en inglés y `lib/products.ts` los une por `slug`). Las direcciones en inglés de la versión anterior (y sus QR) redirigen a las nuevas.
- **Tema oscuro y claro**: por defecto oscuro (índigo medianoche), con interruptor en la cabecera; se recuerda en el navegador (`lib/theme.ts`, colores en `styles.css`).
- **«Mi pedido»**: se agregan fórmulas con un toque, se ajustan cantidades y un solo botón abre WhatsApp con el pedido completo ya escrito (`lib/order.ts`, `lib/whatsapp.ts`); el pedido vive en el navegador, no hay servidor.
- **Rutas limpias**: `/catalogo`, `/producto/shilajit-gold`, `/mayoristas`, `/nosotros`, `/contacto`. En GitHub Pages las resuelve el `404.html` que escribe `scripts/postbuild.mjs`.
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

No se inventa nada. Mientras la marca no lo confirme, la pantalla lo muestra con un sello `Por confirmar`:

- **número de WhatsApp definitivo** (hoy usa el de pedidos de Herbavida, `51940176917`; se cambia en `whatsapp` de `src/lib/site.ts` o con `VITE_WHATSAPP` al compilar, y se pone `whatsappConfirmed: true`), horario, dirección y redes → `src/lib/site.ts`
- envío y devoluciones, texto legal, precios de distribuidor y cantidad mínima
- aviso FDA definitivo (el texto actual es el de la tienda original, pendiente de revisión)

## Publicar

Ya está publicado: <https://maria23isabel.github.io/goldroots-nutrition/>

- `main` → el código fuente (público, como `america-land`).
- `gh-pages` → el contenido de `dist/` en la raíz; GitHub Pages lee de esa rama.

Para volver a publicar después de un cambio:

```bash
npm run build:pages
node scripts/publicar-pages.mjs        # sincroniza dist/ con la rama gh-pages y la sube
```

`VITE_SITE_URL` se usa para el QR, el `canonical`, los `og:` y el sitemap. Sin esa variable el QR toma el origen por el que se está navegando, así que funciona igual en esta vista previa de Pages. Cuando el dominio propio apunte aquí, se compila con `VITE_SITE_URL=https://eldominio.com npm run build` y `npm run datos` deja de ser necesario para las rutas.

Cada ruta limpia lleva su propia carpeta con `index.html` (lo escribe `scripts/postbuild.mjs`), porque Pages responde 301 con barra final y 404 a una ruta que no existe como carpeta; `404.html` sigue cubriendo las direcciones escritas a mano que no cuadran.

## Estructura

```
src/data/productos.generado.json  catálogo leído de la tienda (lo escribe npm run datos)
src/data/productos.es.ts          textos de los 14 productos en español
src/lib/products.ts               tipos, objetivos, búsqueda, precios y direcciones absolutas
src/lib/order.ts                  «Mi pedido» (localStorage)
src/lib/theme.ts                  tema oscuro/claro
src/lib/site.ts                   datos del negocio (null = pendiente de confirmar)
src/lib/meta.ts                   título, descripción, canonical y og por pantalla
src/components/QrCard.tsx         QR del producto, copiar enlace y descargar PNG
src/pages/                        inicio, catálogo, ficha, mayoreo, marca, contacto, legal
scripts/postbuild.mjs             404.html, sitemap.xml y robots.txt
```
