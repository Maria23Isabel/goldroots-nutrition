import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GOALS, PRODUCTS, absoluteUrl, countByGoal, findProduct, goalOf, related, searchProducts } from '@/lib/products';
import { inquiryMessage, productMessage, waLink } from '../src/lib/whatsapp';

describe('el catálogo que viene de goldrootsvitamins.com', () => {
  it('trae los catorce productos, con enlace único y foto local', () => {
    expect(PRODUCTS).toHaveLength(14);
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
    for (const p of PRODUCTS) {
      expect(p.image, p.slug).toBeTruthy();
      expect(existsSync(resolve('public', p.image!)), `${p.slug} sin foto`).toBe(true);
    }
  });

  it('solo deja sin precio el producto que la tienda aún no publica', () => {
    expect(PRODUCTS.filter((p) => p.price == null).map((p) => p.slug)).toEqual(['nad-resveratrol-coenzyme-q10']);
  });

  it('cubre los seis objetivos y cada ficha tiene beneficios e ingredientes', () => {
    expect(GOALS.every((g) => countByGoal(g.id) > 0)).toBe(true);
    expect(GOALS.reduce((n, g) => n + countByGoal(g.id), 0)).toBe(PRODUCTS.length);
    for (const p of PRODUCTS) {
      expect(p.benefits.length, p.slug).toBeGreaterThan(1);
      expect(p.ingredients.length, p.slug).toBeGreaterThan(0);
      expect(goalOf(p.goal).label).toBeTruthy();
    }
  });
});

describe('buscar, filtrar y ordenar', () => {
  it('encuentra por ingrediente y por beneficio', () => {
    expect(searchProducts('magnesium', 'all', 'name').map((p) => p.slug)).toContain('ashwagandha-melatonin-magnesium');
    expect(searchProducts('focus', 'all', 'featured').length).toBeGreaterThan(0);
  });

  it('filtra por objetivo sin repetirse entre objetivos', () => {
    const energy = searchProducts('', 'energy', 'featured');
    expect(energy.every((p) => p.goal === 'energy')).toBe(true);
    expect(searchProducts('', 'noexiste' as never, 'featured')).toHaveLength(0);
  });

  it('ordena por precio sin reordenar el catálogo original', () => {
    const antes = PRODUCTS.map((p) => p.slug);
    const precios = searchProducts('', 'all', 'price-asc').map((p) => p.price);
    expect(precios.filter((x) => x != null)).toEqual([...precios.filter((x) => x != null)].sort((a, b) => a! - b!));
    expect(precios.at(-1)).toBeNull(); // el que aún no tiene precio queda al final
    expect(PRODUCTS.map((p) => p.slug)).toEqual(antes);
  });

  it('relaciona primero con productos del mismo objetivo', () => {
    const shilajit = findProduct('shilajit-gold')!;
    expect(related(shilajit)[0].goal).toBe(shilajit.goal);
    expect(related(shilajit)).not.toContainEqual(expect.objectContaining({ slug: 'shilajit-gold' }));
  });
});

describe('la dirección que codifica el QR', () => {
  it('apunta a la ficha del producto', () => {
    for (const p of PRODUCTS) expect(absoluteUrl(`product/${p.slug}`).endsWith(`product/${p.slug}/`)).toBe(true);
  });

  it('no cambia de sitio entre dos fichas', () => {
    const base = (url: string) => url.replace(/product\/.*$/, '');
    expect(base(absoluteUrl('product/zinc-triple-play'))).toBe(base(absoluteUrl('product/maca-root-extra-strength')));
  });
});

describe('contacto por WhatsApp (la vitrina no cobra ni guarda nada)', () => {
  it('el mensaje de un producto lleva su nombre y su precio, y el enlace va codificado', () => {
    const zinc = findProduct('zinc-triple-play')!;
    const text = productMessage(zinc);
    expect(text).toContain('ZINC TRIPLE PLAY');
    expect(text).toContain('$18.00');
    expect(waLink(text)).toMatch(/^https:\/\/wa\.me\/\d*\?text=Hello%20Gold%20Roots/);
  });

  it('un producto sin precio no inventa uno', () => {
    expect(productMessage(findProduct('nad-resveratrol-coenzyme-q10')!)).not.toContain('$');
  });

  it('el formulario arma el mensaje con nombre, tema y texto', () => {
    const text = inquiryMessage({ kind: 'wholesale', name: ' Ana ', message: ' Hola ', business: 'Tienda Sol', country: 'Perú' });
    expect(text.split('\n')).toEqual(['Hello Gold Roots Nutrition! My name is Ana.', 'Topic: Wholesale', 'Store or company: Tienda Sol', 'Country: Perú', '', 'Hola']);
    expect(inquiryMessage({ kind: 'contact', name: 'Ana', message: 'Hola', product: 'MILK THISTLE' })).toContain('Formula: MILK THISTLE');
  });
});
