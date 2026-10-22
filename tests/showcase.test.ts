import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { normalizeCatalog } from '@/lib/catalog';
import { beatsOf, pickVaried, rank, spotlightOf, stepAt, trustFacts } from '@/lib/showcase';
import { infoAbout, INFO_MESSAGE, waLink } from '../src/lib/whatsapp';
import { site } from '../src/lib/site';

const PRODUCTS = normalizeCatalog(JSON.parse(readFileSync('tests/fixtures/catalog-qa.json', 'utf8'))).products;

describe('stepAt: qué dato toca encender según el avance del scroll', () => {
  it('nunca sale del rango, ni con avances fuera de 0–1', () => {
    expect(stepAt(-0.4, 5)).toBe(0);
    expect(stepAt(0, 5)).toBe(0);
    expect(stepAt(1, 5)).toBe(4);
    expect(stepAt(3, 5)).toBe(4);
    expect(stepAt(0.5, 1)).toBe(0);
  });

  it('recorre todos los tramos en orden, sin saltarse ninguno', () => {
    const vistos = Array.from({ length: 101 }, (_, i) => stepAt(i / 100, 5));
    expect([...new Set(vistos)]).toEqual([0, 1, 2, 3, 4]);
    expect([...vistos].sort((a, b) => a - b)).toEqual(vistos);
  });
});

describe('las escenas usan solo datos reales del catálogo', () => {
  it('cada ficha de la escena anclada trae objetivo, presentación e ingredientes tal como están en el producto, y lo que falta se avisa sin inventar', () => {
    for (const product of pickVaried(PRODUCTS, 3)) {
      const beats = beatsOf(product);
      expect(beats.map((beat) => beat.key).slice(0, 3)).toEqual(['goal', 'format', 'ingredients']);
      expect(beats.find((beat) => beat.key === 'ingredients')?.text).toBe(product.ingredients.length ? product.ingredients.join(' · ') : 'Información de ingredientes no disponible.');
      if (product.benefits[0]) expect(beats.find((beat) => beat.key === 'benefit-1')?.text).toBe(product.benefits[0]);
    }
    const sinNada = normalizeCatalog({ brands: [{ id: 1, name: 'M', colors: [] }], products: [{ slug: 'a', name: 'A', brandId: 1 }] }).products[0];
    expect(beatsOf(sinNada).map((beat) => beat.key)).toEqual(['goal', 'format', 'ingredients']);
  });

  it('las escenas piden productos distintos y nunca repiten ni inventan', () => {
    const tres = pickVaried(PRODUCTS, 3);
    const cinco = pickVaried(PRODUCTS, 5);
    expect(tres).toHaveLength(3);
    expect(cinco).toHaveLength(5);
    expect(new Set(cinco.map((p) => p.slug)).size).toBe(5);
    expect(pickVaried(PRODUCTS.slice(0, 2), 5)).toHaveLength(2);
    expect(pickVaried([], 3)).toEqual([]);
    expect(spotlightOf(PRODUCTS)).toBeTruthy();
    expect(spotlightOf([])).toBeUndefined();
  });

  it('con objetivos distintos, cada escena toma uno de cada objetivo antes de repetir', () => {
    const mezcla = normalizeCatalog({
      brands: [{ id: 1, name: 'M', colors: [] }],
      products: ['Energía', 'Energía', 'Sueño', 'Mente y enfoque'].map((goal, i) => ({ slug: `p${i}`, name: `P${i}`, brandId: 1, goal, images: [{ url: 'https://x.example.com/a.jpg' }] })),
    }).products;
    expect(new Set(pickVaried(mezcla, 3).map((p) => p.goal)).size).toBe(3);
  });

  it('las cifras de «Calidad y confianza» se pueden comprobar contando el catálogo', () => {
    const facts = trustFacts(PRODUCTS);
    expect(facts.formulas).toBe(PRODUCTS.length);
    expect(facts.sheets).toBe(PRODUCTS.filter((p) => p.image).length);
    expect(facts.goals).toBe(6);
  });

  it('rank no repite productos', () => {
    const lista = rank(PRODUCTS, 'immune');
    expect(new Set(lista.map((p) => p.slug)).size).toBe(lista.length);
  });
});

describe('sigue siendo una vitrina informativa: nada de tienda', () => {
  it('los productos no traen precio y el código no tiene carrito, checkout ni módulo mayorista', () => {
    for (const product of PRODUCTS) expect(Object.keys(product)).not.toContain('price');
    const archivos = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? archivos(join(dir, entry.name)) : [join(dir, entry.name)]));
    const nombres = archivos(resolve('src')).map((ruta) => ruta.toLowerCase());
    expect(nombres.filter((ruta) => /(cart|carrito|checkout|wholesale|mayorista|orderdrawer)/.test(ruta))).toEqual([]);
    const rutas = readFileSync(resolve('src/main.tsx'), 'utf8');
    expect(rutas).not.toMatch(/path="(carrito|checkout|cart)"/);
  });

  it('el botón de WhatsApp abre una conversación directa con el número configurado y el mensaje de información', () => {
    expect(site.whatsapp).toMatch(/^\d{8,15}$/);
    expect(waLink(INFO_MESSAGE)).toBe(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(INFO_MESSAGE)}`);
    expect(infoAbout('ZINC TRIPLE PLAY')).toBe(`${INFO_MESSAGE} (ZINC TRIPLE PLAY)`);
    expect(INFO_MESSAGE.toLowerCase()).not.toMatch(/comprar|precio|pedido/);
  });

  it('las fotos y el favicon de las tres hojas existen', () => {
    for (const archivo of ['favicon.svg', 'favicon.ico', 'icon-32.png', 'apple-touch-icon.png', 'brand/hero-gold.webp', 'brand/hero-gold-640.webp', 'brand/logo-gold-240.webp', 'brand/floating.webp', 'brand/zinc-scene.webp']) {
      expect(existsSync(resolve('public', archivo)), archivo).toBe(true);
    }
  });
});
