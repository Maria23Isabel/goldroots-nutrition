// Datos de las escenas interactivas. Todo sale de los 14 productos reales del catálogo: aquí no se escribe ninguna característica a mano.
import { findProduct, GOALS, goalOf, PRODUCTS, type GoalId, type Product } from './products';

/** Las fórmulas de un objetivo: primero las que la marca destaca y, dentro de cada grupo, por nombre. */
export function rank(goal: GoalId): Product[] {
  return PRODUCTS.filter((product) => product.goal === goal).sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, 'es'));
}

/** Un dato verificable de una ficha: el nombre de lo que es y el texto tal como está en el catálogo. */
export interface Beat {
  key: 'goal' | 'format' | 'ingredients' | 'benefit-1' | 'benefit-2';
  label: string;
  text: string;
}

/** Los cinco datos que se van encendiendo mientras se baja por la escena de un producto. */
export function beatsOf(product: Product): Beat[] {
  const beats: Beat[] = [
    { key: 'goal', label: 'Objetivo', text: goalOf(product.goal).label },
    { key: 'format', label: 'Presentación', text: product.format || 'Presentación por confirmar' },
    { key: 'ingredients', label: 'Ingredientes', text: product.ingredients.join(' · ') },
  ];
  if (product.benefits[0]) beats.push({ key: 'benefit-1', label: 'Beneficio declarado', text: product.benefits[0] });
  if (product.benefits[1]) beats.push({ key: 'benefit-2', label: 'Beneficio declarado', text: product.benefits[1] });
  return beats;
}

/** Los tres productos de la escena anclada: tres objetivos distintos, para que cambiar de uno a otro se note. */
export const FEATURED_SLUGS = ['shilajit-gold', 'lions-mane-blend-complex', 'ashwagandha-melatonin-magnesium'] as const;
export const featuredStories = (): Product[] => FEATURED_SLUGS.map((slug) => findProduct(slug)).filter((product): product is Product => Boolean(product));

/** Las cinco fórmulas del selector: cinco objetivos distintos, para que comparar tenga sentido. */
export const SHOWCASE_SLUGS = ['shilajit-gold', 'lions-mane-blend-complex', 'ashwagandha-melatonin-magnesium', 'zinc-triple-play', 'vision-pro'] as const;
export const showcasePicks = (): Product[] => SHOWCASE_SLUGS.map((slug) => findProduct(slug)).filter((product): product is Product => Boolean(product));

/** Qué número de tramo (0…count-1) toca con un avance de 0 a 1. Se usa para encender los datos uno por uno sin saltarse ninguno. */
export function stepAt(progress: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

/** Las cifras de «Calidad y confianza»: solo lo que se puede contar en el propio catálogo. */
export function trustFacts() {
  const capsules = PRODUCTS.filter((product) => /\b60\b/.test(product.format)).length;
  return { formulas: PRODUCTS.length, goals: GOALS.length, capsules, sheets: PRODUCTS.filter((product) => product.image).length };
}
