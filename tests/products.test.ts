import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import raw from '@/data/productos.generado.json';
import { PRODUCTOS_ES } from '@/data/productos.es';
import { rank } from '@/components/FormulaFinder';
import { GOALS, PRODUCTS, absoluteUrl, countByGoal, findProduct, goalBySlug, goalOf, money, plain, productPath, related, searchProducts } from '@/lib/products';
import { inquiryMessage, orderMessage, orderTotals, productMessage, waLink } from '../src/lib/whatsapp';

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

describe('la traducción al español', () => {
  it('hay texto en español para cada producto y ninguno sobra', () => {
    expect(Object.keys(PRODUCTOS_ES).sort()).toEqual((raw as Array<{ slug: string }>).map((p) => p.slug).sort());
  });

  it('cada traducción conserva la misma cantidad de beneficios e ingredientes que el original', () => {
    for (const original of raw as Array<{ slug: string; benefits: string[]; ingredients: string[] }>) {
      const es = PRODUCTOS_ES[original.slug];
      expect(es.benefits.length, `${original.slug} beneficios`).toBe(original.benefits.length);
      expect(es.ingredients.length, `${original.slug} ingredientes`).toBe(original.ingredients.length);
    }
  });

  it('no queda texto en inglés en las fichas', () => {
    const ingles = /\b(Supports?|Promotes?|Helps?|Enhances?|Advanced|Formula|Vegetarian Capsules|Featuring)\b/;
    for (const p of PRODUCTS) {
      expect(`${p.headline} ${p.summary} ${p.format} ${p.benefits.join(' ')}`, p.slug).not.toMatch(ingles);
    }
  });

  it('ningún texto promete curar, prevenir o tratar una enfermedad', () => {
    const promesa = /\b(cura|curar|curan|previene|prevenir|trata|tratar|tratamiento|elimina|enfermedad)\b/i;
    for (const p of PRODUCTS) expect(`${p.headline} ${p.summary} ${p.tagline} ${p.benefits.join(' ')}`, p.slug).not.toMatch(promesa);
  });
});

describe('buscar, filtrar y ordenar', () => {
  it('encuentra por ingrediente y por beneficio, sin importar tildes ni mayúsculas', () => {
    expect(searchProducts('magnesio', 'all', 'name').map((p) => p.slug)).toContain('ashwagandha-melatonin-magnesium');
    expect(searchProducts('ENFOQUE', 'all', 'featured').length).toBeGreaterThan(0);
    expect(searchProducts('curcuma', 'all', 'featured').map((p) => p.slug)).toContain('turmeric-curcumin');
    expect(plain('Energía')).toBe('energia');
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

  it('cada objetivo tiene su enlace en español', () => {
    expect(goalBySlug('sueno')?.id).toBe('sleep');
    expect(goalBySlug('vista-y-piel')?.id).toBe('eye-skin');
    expect(new Set(GOALS.map((g) => g.slug)).size).toBe(GOALS.length);
  });

  it('el buscador de fórmulas ordena según cómo elige el visitante', () => {
    const baratas = rank('immune', 'budget').map((p) => p.price);
    expect(baratas).toEqual([...baratas].sort((a, b) => a! - b!));
    expect(rank('immune', 'picks')[0].featured).toBe(true);
  });
});

describe('la dirección que codifica el QR', () => {
  it('apunta a la ficha del producto', () => {
    for (const p of PRODUCTS) expect(absoluteUrl(productPath(p.slug)).endsWith(`producto/${p.slug}/`)).toBe(true);
  });

  it('no cambia de sitio entre dos fichas', () => {
    const base = (url: string) => url.replace(/producto\/.*$/, '');
    expect(base(absoluteUrl('producto/zinc-triple-play'))).toBe(base(absoluteUrl('producto/maca-root-extra-strength')));
  });
});

describe('pedido y contacto por WhatsApp (la vitrina no cobra ni guarda nada)', () => {
  const zinc = findProduct('zinc-triple-play')!;
  const maca = findProduct('maca-root-extra-strength')!;
  const sinPrecio = findProduct('nad-resveratrol-coenzyme-q10')!;

  it('el mensaje de un producto lleva su nombre y su precio, y el enlace va codificado hacia un número', () => {
    const text = productMessage(zinc);
    expect(text).toContain('ZINC TRIPLE PLAY');
    expect(text).toContain('US$ 18.00');
    expect(waLink(text)).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=%C2%A1Hola%20Gold%20Roots/);
  });

  it('un producto sin precio no inventa uno', () => {
    expect(productMessage(sinPrecio)).not.toContain('US$');
  });

  it('suma el pedido y calcula lo que se ahorra', () => {
    const t = orderTotals([
      { product: zinc, qty: 2 },
      { product: maca, qty: 1 },
      { product: sinPrecio, qty: 1 },
    ]);
    expect(t).toEqual({ units: 4, subtotal: 51, saved: 9, unpriced: 1 });
    expect(money(t.subtotal)).toBe('US$ 51.00');
  });

  it('el mensaje del pedido lista cada producto con cantidad y precio, y avisa lo que falta cotizar', () => {
    const text = orderMessage(
      [
        { product: zinc, qty: 2 },
        { product: sinPrecio, qty: 1 },
      ],
      { name: ' Ana ', place: 'Lima' },
    );
    const lines = text.split('\n');
    expect(lines).toContain('• 2 × ZINC TRIPLE PLAY — US$ 36.00');
    expect(lines).toContain('• 1 × NAD + RESVERATROL + COENZIMA Q10 — precio por confirmar');
    expect(text).toContain('Total referencial: US$ 36.00 (+ un producto por cotizar), sin envío.');
    expect(text).toContain('Nombre: Ana');
    expect(text).toContain('Ciudad o país de entrega: Lima');
    expect(text).not.toContain('Nota:');
  });

  it('el formulario arma el mensaje con nombre, tema y texto', () => {
    const text = inquiryMessage({ kind: 'wholesale', name: ' Ana ', message: ' Hola ', business: 'Tienda Sol', country: 'Perú' });
    expect(text.split('\n')).toEqual(['¡Hola Gold Roots Nutrition! Me llamo Ana.', 'Tema: venta al por mayor', 'Tienda o empresa: Tienda Sol', 'País: Perú', '', 'Hola']);
    expect(inquiryMessage({ kind: 'contact', name: 'Ana', message: 'Hola', product: 'CARDO MARIANO' })).toContain('Fórmula: CARDO MARIANO');
  });
});
