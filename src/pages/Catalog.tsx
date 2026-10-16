import { IconLayoutGrid, IconList, IconSearch, IconX } from '@tabler/icons-react';
import { Link, useSearchParams } from 'react-router';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { GOALS, PRODUCTS, goalOf, money, priceLabel, searchProducts, type GoalId, type SortId } from '@/lib/products';

const SORTS: Array<{ id: SortId; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name: A to Z' },
];

export function Catalog() {
  const [params, setParams] = useSearchParams();
  const goal = (GOALS.some((g) => g.id === params.get('goal')) ? params.get('goal') : 'all') as GoalId | 'all';
  const sort = (SORTS.some((s) => s.id === params.get('sort')) ? params.get('sort') : 'featured') as SortId;
  const q = params.get('q') ?? '';
  const view = params.get('view') === 'list' ? 'list' : 'grid';
  const list = searchProducts(q, goal, sort);
  const filtered = goal !== 'all' || q.trim() !== '';

  usePageMeta({
    title: 'Catalog — all 14 Gold Roots formulas',
    description: 'Browse every Gold Roots Nutrition supplement by wellness goal, ingredient or price.',
    path: '/catalog',
  });

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all' && value !== 'featured' && value !== 'grid') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const chip = (active: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition ${
      active ? 'border-forest bg-forest text-white' : 'border-line bg-white text-forest hover:border-gold'
    }`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Catalog</p>
        <h1 className="mt-3 text-4xl text-forest sm:text-6xl">All formulas</h1>
        <p className="mt-4 text-lg text-muted">Essential nutrition for daily wellness. Every product page also carries a QR code you can print on the bottle or the shelf.</p>
      </header>

      <div className="sticky top-20 z-30 -mx-5 mt-10 border-y border-line bg-ivory/95 px-5 py-4 backdrop-blur">
        <div className="grid gap-4 lg:items-center lg:justify-between xl:grid-cols-[1fr_auto]">
          <div role="group" aria-label="Filter by wellness goal" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            <button type="button" aria-pressed={goal === 'all'} onClick={() => set('goal', 'all')} className={chip(goal === 'all')}>
              All <span className="opacity-70">{PRODUCTS.length}</span>
            </button>
            {GOALS.map((g) => (
              <button key={g.id} type="button" aria-pressed={goal === g.id} onClick={() => set('goal', g.id)} className={chip(goal === g.id)}>
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
              <label htmlFor="q" className="sr-only">
                Search the catalog
              </label>
              <IconSearch size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gold-deep" aria-hidden="true" />
              <input id="q" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search…" className="h-11 w-full rounded-full border border-line bg-white pr-10 pl-11" />
              {q && (
                <button type="button" onClick={() => set('q', '')} aria-label="Clear search" className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-forest">
                  <IconX size={16} />
                </button>
              )}
            </div>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select id="sort" value={sort} onChange={(e) => set('sort', e.target.value)} className="h-11 rounded-full border border-line bg-white px-4 font-medium">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <div role="group" aria-label="Choose how products are shown" className="flex overflow-hidden rounded-full border border-line bg-white">
              <button type="button" aria-pressed={view === 'grid'} onClick={() => set('view', 'grid')} className={`grid size-11 place-items-center ${view === 'grid' ? 'bg-forest text-gold' : 'text-forest hover:bg-sand'}`}>
                <IconLayoutGrid size={20} aria-hidden="true" />
                <span className="sr-only">Grid view</span>
              </button>
              <button type="button" aria-pressed={view === 'list'} onClick={() => set('view', 'list')} className={`grid size-11 place-items-center ${view === 'list' ? 'bg-forest text-gold' : 'text-forest hover:bg-sand'}`}>
                <IconList size={20} aria-hidden="true" />
                <span className="sr-only">List view</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        Showing <strong className="text-forest">{list.length}</strong> of {PRODUCTS.length} formulas
        {filtered && (
          <>
            {' · '}
            <button type="button" onClick={() => setParams({}, { replace: true })} className="font-bold text-gold-deep uppercase underline underline-offset-4 hover:text-forest">
              Clear filters
            </button>
          </>
        )}
      </p>

      {list.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-line bg-white py-20 text-center">
          <p className="font-serif text-2xl text-forest">No products match your search</p>
          <p className="mt-2 text-muted">Try a different goal, or search by ingredient — for example “magnesium” or “ashwagandha”.</p>
          <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-4 font-bold tracking-wider text-gold-deep uppercase underline underline-offset-4">
            Clear filters
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">All Gold Roots formulas with the goal they support, format, key ingredients and price</caption>
            <thead>
              <tr className="border-b border-line text-xs tracking-[0.16em] text-muted uppercase">
                <th scope="col" className="px-5 py-4">Formula</th>
                <th scope="col" className="px-5 py-4">Supports</th>
                <th scope="col" className="px-5 py-4">Format</th>
                <th scope="col" className="px-5 py-4">Key ingredients</th>
                <th scope="col" className="px-5 py-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const g = goalOf(p.goal);
                return (
                  <tr key={p.slug} className="border-b border-line/70 last:border-0 hover:bg-sand/40">
                    <th scope="row" className="px-5 py-4 font-bold tracking-wide text-forest uppercase">
                      <Link to={`/product/${p.slug}`} className="hover:text-gold-deep">
                        {p.name}
                      </Link>
                    </th>
                    <td className="px-5 py-4">
                      <Link to={`/catalog?goal=${p.goal}`} className={`inline-flex items-center gap-2 font-semibold ${g.text} hover:underline`}>
                        <span className={`size-2 rounded-full ${g.bar}`} aria-hidden="true" /> {g.label}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-muted">{p.format || '—'}</td>
                    <td className="px-5 py-4 text-muted">{p.ingredients.slice(0, 3).join(', ') || '—'}</td>
                    <td className="px-5 py-4 font-bold text-forest">{p.price != null ? money(p.price) : priceLabel(p)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
