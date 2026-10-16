import raw from '@/data/productos.generado.json';

export type GoalId = 'energy' | 'heart' | 'brain' | 'sleep' | 'eye-skin' | 'immune';

export interface Product {
  slug: string;
  name: string;
  goal: GoalId;
  /** null = sin precio todavía («Coming soon») */
  price: number | null;
  compareAt: number | null;
  headline: string;
  summary: string;
  benefits: string[];
  ingredients: string[];
  format: string;
  image: string | null;
  featured: boolean;
}

export interface Goal {
  id: GoalId;
  label: string;
  short: string;
  blurb: string;
  /** Clases literales: Tailwind las busca en el código fuente y no puede construirlas en runtime. */
  text: string;
  soft: string;
  bar: string;
}

export const GOALS: Goal[] = [
  { id: 'energy', label: 'Energy & Vitality', short: 'Energy', blurb: 'Daily drive, stamina and focus', text: 'text-energy', soft: 'bg-energy/10', bar: 'bg-energy' },
  { id: 'heart', label: 'Heart & Circulation', short: 'Heart', blurb: 'Healthy blood flow and performance', text: 'text-heart', soft: 'bg-heart/10', bar: 'bg-heart' },
  { id: 'brain', label: 'Brain & Focus', short: 'Brain', blurb: 'Memory, clarity and concentration', text: 'text-brain', soft: 'bg-brain/10', bar: 'bg-brain' },
  { id: 'sleep', label: 'Sleep & Calm', short: 'Sleep', blurb: 'Rest well, recover better', text: 'text-sleep', soft: 'bg-sleep/10', bar: 'bg-sleep' },
  { id: 'eye-skin', label: 'Eye & Skin', short: 'Eye & skin', blurb: 'Antioxidant support for how you look and see', text: 'text-radiance', soft: 'bg-radiance/10', bar: 'bg-radiance' },
  { id: 'immune', label: 'Immune & Antioxidant', short: 'Immune', blurb: 'Everyday protection for your cells', text: 'text-immune', soft: 'bg-immune/10', bar: 'bg-immune' },
];

export const PRODUCTS = raw as Product[];

export const goalOf = (id: GoalId) => GOALS.find((g) => g.id === id) ?? GOALS[5];
export const goalLabel = (id: GoalId) => goalOf(id).label;
export const findProduct = (slug: string | undefined) => PRODUCTS.find((p) => p.slug === slug);
export const featured = () => PRODUCTS.filter((p) => p.featured);
export const countByGoal = (id: GoalId) => PRODUCTS.filter((p) => p.goal === id).length;

export const related = (product: Product, count = 4) =>
  [...PRODUCTS.filter((p) => p.goal === product.goal && p.slug !== product.slug), ...PRODUCTS.filter((p) => p.goal !== product.goal && p.slug !== product.slug)].slice(0, count);

export const money = (value: number) => `$${value.toFixed(2)}`;
export const priceLabel = (p: Product) => (p.price == null ? 'Coming soon' : money(p.price));
export const savings = (p: Product) => (p.price != null && p.compareAt != null ? p.compareAt - p.price : 0);
export const percentOff = (p: Product) => (p.price != null && p.compareAt != null ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const productPath = (slug: string) => `product/${slug}`;

/**
 * Dirección absoluta de una ruta, para el QR y para canonical/og.
 * Sin VITE_SITE_URL se usa el origen por el que se está viendo el sitio, así el QR funciona igual en la vista previa
 * de GitHub Pages que en el dominio definitivo.
 */
export function absoluteUrl(path: string): string {
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  const base = `${origin}${import.meta.env.BASE_URL}`;
  const clean = path.replace(/^\//, '');
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}

/** Ruta de una foto ya convertida en dirección absoluta (og:image). */
export function absoluteAsset(path: string): string {
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  return `${origin}${asset(path)}`;
}

export type SortId = 'featured' | 'price-asc' | 'price-desc' | 'name';

export function searchProducts(query: string, goal: GoalId | 'all', sort: SortId): Product[] {
  const q = query.trim().toLowerCase();
  const list = PRODUCTS.filter(
    (p) =>
      (goal === 'all' || p.goal === goal) &&
      (!q || `${p.name} ${p.headline} ${p.summary} ${p.ingredients.join(' ')} ${p.benefits.join(' ')}`.toLowerCase().includes(q)),
  );
  const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
  switch (sort) {
    case 'price-asc':
      return [...list].sort((a, b) => price(a) - price(b));
    case 'price-desc':
      return [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    case 'name':
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list;
  }
}
