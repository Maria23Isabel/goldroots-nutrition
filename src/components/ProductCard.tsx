import { IconArrowUpRight } from '@tabler/icons-react';
import { Link } from 'react-router';
import { GoalBadge } from './ui';
import { asset, productPath, type Product } from '@/lib/products';

export function ProductImage({ product, width = 480, eager = false, className = '' }: { product: Product; width?: number; eager?: boolean; className?: string }) {
  if (!product.image) return <div className={`grid place-items-center text-sm text-muted ${className}`}>Foto próximamente</div>;
  return <img src={asset(product.image)} alt={`Frasco de ${product.name}`} width={width} height={Math.round(width * 1.49)} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`shot ${className}`} />;
}

export function ProductCard({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <article className={`g-${product.goal} card card-lift group flex h-full flex-col overflow-hidden ${className}`}>
      <Link to={`/${productPath(product.slug)}`} aria-label={`Ver ficha de ${product.name}`} className="block">
        <div className="goal-block relative grid aspect-[4/3.6] place-items-center overflow-hidden">
          <ProductImage product={product} className="absolute inset-0 size-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.045]" />
          <span className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-surface/90 text-night opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-1">
            <IconArrowUpRight size={17} aria-hidden="true" />
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <GoalBadge goal={product.goal} small />
        <h3 className="mt-3 font-display text-[1.08rem] leading-snug font-medium text-fg">
          <Link to={`/${productPath(product.slug)}`} className="transition-colors hover:text-accent-deep">{product.name}</Link>
        </h3>
        <p className="mt-2 flex-1 text-[0.87rem] leading-relaxed text-muted">{product.tagline}</p>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[0.8rem]">
          <span className="text-muted">{product.format || 'Presentación por confirmar'}</span>
          <Link to={`/${productPath(product.slug)}`} className="link-swipe font-semibold text-night">Ver ficha</Link>
        </div>
      </div>
    </article>
  );
}
