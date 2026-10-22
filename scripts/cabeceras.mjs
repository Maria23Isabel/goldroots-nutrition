// El archivo _headers que Cloudflare aplica a todo lo que entrega el sitio: seguridad en todas las rutas y caché larga
// para lo que no cambia. Lo escribe desplegar.mjs en dist/ (nunca se versiona).
//   - /assets/*: los archivos de Vite llevan una huella en el nombre, así que nunca cambian: un año, inmutables.
//   - /brand/*: fotos con nombre fijo; una semana y, vencida, se sirven mientras se revalidan. Las fotos de los productos no son del sitio: vienen de Herbavida.
//   - HTML: sin cabecera propia; Cloudflare ya manda «max-age=0, must-revalidate» con ETag, así que un cambio llega al instante.
// CSP: los scripts, estilos y fuentes salen del propio sitio. Motion escribe estilos en línea, por eso style-src admite 'unsafe-inline'; los scripts, no.
// Lo único externo es lo que entrega Herbavida: `api` (de dónde se lee el catálogo, connect-src) y `fotos` (de dónde vienen las fotos de los productos, img-src).
// Cada ambiente lleva la suya: QA no puede leer de producción ni al revés. Las imágenes admiten data: por si alguna se incrusta en línea.
export function cabeceras({ noindex, api = '', fotos = [] }) {
  const csp = ["default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'", `img-src ${["'self'", 'data:', ...fotos].join(' ')}`, "font-src 'self'", `connect-src ${["'self'", ...(api ? [api] : [])].join(' ')}`, "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"].join('; ');
  const seguridad = [
    'X-Content-Type-Options: nosniff',
    'X-Frame-Options: DENY',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy: same-origin',
    'Strict-Transport-Security: max-age=31536000',
    `Content-Security-Policy: ${csp}`,
    ...(noindex ? ['X-Robots-Tag: noindex, nofollow'] : []),
  ];
  const bloque = (ruta, ...lineas) => [ruta, ...lineas.map((linea) => `  ${linea}`)].join('\n');
  return `${[
    bloque('/*', ...seguridad),
    bloque('/assets/*', 'Cache-Control: public, max-age=31536000, immutable'),
    bloque('/brand/*', 'Cache-Control: public, max-age=604800, stale-while-revalidate=86400'),
    bloque('/favicon.svg', 'Cache-Control: public, max-age=86400'),
    bloque('/favicon.ico', 'Cache-Control: public, max-age=86400'),
    bloque('/icon-32.png', 'Cache-Control: public, max-age=86400'),
    bloque('/apple-touch-icon.png', 'Cache-Control: public, max-age=86400'),
  ].join('\n\n')}\n`;
}
