import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { normalizeCatalog, type Catalog } from '@/lib/catalog';
import { DEFAULTS } from '@/lib/defaults';
import { imageUrl } from '@/lib/images';
import { findByLegacySlug, LEGACY_SLUGS } from '@/lib/legacy-slugs';
import { GENERAL_GOAL, GOALS, absoluteUrl, countByGoal, featured, findProduct, goalBySlug, goalFromText, goalOf, plain, productPath, related, searchProducts } from '@/lib/products';
import { rank } from '@/lib/showcase';
import { GENERAL_MESSAGE, inquiryMessage, waLink } from '../src/lib/whatsapp';

// Foto real de lo que entrega Herbavida QA (GET /api/public/sites/goldroots/catalog): el catálogo ya no vive en el código
const raw = JSON.parse(readFileSync('tests/fixtures/catalog-qa.json', 'utf8'));
const catalog: Catalog = normalizeCatalog(raw);
const PRODUCTS = catalog.products;

describe('el catálogo que entrega Herbavida', () => {
  it('trae las 14 fórmulas de la marca, con enlace único', () => {
    expect(catalog.brands).toHaveLength(1);
    expect(PRODUCTS).toHaveLength(14);
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
    for (const p of PRODUCTS) expect(p.brandName, p.slug).toBe(catalog.brands[0].name);
  });

  it('no lleva precio, costo, stock ni código interno: la vitrina no vende', () => {
    const claves = new Set<string>();
    const recorrer = (nodo: unknown) => {
      if (Array.isArray(nodo)) nodo.forEach(recorrer);
      else if (nodo && typeof nodo === 'object') for (const [k, v] of Object.entries(nodo)) (claves.add(k), recorrer(v));
    };
    recorrer(raw);
    recorrer(PRODUCTS);
    for (const prohibido of ['price', 'retailPrice', 'costPrice', 'compareAt', 'stock', 'stockQuantity', 'availability', 'sku', 'qty', 'savings']) expect(claves.has(prohibido), prohibido).toBe(false);
  });

  it('descarta lo que no sirve (sin nombre, sin dirección o de una marca que no viene) y no inventa nada', () => {
    const sucio = normalizeCatalog({
      version: 'x',
      brands: [{ id: 1, name: 'Marca', colors: [] }],
      products: [
        { slug: '', name: 'Sin dirección', brandId: 1 },
        { slug: 'sin-nombre', name: '  ', brandId: 1 },
        { slug: 'huerfano', name: 'De otra marca', brandId: 99 },
        { slug: 'bueno', name: 'Bueno', brandId: 1 },
      ],
    });
    expect(sucio.products.map((p) => p.slug)).toEqual(['bueno']);
    expect(normalizeCatalog(null).products).toEqual([]);
    expect(normalizeCatalog('basura').brands).toEqual([]);
  });
});

describe('valores predeterminados: solo textos neutros, nunca datos de un suplemento', () => {
  const vacio = normalizeCatalog({ brands: [{ id: 1, name: 'Marca', colors: [] }], products: [{ slug: 'a', name: 'Producto A', brandId: 1, images: [] }] }).products[0];

  it('un producto con solo nombre usa los textos neutros y no inventa beneficios, ingredientes, dosis ni foto', () => {
    expect(vacio).toMatchObject({ goal: 'general', headline: DEFAULTS.headline, tagline: DEFAULTS.tagline, summary: DEFAULTS.summary, benefits: [], ingredients: [], usage: null, image: null, images: [], format: '', attributes: [] });
  });

  it('la frase corta no repite la presentación (ya sale aparte en la tarjeta), y el objetivo se reconoce por nombre, nombre corto o dirección', () => {
    const conFormato = normalizeCatalog({ brands: [{ id: 1, name: 'M', colors: [] }], products: [{ slug: 'a', name: 'A', brandId: 1, presentation: '60 cápsulas', goal: 'Energía y vitalidad' }] }).products[0];
    expect(conFormato.tagline).toBe(DEFAULTS.tagline);
    expect(conFormato.format).toBe('60 cápsulas');
    expect(conFormato.goal).toBe('energy');
    for (const texto of ['Energía', 'energia', 'ENERGÍA Y VITALIDAD', 'energy']) expect(goalFromText(texto)).toBe('energy');
    expect(goalFromText('algo raro')).toBe('general');
    expect(goalFromText(null)).toBe('general');
    expect(goalOf('general')).toBe(GENERAL_GOAL);
  });

  it('los textos predeterminados no prometen nada de salud', () => {
    expect(Object.values(DEFAULTS).join(' ')).not.toMatch(/\b(cura|curar|previene|prevenir|trata|tratar|ansiedad|dosis|mg)\b/i);
  });

  it('en el catálogo real de QA, 13 fórmulas traen objetivo y la que no lo trae queda como «general»; ninguna trae modo de uso, así que no se muestra', () => {
    expect(countByGoal(PRODUCTS, 'general')).toBe(1);
    expect(GOALS.reduce((n, g) => n + countByGoal(PRODUCTS, g.id), 0)).toBe(13);
    expect(PRODUCTS.every((p) => p.usage === null)).toBe(true);
  });
});

