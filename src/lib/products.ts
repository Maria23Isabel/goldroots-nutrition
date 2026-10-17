import raw from '@/data/productos.generado.json';
import { PRODUCTOS_ES } from '@/data/productos.es';

export type GoalId = 'energy' | 'heart' | 'brain' | 'sleep' | 'eye-skin' | 'immune';

export interface Product {
  slug: string;
  name: string;
  goal: GoalId;
  /** null = sin precio todavía: la pantalla dice «Consultar precio» */
  price: number | null;
  compareAt: number | null;
  headline: string;
  tagline: string;
  summary: string;
  benefits: string[];
  ingredients: string[];
  format: string;
  image: string | null;
  featured: boolean;
}

export interface Goal {
  id: GoalId;
  /** Lo que se escribe en la dirección: /catalogo?objetivo=energia */
  slug: string;
  label: string;
  short: string;
  blurb: string;
  /** Pregunta del buscador de fórmulas */
  wish: string;
}

export const GOALS: Goal[] = [
  { id: 'energy', slug: 'energia', label: 'Energía y vitalidad', short: 'Energía', blurb: 'Pilas para el día: resistencia, aguante y enfoque', wish: 'Quiero más energía y aguante' },
  { id: 'heart', slug: 'corazon', label: 'Corazón y circulación', short: 'Corazón', blurb: 'Buen flujo sanguíneo y mejor rendimiento', wish: 'Quiero cuidar mi corazón y mi circulación' },
  { id: 'brain', slug: 'cerebro', label: 'Mente y enfoque', short: 'Mente', blurb: 'Memoria, claridad y concentración', wish: 'Quiero concentrarme y pensar con claridad' },
  { id: 'sleep', slug: 'sueno', label: 'Sueño y calma', short: 'Sueño', blurb: 'Descansa mejor y recupérate de verdad', wish: 'Quiero dormir mejor y relajarme' },
  { id: 'eye-skin', slug: 'vista-y-piel', label: 'Vista y piel', short: 'Vista y piel', blurb: 'Antioxidantes para cómo te ves y cómo ves', wish: 'Quiero cuidar mi vista y mi piel' },
  { id: 'immune', slug: 'defensas', label: 'Defensas y antioxidantes', short: 'Defensas', blurb: 'Protección diaria para tus células', wish: 'Quiero reforzar mis defensas' },
];

export const PRODUCTS: Product[] = (raw as Array<Omit<Product, 'tagline'>>).map((p) => {
  const es = PRODUCTOS_ES[p.slug];
  return es ? { ...p, ...es } : { ...p, tagline: p.headline };
});

export const goalOf = (id: GoalId) => GOALS.find((g) => g.id === id) ?? GOALS[5];
export const goalBySlug = (slug: string | null | undefined) => GOALS.find((g) => g.slug === slug);
export const goalLabel = (id: GoalId) => goalOf(id).label;
export const findProduct = (slug: string | undefined) => PRODUCTS.find((p) => p.slug === slug);
export const featured = () => PRODUCTS.filter((p) => p.featured);
export const countByGoal = (id: GoalId) => PRODUCTS.filter((p) => p.goal === id).length;

export const related = (product: Product, count = 4) =>
  [...PRODUCTS.filter((p) => p.goal === product.goal && p.slug !== product.slug), ...PRODUCTS.filter((p) => p.goal !== product.goal && p.slug !== product.slug)].slice(0, count);

export const money = (value: number) => `US$ ${value.toFixed(2)}`;
export const priceLabel = (p: Product) => (p.price == null ? 'Consultar precio' : money(p.price));
export const savings = (p: Product) => (p.price != null && p.compareAt != null ? p.compareAt - p.price : 0);
export const percentOff = (p: Product) => (p.price != null && p.compareAt != null ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const productPath = (slug: string) => `producto/${slug}`;

/**
 * Dirección absoluta de una ruta, para el QR y para canonical/og.
 * Sin VITE_SITE_URL se usa el origen por el que se está viendo el sitio, así el QR funciona igual en la vista previa
 * de GitHub Pages que en el dominio definitivo.
 * GitHub Pages sirve cada ruta con barra final (sin ella responde 301), así que canonical y QR van con la barra.
 */
export function absoluteUrl(path: string): string {
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  const clean = path.replace(/^\/|\/$/g, '');
  return `${origin}${import.meta.env.BASE_URL}${clean ? `${clean}/` : ''}`;
}

/** Ruta de una foto ya convertida en dirección absoluta (og:image). */
export function absoluteAsset(path: string): string {
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  return `${origin}${asset(path)}`;
}

export type SortId = 'featured' | 'price-asc' | 'price-desc' | 'name';

/** Sin tildes ni mayúsculas: «energia» encuentra «Energía». */
export const plain = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export function searchProducts(query: string, goal: GoalId | 'all', sort: SortId): Product[] {
  const q = plain(query.trim());
  const list = PRODUCTS.filter(
    (p) =>
      (goal === 'all' || p.goal === goal) &&
      (!q || plain(`${p.name} ${p.headline} ${p.tagline} ${p.summary} ${p.ingredients.join(' ')} ${p.benefits.join(' ')}`).includes(q)),
  );
  const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
  switch (sort) {
    case 'price-asc':
      return [...list].sort((a, b) => price(a) - price(b));
    case 'price-desc':
      return [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    case 'name':
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    default:
      return list;
  }
}
