import { IconArrowUpRight } from '@tabler/icons-react';
import { Link } from 'react-router';
import { AddButton, GoalBadge, PriceTag } from './ui';
import { asset, percentOff, productPath, type Product } from '@/lib/products';

/** Foto del frasco sobre el degradado de su objetivo (la foto trae fondo blanco; «multiply» lo funde con el color). */
export function ProductImage({ product, width = 480, eager = false, className = '' }: { product: Product; width?: number; eager?: boolean; className?: string }) {
  if (!product.image) return <div className={`grid place-items-center text-sm text-muted ${className}`}>Foto próximamente</div>;
  return <img src={asset(product.image)} alt={`Frasco de ${product.name}`} width={width} height={Math.round(width * 1.49)} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`shot ${className}`} />;
}

export function ProductCard({ product, className = '' }: { product: Product; className?: string }) {
  const off = percentOff(product);
  return (
    <article className={`g-${product.goal} card-lift group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface shadow-sm ring-1 ring-line ${className}`}>
      <Link to={`/${productPath(product.slug)}`} aria-label={`Ver ${product.name}`} className="relative block">
        <div className="grad-goal relative grid aspect-[4/4.4] place-items-center overflow-hidden">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/25 blur-2xl transition duration-500 group-hover:scale-150" aria-hidden="true" />
          <ProductImage product={product} className="absolute inset-0 size-full object-contain p-4 transition duration-500 group-hover:scale-110 group-hover:-rotate-3" />
          {off > 0 && <span className="absolute top-4 left-4 rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-night shadow-md">−{off}%</span>}
          <span className="absolute right-4 bottom-4 grid size-10 translate-y-2 place-items-center rounded-full bg-paper text-night opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
            <IconArrowUpRight size={20} />
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <GoalBadge goal={product.goal} small />
        <div>
          <h3 className="font-display text-lg leading-tight font-extrabold text-fg">
            <Link to={`/${productPath(product.slug)}`} className="hover:text-coral-deep">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-muted">{product.tagline}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <PriceTag product={product} />
        </div>
        <AddButton product={product} compact variant="ink" className="w-full" />
      </div>
    </article>
  );
}