describe('buscar y filtrar', () => {
  it('encuentra por ingrediente y por beneficio, sin importar tildes ni mayúsculas', () => {
    expect(searchProducts(PRODUCTS, 'selenio', 'all', 'name').length).toBeGreaterThan(0);
    expect(searchProducts(PRODUCTS, 'MELATONINA', 'all', 'featured').map((p) => p.slug)).toContain('ashwagandha-melatonin-hv-01458');
    expect(plain('Energía')).toBe('energia');
  });

  it('filtra por objetivo y por «todos», y un objetivo inexistente no devuelve nada', () => {
    expect(searchProducts(PRODUCTS, '', 'all', 'featured')).toHaveLength(14);
    expect(searchProducts(PRODUCTS, '', 'general', 'featured')).toHaveLength(1);
    expect(searchProducts(PRODUCTS, '', 'energy', 'featured')).toHaveLength(3);
    expect(searchProducts(PRODUCTS, '', 'energy', 'featured').every((p) => p.goal === 'energy')).toBe(true);
    expect(searchProducts(PRODUCTS, '', 'noexiste' as never, 'featured')).toHaveLength(0);
  });

  it('solo ordena por destacadas o alfabéticamente, nunca por precio, y no cambia la lista original', () => {
    const antes = PRODUCTS.map((p) => p.slug);
    const porNombre = searchProducts(PRODUCTS, '', 'all', 'name').map((p) => p.name);
    expect(porNombre).toEqual([...porNombre].sort((a, b) => a.localeCompare(b, 'es')));
    expect(PRODUCTS.map((p) => p.slug)).toEqual(antes);
  });

  it('relaciona primero con productos del mismo objetivo y nunca consigo mismo', () => {
    const uno = PRODUCTS[3];
    expect(related(PRODUCTS, uno)).toHaveLength(4);
    expect(related(PRODUCTS, uno)).not.toContainEqual(expect.objectContaining({ slug: uno.slug }));
  });

  it('cada objetivo tiene su enlace en español y «general» también', () => {
    expect(goalBySlug('sueno')?.id).toBe('sleep');
    expect(goalBySlug('vista-y-piel')?.id).toBe('eye-skin');
    expect(goalBySlug('general')).toBe(GENERAL_GOAL);
    expect(new Set(GOALS.map((g) => g.slug)).size).toBe(GOALS.length);
  });

  it('el explorador ordena las fórmulas de un objetivo: destacadas primero y luego por nombre', () => {
    const nombres = rank(PRODUCTS, 'energy').map((p) => p.name);
    expect(nombres).toEqual([...nombres].sort((a, b) => a.localeCompare(b, 'es')));
    expect(featured(PRODUCTS).every((p) => p.featured)).toBe(true);
  });
});

