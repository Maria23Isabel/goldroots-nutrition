import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findProduct, PRODUCTS } from '@/lib/products';
import { beatsOf, featuredStories, rank, showcasePicks, stepAt, trustFacts } from '@/lib/showcase';
import { infoAbout, INFO_MESSAGE, waLink } from '../src/lib/whatsapp';
import { site } from '../src/lib/site';

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
  it('cada ficha de la escena anclada trae objetivo, presentación, ingredientes y al menos un beneficio, tal como están en el producto', () => {
    for (const product of featuredStories()) {
      const beats = beatsOf(product);
      expect(beats.map((beat) => beat.key).slice(0, 3)).toEqual(['goal', 'format', 'ingredients']);
      expect(beats.length).toBeGreaterThanOrEqual(4);
      expect(beats.find((beat) => beat.key === 'ingredients')?.text).toBe(product.ingredients.join(' · '));
      expect(beats.find((beat) => beat.key === 'benefit-1')?.text).toBe(product.benefits[0]);
    }
  });

  it('las tres fórmulas de la escena anclada y las cinco del selector existen y son de objetivos distintos', () => {
    expect(featuredStories()).toHaveLength(3);
    expect(new Set(featuredStories().map((p) => p.goal)).size).toBe(3);
    expect(showcasePicks()).toHaveLength(5);
    expect(new Set(showcasePicks().map((p) => p.goal)).size).toBe(5);
  });

  it('las cifras de «Calidad y confianza» se pueden comprobar contando el catálogo', () => {
    const facts = trustFacts();
    expect(facts.formulas).toBe(PRODUCTS.length);
    expect(facts.sheets).toBe(PRODUCTS.filter((p) => p.image).length);
    expect(facts.capsules).toBe(PRODUCTS.filter((p) => p.format.includes('60')).length);
    expect(facts.capsules).toBeLessThanOrEqual(facts.formulas);
  });

  it('rank pone primero lo destacado y no repite productos', () => {
    const energy = rank('immune');
    expect(new Set(energy.map((p) => p.slug)).size).toBe(energy.length);
    expect(energy[0].featured).toBe(true);
  });
});

describe('sigue siendo una vitrina informativa: nada de tienda', () => {
  it('los productos no traen precio y el código no tiene carrito, checkout ni módulo mayorista', () => {
    for (const product of PRODUCTS) expect(Object.keys(product)).not.toEqual(expect.arrayContaining(['price']));
    const archivos = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? archivos(join(dir, entry.name)) : [join(dir, entry.name)]));
    const nombres = archivos(resolve('src')).map((ruta) => ruta.toLowerCase());
    expect(nombres.filter((ruta) => /(cart|carrito|checkout|wholesale|mayorista|orderdrawer)/.test(ruta))).toEqual([]);
    const rutas = readFileSync(resolve('src/main.tsx'), 'utf8');
    expect(rutas).not.toMatch(/path="(carrito|checkout|cart)"/);
  });

  it('el botón de WhatsApp abre una conversación directa con el número configurado y el mensaje de información', () => {
    expect(site.whatsapp).toMatch(/^\d{8,15}$/);
    expect(waLink(INFO_MESSAGE)).toBe(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(INFO_MESSAGE)}`);
    expect(infoAbout(findProduct('zinc-triple-play')!.name)).toBe(`${INFO_MESSAGE} (ZINC TRIPLE PLAY)`);
    expect(INFO_MESSAGE.toLowerCase()).not.toMatch(/comprar|precio|pedido/);
  });

  it('las fotos y el favicon de las tres hojas existen', () => {
    for (const archivo of ['favicon.svg', 'favicon.ico', 'icon-32.png', 'apple-touch-icon.png', 'brand/hero-cover.webp', 'brand/hero-cover-640.webp', 'brand/logo-gold-240.webp', 'brand/floating.webp', 'brand/zinc-scene.webp']) {
      expect(existsSync(resolve('public', archivo)), archivo).toBe(true);
    }
  });
});
