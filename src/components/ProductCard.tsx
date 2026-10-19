import { Link } from 'react-router';
import { AddButton, PriceTag } from './ui';
import { asset, goalOf, percentOff, productPath, type Product } from '@/lib/products';

/** Foto del frasco sobre un bloque pastel plano (sin degradado ni reflejo): la foto trae fondo blanco y «multiply» la funde con el color. */
export function ProductImage({ product, width = 480, eager = false, className = '' }: { product: Product; width?: number; eager?: boolean; className?: string }) {
  if (!product.image) return <div className={`grid place-items-center text-sm text-muted ${className}`}>Foto próximamente</div>;
  return <img src={asset(product.image)} alt={`Frasco de ${product.name}`} width={width} height={Math.round(width * 1.49)} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`shot ${className}`} />;
}

/** Orden de la ficha de producto de referencia: foto, nombre, descripción corta, precio, botón. */
export function ProductCard({ product, className = '' }: { product: Product; className?: string }) {
  const off = percentOff(product);
  return (
    <article className={`g-${product.goal} card card-lift group flex h-full flex-col overflow-hidden ${className}`}>
      <Link to={`/${productPath(product.slug)}`} aria-label={`Ver ${product.name}`} className="block">
        <div className="goal-block relative grid aspect-[4/3.5] place-items-center overflow-hidden">
          <ProductImage product={product} className="absolute inset-0 size-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]" />
          {off > 0 && <span className="absolute top-3 left-3 rounded-full bg-surface px-2 py-0.5 text-[0.7rem] font-semibold text-wa-deep shadow-sm">−{off}%</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-goal text-[0.7rem] font-semibold tracking-[0.12em] uppercase">{goalOf(product.goal).short}</p>
        <h3 className="font-display text-[1.02rem] leading-snug font-medium text-fg">
          <Link to={`/${productPath(product.slug)}`} className="transition-colors hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="text-[0.85rem] leading-snug text-muted">{product.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <PriceTag product={product} />
          <span className="text-[0.75rem] text-muted">{product.format}</span>
        </div>
        <AddButton product={product} compact variant="night" className="mt-2 w-full" />
      </div>
    </article>
  );
}
