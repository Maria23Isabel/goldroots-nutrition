// Datos de las escenas interactivas. Todo sale de los productos que Herbavida entrega: aquí no se escribe ninguna característica a mano ni se elige un producto por su nombre.
import { DEFAULTS } from './defaults';
import { GOALS, goalOf, type GoalId, type Product } from './products';

const byFeaturedThenName = (a: Product, b: Product) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, 'es');

/** Las fórmulas de un objetivo: primero las que la marca destaca y, dentro de cada grupo, por nombre. */
export function rank(products: Product[], goal: GoalId): Product[] {
  return products.filter((product) => product.goal === goal).sort(byFeaturedThenName);
}

/** Un dato verificable de una ficha: el nombre de lo que es y el texto tal como está en el catálogo. */
export interface Beat {
  key: 'goal' | 'format' | 'ingredients' | 'benefit-1' | 'benefit-2';
  label: string;
  text: string;
}

/** Los datos que se van encendiendo mientras se baja por la escena de un producto. Lo que Herbavida no trae no se rellena: simplemente no hay ese dato. */
export function beatsOf(product: Product): Beat[] {
  const beats: Beat[] = [{ key: 'goal', label: 'Objetivo', text: goalOf(product.goal).label }];
  beats.push({ key: 'format', label: 'Presentación', text: product.format || DEFAULTS.formatMissing });
  beats.push({ key: 'ingredients', label: 'Ingredientes', text: product.ingredients.length ? product.ingredients.join(' · ') : DEFAULTS.ingredientsMissing });
  if (product.benefits[0]) beats.push({ key: 'benefit-1', label: 'Beneficio declarado', text: product.benefits[0] });
  if (product.benefits[1]) beats.push({ key: 'benefit-2', label: 'Beneficio declarado', text: product.benefits[1] });
  return beats;
}

/**
 * Hasta `count` productos, de objetivos distintos mientras alcance (un producto por objetivo) y completando con el resto por orden de la marca. Los que tienen
 * foto van primero (las escenas se ven mejor con ella), pero uno sin foto también entra si no hay otros: en ese caso sale la imagen de respaldo.
 * Sirve para las escenas que enseñan variedad: la historia anclada, el selector y «La marca».
 */
export function pickVaried(products: Product[], count: number): Product[] {
  const withPhoto = [...products].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)) || byFeaturedThenName(a, b));
  const chosen: Product[] = [];
  for (const goal of [...GOALS.map((g) => g.id), 'general' as const]) {
    const first = withPhoto.find((product) => product.goal === goal);
    if (first && chosen.length < count) chosen.push(first);
  }
  for (const product of withPhoto) if (chosen.length < count && !chosen.includes(product)) chosen.push(product);
  return chosen;
}

/** El producto de la escena «Producto destacado»: el primero que la marca destaca, o el primero con foto. */
export const spotlightOf = (products: Product[]): Product | undefined => pickVaried(products, 1)[0];

/** Qué número de tramo (0…count-1) toca con un avance de 0 a 1. Se usa para encender los datos uno por uno sin saltarse ninguno. */
export function stepAt(progress: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

/** Las cifras de «Calidad y confianza»: solo lo que se puede contar en el propio catálogo. */
export function trustFacts(products: Product[]) {
  return { formulas: products.length, goals: GOALS.filter((goal) => products.some((product) => product.goal === goal.id)).length, sheets: products.filter((product) => product.image).length };
}
