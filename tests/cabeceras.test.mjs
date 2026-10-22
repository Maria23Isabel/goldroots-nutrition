import { describe, expect, it } from 'vitest';
import { cabeceras } from '../scripts/cabeceras.mjs';

describe('el archivo _headers que se sube a Cloudflare', () => {
  const real = cabeceras({ noindex: false });
  const qa = cabeceras({ noindex: true });

  it('lleva las cabeceras de seguridad en todas las rutas y una política CSP sin scripts externos ni en línea', () => {
    for (const texto of [real, qa]) {
      expect(texto).toMatch(/^\/\*\n/);
      for (const linea of ['X-Content-Type-Options: nosniff', 'X-Frame-Options: DENY', 'Referrer-Policy: strict-origin-when-cross-origin', 'Strict-Transport-Security: max-age=31536000']) expect(texto).toContain(linea);
      const csp = texto.match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
      expect(csp).toContain("script-src 'self';");
      expect(csp).not.toMatch(/script-src[^;]*(unsafe|https?:)/);
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");
    }
  });

  it('QA y la dirección de pruebas piden no ser indexadas; el sitio real no', () => {
    expect(qa).toContain('X-Robots-Tag: noindex, nofollow');
    expect(real).not.toContain('X-Robots-Tag');
  });

  it('los archivos con huella se guardan un año como inmutables y las fotos con nombre fijo solo una semana', () => {
    expect(real).toMatch(/\/assets\/\*\n {2}Cache-Control: public, max-age=31536000, immutable/);
    expect(real).toMatch(/\/brand\/\*\n {2}Cache-Control: public, max-age=604800/);
    expect(real).toMatch(/\/products\/\*\n {2}Cache-Control: public, max-age=604800/);
  });

  it('el HTML no lleva caché propia (Cloudflare ya revalida con ETag) y no hay reglas repetidas', () => {
    expect(real).not.toMatch(/\*\.html|\/index\.html/);
    const rutas = real.split('\n').filter((linea) => linea.startsWith('/'));
    expect(new Set(rutas).size).toBe(rutas.length);
  });
});
