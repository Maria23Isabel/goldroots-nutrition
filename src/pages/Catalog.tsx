import { IconLayoutGrid, IconList, IconSearch, IconX } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { AddButton, buttonClass, GOAL_ICONS, GoalBadge, PriceTag } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { countByGoal, goalBySlug, GOALS, PRODUCTS, productPath, searchProducts, type GoalId, type SortId } from '@/lib/products';

const SORTS: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Destacados primero' },
  { id: 'price-asc', label: 'Precio: de menor a mayor' },
  { id: 'price-desc', label: 'Precio: de mayor a menor' },
  { id: 'name', label: 'Nombre (A–Z)' },
];

export function Catalog() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const goal: GoalId | 'all' = goalBySlug(params.get('objetivo'))?.id ?? 'all';
  const sort = (SORTS.find((s) => s.id === params.get('orden'))?.id ?? 'featured') as SortId;
  const view = params.get('vista') === 'lista' ? 'lista' : 'cuadricula';

  const set = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };

  const results = useMemo(() => searchProducts(q, goal, sort), [q, goal, sort]);
  const current = goal === 'all' ? null : GOALS.find((g) => g.id === goal)!;

  usePageMeta({
    title: `${current ? current.label : 'Catálogo'} — Gold Roots Nutrition`,
    description: current ? `${current.blurb}. Fórmulas de Gold Roots Nutrition para ${current.label.toLowerCase()}.` : `Las ${PRODUCTS.length} fórmulas de Gold Roots Nutrition: busca por nombre, ingrediente u objetivo.`,
    path: '/catalogo',
  });

  const chip = (active: boolean) => `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${active ? 'bg-inv text-inv-fg shadow-lg' : 'bg-surface text-fg ring-1 ring-line hover:bg-sun/40'}`;

  return (
    <>
      <header className="grain relative overflow-hidden bg-ink pt-32 pb-24 text-white sm:pt-40">
        <div className="animate-drift pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-coral/35 blur-3xl" aria-hidden="true" />
        <div className="animate-drift pointer-events-none absolute -bottom-32 left-10 size-96 rounded-full bg-violet-600/35 blur-3xl [animation-delay:-6s]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="eyebrow !text-sun">Catálogo</p>
          <h1 className="mt-3 text-5xl leading-none font-extrabold sm:text-7xl">{current ? current.label : 'Todas las fórmulas'}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">{current ? current.blurb : `${PRODUCTS.length} fórmulas en cápsulas vegetarianas. Filtra por objetivo, busca por ingrediente y agrega al pedido lo que te guste.`}</p>
        </div>
        <svg className="absolute inset-x-0 bottom-[-1px] w-full text-cream" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 60V30C300 0 600 0 900 20s400 20 540 0v40z" />
        </svg>
      </header>

      <div className="sticky top-[4.75rem] z-30 mx-auto -mt-8 max-w-6xl px-3 sm:px-5">
        <div className="glass rounded-[2rem] p-3 shadow-xl shadow-ink/10 ring-1 ring-line sm:p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[14rem] flex-1">
              <label htmlFor="buscar" className="sr-only">
                Buscar por nombre, ingrediente o beneficio
              </label>
              <IconSearch size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input id="buscar" type="search" value={q} onChange={(e) => set({ q: e.target.value || null })} placeholder="Busca: magnesio, maca, sueño…" className="h-12 w-full rounded-full border border-line bg-surface pr-11 pl-12 text-base outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15" />
              {q && (
                <button type="button" onClick={() => set({ q: null })} className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-sand" aria-label="Borrar la búsqueda">
                  <IconX size={17} aria-hidden="true" />
                </button>
              )}
            </div>
            <div>
              <label htmlFor="orden" className="sr-only">
                Ordenar por
              </label>
              <select id="orden" value={sort} onChange={(e) => set({ orden: e.target.value === 'featured' ? null : e.target.value })} className="h-12 rounded-full border border-line bg-surface px-5 text-sm font-bold outline-none focus:border-coral focus:ring-4 focus:ring-coral/15">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden rounded-full bg-surface p-1 ring-1 ring-line sm:flex" role="group" aria-label="Tipo de vista">
              {[
                { id: 'cuadricula', Icon: IconLayoutGrid, label: 'Cuadrícula' },
                { id: 'lista', Icon: IconList, label: 'Lista' },
              ].map(({ id, Icon, label }) => (
                <button key={id} type="button" aria-pressed={view === id} aria-label={label} onClick={() => set({ vista: id === 'lista' ? 'lista' : null })} className={`grid size-10 place-items-center rounded-full transition ${view === id ? 'bg-inv text-inv-fg' : 'text-muted hover:text-fg'}`}>
                  <Icon size={19} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <div role="group" aria-label="Filtrar por objetivo" className="scroll-x -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
            <button type="button" aria-pressed={goal === 'all'} onClick={() => set({ objetivo: null })} className={chip(goal === 'all')}>
              Todas <span className={`rounded-full px-2 text-xs ${goal === 'all' ? 'bg-white/20' : 'bg-sand'}`}>{PRODUCTS.length}</span>
            </button>
            {GOALS.map((g) => {
              const IconG = GOAL_ICONS[g.id];
              return (
                <button key={g.id} type="button" aria-pressed={goal === g.id} onClick={() => set({ objetivo: g.slug })} className={chip(goal === g.id)}>
                  <IconG size={17} aria-hidden="true" /> {g.short}
                  <span className={`rounded-full px-2 text-xs ${goal === g.id ? 'bg-white/20' : 'bg-sand'}`}>{countByGoal(g.id)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section aria-label="Resultados" className="mx-auto mt-10 max-w-6xl px-5">
        <p className="text-sm font-bold text-muted" role="status" aria-live="polite">
          {results.length === 0 ? 'Sin resultados' : `${results.length} ${results.length === 1 ? 'fórmula' : 'fórmulas'}`}
          {q && ` para «${q}»`}
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-[2rem] bg-surface p-12 text-center ring-1 ring-line">
            <p className="text-5xl" aria-hidden="true">🔎</p>
            <h2 className="mt-4 text-3xl font-extrabold">No encontramos nada con esa búsqueda</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">Prueba con otra palabra, quita el filtro de objetivo o escríbenos y te recomendamos una fórmula.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setParams({}, { replace: true })} className={buttonClass('ink')}>
                Ver todas las fórmulas
              </button>
            </div>
          </div>
        ) : view === 'lista' ? (
          <ul className="mt-6 space-y-3">
            {results.map((p) => (
              <li key={p.slug} className={`g-${p.goal} flex flex-wrap items-center gap-5 rounded-[2rem] bg-surface p-4 ring-1 ring-line transition hover:shadow-lg sm:flex-nowrap`}>
                <Link to={`/${productPath(p.slug)}`} className="grad-goal relative block size-28 shrink-0 overflow-hidden rounded-3xl" aria-label={`Ver ${p.name}`}>
                  <ProductImage product={p} width={200} className="absolute inset-0 size-full object-contain p-2" />
                </Link>
                <div className="min-w-0 flex-1">
                  <GoalBadge goal={p.goal} small />
                  <h2 className="mt-2 font-display text-xl leading-tight font-extrabold">
                    <Link to={`/${productPath(p.slug)}`} className="hover:text-coral-deep">
                      {p.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted">{p.headline}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">{p.format || 'Presentación por confirmar'}</p>
                </div>
                <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
                  <PriceTag product={p} />
                  <AddButton product={p} compact />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
