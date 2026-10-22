// Las direcciones de producto de la primera versión de Gold Roots (/producto/zinc-triple-play…) siguen abriendo: cada una lleva a la ficha actual del mismo producto.
// Herbavida arma la dirección con el nombre y su código (`zinc-triple-goldroots-hv-01461`), así que aquí se guarda la parte del nombre de cada una y se busca el producto
// por ella. Un producto nuevo no necesita estar aquí: nace con su dirección de Herbavida y esa es la que se usa.
import legacy from './legacy-slugs.json';
import type { Product } from './products';

/** dirección antigua → nombre base de la dirección actual (la de Herbavida sin el código -hv-NNNNN). Vive en un JSON para que también lo lea scripts/postbuild.mjs y escriba las redirecciones 301. */
export const LEGACY_SLUGS: Record<string, string> = legacy;

/** El código que Herbavida agrega al final de la dirección: -hv-01461 (y -2, -3… si el nombre se repite) */
const SKU_SUFFIX = /-hv-\d+(-\d+)?$/;

/** El producto actual que corresponde a una dirección antigua, si lo hay. */
export function findByLegacySlug(products: Product[], slug: string | undefined): Product | undefined {
  const base = slug ? LEGACY_SLUGS[slug] : undefined;
  return base ? products.find((product) => product.slug.replace(SKU_SUFFIX, '') === base) : undefined;
}
