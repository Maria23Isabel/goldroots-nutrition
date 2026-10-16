import { IconArrowBarRight, IconQrcode } from '@tabler/icons-react';
import { Link } from 'react-router';
import { asset, goalOf, money, percentOff, type Product } from '@/lib/products';

export function ProductCard({ product }: { product: Product }) {
  const off = percentOff(product);
  const soon = product.price == null;
  const goal = goalOf(product.goal);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl hover:shadow-forest/10">
      <Link to={`/product/${product.slug}`} className="relative block bg-gradient-to-b from-sand/80 to-white" aria-label={`${product.name} — open product page`}>
        {off > 0 && <span className="absolute top-3 left-3 z-10 rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wider text-forest uppercase">−{off}%</span>}
        {soon && <span className="absolute top-3 left-3 z-10 rounded-full bg-forest px-3 py-1 text-xs font-bold tracking-wider text-gold uppercase">Coming soon</span>}
        {product.image && (
          <img
            src={asset(product.image)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={600}
            height={900}
            className="mx-auto aspect-[4/5] w-full object-contain p-4 mix-blend-multiply transition duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-forest/85 text-gold opacity-0 transition group-hover:opacity-100" aria-hidden="true">
          <IconQrcode size={18} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className={`text-xs font-bold tracking-[0.18em] uppercase ${goal.text}`}>{goal.label}</p>
        <h3 className="mt-1.5 font-sans text-base leading-snug font-extrabold tracking-wide text-forest uppercase">
          <Link to={`/product/${product.slug}`} className="hover:text-gold-deep">
            {product.name}
          </Link>
        </h3>
        {product.format && <p className="mt-1 text-sm text-muted">{product.format}</p>}
        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <p className="flex items-baseline gap-2">
            {soon ? (
              <span className="text-sm font-semibold text-muted">Price to be announced</span>
            ) : (
              <>
                <span className="text-xl font-bold text-forest">{money(product.price!)}</span>
                {product.compareAt && <s className="text-sm text-muted">{money(product.compareAt)}</s>}
              </>
            )}
          </p>
          <Link to={`/product/${product.slug}`} className="inline-flex items-center gap-1 text-sm font-bold tracking-wider text-gold-deep uppercase hover:text-forest">
            Details <IconArrowBarRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