describe('direcciones: las de siempre siguen abriendo y la de cada ficha es estable', () => {
  it('cada dirección de la primera versión lleva a una sola ficha actual', () => {
    for (const [antigua, base] of Object.entries(LEGACY_SLUGS)) {
      const destino = findByLegacySlug(PRODUCTS, antigua);
      expect(destino, antigua).toBeTruthy();
      expect(destino!.slug.replace(/-hv-\d+(-\d+)?$/, ''), antigua).toBe(base);
    }
    const destinos = Object.keys(LEGACY_SLUGS).map((s) => findByLegacySlug(PRODUCTS, s)!.slug);
    expect(new Set(destinos).size).toBe(destinos.length);
  });

  it('una dirección que no existe ni existió no redirige a nada, y una actual no se trata como antigua', () => {
    expect(findByLegacySlug(PRODUCTS, 'turmeric-curcumin')).toBeUndefined();
    expect(findByLegacySlug(PRODUCTS, 'cualquier-cosa')).toBeUndefined();
    expect(findByLegacySlug(PRODUCTS, undefined)).toBeUndefined();
    expect(findProduct(PRODUCTS, 'zinc-triple-goldroots-hv-01461')).toBeTruthy();
    expect(findProduct(PRODUCTS, 'zinc-triple-play')).toBeUndefined();
  });

  it('la ruta pública de una ficha termina en producto/<dirección>/ y no cambia de sitio entre fichas', () => {
    for (const p of PRODUCTS) expect(absoluteUrl(productPath(p.slug)).endsWith(`producto/${p.slug}/`)).toBe(true);
    const base = (url: string) => url.replace(/producto\/.*$/, '');
    expect(base(absoluteUrl('producto/a'))).toBe(base(absoluteUrl('producto/b')));
  });
});

describe('las fotos se piden del tamaño que se ven', () => {
  it('Google Drive: cambia el ancho pedido; el almacén de Herbavida: usa la versión chica; lo demás queda igual', () => {
    expect(imageUrl('https://lh3.googleusercontent.com/d/ABC=w1000', 200)).toBe('https://lh3.googleusercontent.com/d/ABC=w400');
    expect(imageUrl('https://lh3.googleusercontent.com/d/ABC=w1000', 900)).toBe('https://lh3.googleusercontent.com/d/ABC=w1000');
    expect(imageUrl('https://fotos-qa.herbavidaperu.com/0123456789abcdef.webp', 200)).toBe('https://fotos-qa.herbavidaperu.com/0123456789abcdef-480.webp');
    expect(imageUrl('https://fotos-qa.herbavidaperu.com/0123456789abcdef.webp', 60)).toBe('https://fotos-qa.herbavidaperu.com/0123456789abcdef-160.webp');
    expect(imageUrl('https://fotos-qa.herbavidaperu.com/lote/0123456789abcdef.webp', 200)).toBe('https://fotos-qa.herbavidaperu.com/lote/0123456789abcdef.webp');
    expect(imageUrl('https://otro.example.com/x.jpg', 300)).toBe('https://otro.example.com/x.jpg');
  });
});

describe('el contacto: solo consulta, sin pedido', () => {
  const producto = PRODUCTS[0];

  it('el enlace de contacto va codificado hacia un número, sin texto de compra', () => {
    expect(waLink(GENERAL_MESSAGE)).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=Hola%2C%20Gold%20Roots/);
    expect(GENERAL_MESSAGE).not.toMatch(/pedido|carrito|precio|comprar/i);
  });

  it('el formulario arma una consulta con nombre, fórmula y texto', () => {
    const text = inquiryMessage({ name: ' Ana ', message: '  ¿Qué contiene? ', product: producto.name });
    expect(text.split('\n')).toEqual(['Hola, Gold Roots Nutrition. Me llamo Ana.', `Fórmula de interés: ${producto.name}`, '', '¿Qué contiene?']);
    expect(inquiryMessage({ name: 'Ana', message: 'Hola' })).not.toContain('Fórmula de interés');
  });

  it('ningún mensaje del contacto menciona montos, unidades ni ahorro', () => {
    const texto = `${GENERAL_MESSAGE} ${inquiryMessage({ name: 'Ana', message: 'Hola', product: producto.name })}`;
    expect(texto).not.toMatch(/US\$|cantidad|subtotal|ahorro|envío/i);
  });
});
