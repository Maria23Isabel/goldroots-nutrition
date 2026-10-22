import raw from '@/data/productos.generado.json';
import { PRODUCTOS_ES } from '@/data/productos.es';

export type GoalId = 'energy' | 'heart' | 'brain' | 'sleep' | 'eye-skin' | 'immune';

export interface Product {
  slug: string;
  name: string;
  goal: GoalId;
  headline: string;
  tagline: string;
  summary: string;
  benefits: string[];
  ingredients: string[];
  format: string;
  image: string | null;
  featured: boolean;
}

interface RawProduct extends Omit<Product, 'tagline'> {
  price?: number | null;
  compareAt?: number | null;
}

export interface Goal {
  id: GoalId;
  slug: string;
  label: string;
  short: string;
  blurb: string;
  wish: string;
}

export const GOALS: Goal[] = [
  { id: 'energy', slug: 'energia', label: 'Energía y vitalidad', short: 'Energía', blurb: 'Fórmulas orientadas a la resistencia, la vitalidad y el enfoque diario', wish: 'Quiero explorar energía y vitalidad' },
  { id: 'heart', slug: 'corazon', label: 'Corazón y circulación', short: 'Corazón', blurb: 'Ingredientes asociados al bienestar cardiovascular y la circulación', wish: 'Quiero explorar corazón y circulación' },
  { id: 'brain', slug: 'cerebro', label: 'Mente y enfoque', short: 'Mente', blurb: 'Opciones para memoria, claridad y concentración', wish: 'Quiero explorar mente y enfoque' },
  { id: 'sleep', slug: 'sueno', label: 'Sueño y calma', short: 'Sueño', blurb: 'Fórmulas creadas para acompañar la relajación y el descanso', wish: 'Quiero explorar sueño y calma' },
  { id: 'eye-skin', slug: 'vista-y-piel', label: 'Vista y piel', short: 'Vista y piel', blurb: 'Antioxidantes e ingredientes para el bienestar visual y de la piel', wish: 'Quiero explorar vista y piel' },
  { id: 'immune', slug: 'defensas', label: 'Defensas y antioxidantes', short: 'Defensas', blurb: 'Nutrientes y antioxidantes para el bienestar cotidiano', wish: 'Quiero explorar defensas y antioxidantes' },
];

export const PRODUCTS: Product[] = (raw as RawProduct[]).map((source) => {
  const es = PRODUCTOS_ES[source.slug];
  const text = es ?? {
    name: source.name,
    headline: source.headline,
    tagline: source.headline,
    summary: source.summary,
    benefits: source.benefits,
    ingredients: source.ingredients,
    format: source.format,
  };
  return {
    slug: source.slug,
    name: text.name,
    goal: source.goal,
    headline: text.headline,
    tagline: text.tagline,
    summary: text.summary,
    benefits: text.benefits,
    ingredients: text.ingredients,
    format: text.format,
    image: source.image,
    featured: source.featured,
  };
});

export const goalOf = (id: GoalId) => GOALS.find((g) => g.id === id) ?? GOALS[5];
export const goalBySlug = (slug: string | null | undefined) => GOALS.find((g) => g.slug === slug);
export const findProduct = (slug: string | undefined) => PRODUCTS.find((p) => p.slug === slug);
export const featured = () => PRODUCTS.filter((p) => p.featured);
export const countByGoal = (id: GoalId) => PRODUCTS.filter((p) => p.goal === id).length;

export const related = (product: Product, count = 4) =>
  [...PRODUCTS.filter((p) => p.goal === product.goal && p.slug !== product.slug), ...PRODUCTS.filter((p) => p.goal !== product.goal && p.slug !== product.slug)].slice(0, count);

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const productPath = (slug: string) => `producto/${slug}`;

export function absoluteUrl(path: string): string {
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  const clean = path.replace(/^\/|\/$/g, '');
  return `${origin}${import.meta.env.BASE_URL}${clean ? `${clean}/` : ''}`;
}

export function absoluteAsset(path: string): string {
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  return `${origin}${asset(path)}`;
}

export type SortId = 'featured' | 'name';

export const plain = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export function searchProducts(query: string, goal: GoalId | 'all', sort: SortId): Product[] {
  const q = plain(query.trim());
  const list = PRODUCTS.filter(
    (p) =>
      (goal === 'all' || p.goal === goal) &&
      (!q || plain(`${p.name} ${p.headline} ${p.tagline} ${p.summary} ${p.ingredients.join(' ')} ${p.benefits.join(' ')}`).includes(q)),
  );
  if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
}
