import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import raw from '@/data/productos.generado.json';
import { PRODUCTOS_ES } from '@/data/productos.es';
import { rank } from '@/lib/showcase';
import { GOALS, PRODUCTS, absoluteUrl, countByGoal, featured, findProduct, goalBySlug, goalOf, plain, productPath, related, searchProducts } from '@/lib/products';
import { GENERAL_MESSAGE, inquiryMessage, waLink } from '../src/lib/whatsapp';

describe('el catálogo informativo de Gold Roots', () => {
  it('trae los catorce productos, con enlace único y foto local', () => {
    expect(PRODUCTS).toHaveLength(14);
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
    for (const p of PRODUCTS) {
      expect(p.image, p.slug).toBeTruthy();
      expect(existsSync(resolve('public', p.image!)), `${p.slug} sin foto`).toBe(true);
    }
  });

  it('no lleva precio, descuento ni cantidad: la vitrina no vende', () => {
    for (const p of PRODUCTS) {
      const keys = Object.keys(p);
      for (const prohibido of ['price', 'compareAt', 'qty', 'savings']) expect(keys, `${p.slug} tiene ${prohibido}`).not.toContain(prohibido);
    }
    expect(Object.keys(PRODUCTS[0]).sort()).toEqual(
      ['benefits', 'featured', 'format', 'goal', 'headline', 'image', 'ingredients', 'name', 'slug', 'summary', 'tagline'].sort(),
    );
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

describe('buscar y filtrar', () => {
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

  it('solo ordena por destacadas o alfabéticamente, nunca por precio', () => {
    const antes = PRODUCTS.map((p) => p.slug);
    const porNombre = searchProducts('', 'all', 'name').map((p) => p.name);
    expect(porNombre).toEqual([...porNombre].sort((a, b) => a.localeCompare(b, 'es')));
    const porDestacadas = searchProducts('', 'all', 'featured');
    const primeraNoDestacada = porDestacadas.findIndex((p) => !p.featured);
    expect(porDestacadas.slice(0, primeraNoDestacada).every((p) => p.featured)).toBe(true);
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

  it('el explorador ordena las fórmulas de un objetivo: destacadas primero y luego por nombre', () => {
    const immune = rank('immune');
    expect(immune.every((p) => p.goal === 'immune')).toBe(true);
    expect(immune.length).toBe(countByGoal('immune'));
    expect(Number(immune[0].featured)).toBeGreaterThanOrEqual(Number(immune.at(-1)!.featured));
    const empardas = immune.filter((p) => p.featured === immune[0].featured).map((p) => p.name);
    expect(empardas).toEqual([...empardas].sort((a, b) => a.localeCompare(b, 'es')));
  });

  it('las destacadas del inicio salen del catálogo, no de un número fijo', () => {
    expect(featured().length).toBeGreaterThan(0);
    expect(featured().every((p) => p.featured)).toBe(true);
  });
});

describe('la dirección de cada ficha', () => {
  it('apunta a la ficha del producto', () => {
    for (const p of PRODUCTS) expect(absoluteUrl(productPath(p.slug)).endsWith(`producto/${p.slug}/`)).toBe(true);
  });

  it('no cambia de sitio entre dos fichas', () => {
    const base = (url: string) => url.replace(/producto\/.*$/, '');
    expect(base(absoluteUrl('producto/zinc-triple-play'))).toBe(base(absoluteUrl('producto/maca-root-extra-strength')));
  });
});

describe('el contacto: solo consulta, sin pedido', () => {
  const zinc = findProduct('zinc-triple-play')!;

  it('el enlace de contacto va codificado hacia un número, sin texto de compra', () => {
    const link = waLink(GENERAL_MESSAGE);
    expect(link).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=Hola%2C%20Gold%20Roots/);
    expect(GENERAL_MESSAGE).not.toMatch(/pedido|carrito|precio|comprar/i);
  });

  it('el formulario arma una consulta con nombre, fórmula y texto', () => {
    const text = inquiryMessage({ name: ' Ana ', message: '  ¿Qué contiene? ', product: zinc.name });
    expect(text.split('\n')).toEqual(['Hola, Gold Roots Nutrition. Me llamo Ana.', `Fórmula de interés: ${zinc.name}`, '', '¿Qué contiene?']);
    expect(inquiryMessage({ name: 'Ana', message: 'Hola' })).not.toContain('Fórmula de interés');
  });

  it('ningún mensaje del contacto menciona montos, unidades ni ahorro', () => {
    const texto = `${GENERAL_MESSAGE} ${inquiryMessage({ name: 'Ana', message: 'Hola', product: zinc.name })}`;
    expect(texto).not.toMatch(/US\$|cantidad|subtotal|ahorro|envío/i);
  });
});
