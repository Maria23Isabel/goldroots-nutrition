// Tipos y reglas del catálogo. Los datos (marcas y productos) ya no viven en el código: llegan de Herbavida por `lib/catalog.ts`. Aquí solo hay lo que es del
// diseño de Gold Roots —los seis objetivos y su aspecto— y funciones puras que trabajan sobre la lista de productos que reciben.
export type GoalId = 'energy' | 'heart' | 'brain' | 'sleep' | 'eye-skin' | 'immune' | 'general';

export interface Product {
  slug: string;
  name: string;
  brandId: number;
  brandName: string;
  goal: GoalId;
  headline: string;
  tagline: string;
  summary: string;
  benefits: string[];
  ingredients: string[];
  /** Presentación («60 cápsulas»); vacío si Herbavida no la tiene */
  format: string;
  /** Modo de uso, solo si Herbavida lo trae: nunca se inventa */
  usage: string | null;
  /** Datos extra de la ficha (origen, país de fabricación, duración del envase…) */
  attributes: { name: string; value: string }[];
  /** Fotos del producto; la primera es la principal. Vacío = se usa la imagen de respaldo */
  images: string[];
  image: string | null;
  featured: boolean;
}

export interface Brand {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  colors: { name: string; hex: string }[];
}

export interface Goal {
  id: Exclude<GoalId, 'general'>;
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

/** Lo que no tiene objetivo en Herbavida: no es una de las seis puertas, pero se puede explorar. */
export const GENERAL_GOAL = { id: 'general' as const, slug: 'general', label: 'General', short: 'General', blurb: 'Fórmulas de la línea que todavía no tienen un objetivo asignado', wish: 'Quiero explorar la línea' };

export const goalOf = (id: GoalId) => (id === 'general' ? GENERAL_GOAL : (GOALS.find((g) => g.id === id) ?? GENERAL_GOAL));
export const goalBySlug = (slug: string | null | undefined) => (slug === GENERAL_GOAL.slug ? GENERAL_GOAL : GOALS.find((g) => g.slug === slug));

export const plain = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

/** El texto que Herbavida guarda como «Objetivo» → uno de los seis; cualquier otra cosa (o nada) es «general». Acepta el nombre completo, el corto o la dirección. */
export function goalFromText(text: string | null | undefined): GoalId {
  const key = plain(text ?? '');
  if (!key) return 'general';
  return GOALS.find((g) => [g.label, g.short, g.slug, g.id].some((candidate) => plain(candidate) === key))?.id ?? 'general';
}

export const productPath = (slug: string) => `producto/${slug}`;
export const findProduct = (products: Product[], slug: string | undefined) => products.find((p) => p.slug === slug);
export const featured = (products: Product[]) => products.filter((p) => p.featured);
export const countByGoal = (products: Product[], id: GoalId) => products.filter((p) => p.goal === id).length;

export const related = (products: Product[], product: Product, count = 4) =>
  [...products.filter((p) => p.goal === product.goal && p.slug !== product.slug), ...products.filter((p) => p.goal !== product.goal && p.slug !== product.slug)].slice(0, count);

/** Imágenes y archivos propios del sitio (logo, escenas): llevan la base de la ruta. Un enlace completo (las fotos que vienen de Herbavida) pasa tal cual. */
export const asset = (path: string) => (/^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path}`);

export function absoluteUrl(path: string): string {
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  const clean = path.replace(/^\/|\/$/g, '');
  return `${origin}${import.meta.env.BASE_URL}${clean ? `${clean}/` : ''}`;
}

export function absoluteAsset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin);
  return `${origin}${asset(path)}`;
}

export type SortId = 'featured' | 'name';

export function searchProducts(products: Product[], query: string, goal: GoalId | 'all', sort: SortId): Product[] {
  const q = plain(query);
  const list = products.filter(
    (p) =>
      (goal === 'all' || p.goal === goal) &&
      (!q || plain(`${p.name} ${p.brandName} ${p.headline} ${p.tagline} ${p.summary} ${p.ingredients.join(' ')} ${p.benefits.join(' ')}`).includes(q)),
  );
  if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
}
