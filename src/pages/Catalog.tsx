import { IconLayoutGrid, IconList, IconSearch, IconX } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { AddButton, buttonClass, d, GOAL_ICONS, GoalBadge, PriceTag } from '@/components/ui';
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

  const chip = (active: boolean) => `inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[0.85rem] font-medium transition-colors ${active ? 'bg-night text-white' : 'border border-line-strong bg-surface text-muted hover:border-fg hover:text-fg'}`;

  return (
    <>
      <header className="border-b border-line bg-sand">
        <div className="wrap py-12 sm:py-16">
          <p className="eyebrow">Catálogo</p>
          <h1 className="mt-2.5 text-[2rem] leading-[1.12] font-medium sm:text-[2.6rem]">{current ? current.label : 'Todas las fórmulas'}</h1>
          <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-muted">
            {current ? current.blurb : `${PRODUCTS.length} fórmulas en cápsulas vegetarianas. Filtra por objetivo, busca por ingrediente y agrega al pedido lo que te guste.`}
          </p>
        </div>
      </header>

      {/* Barra de filtros pegajosa, pegada debajo de la cabecera (64 px + la cinta de arriba en escritorio). */}
      <div className="sticky top-16 z-30 border-b border-line bg-canvas/98 backdrop-blur-[2px] sm:top-[6.2rem]">
        <div className="wrap py-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[13rem] flex-1">
              <label htmlFor="buscar" className="sr-only">
                Buscar por nombre, ingrediente o beneficio
              </label>
              <IconSearch size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input id="buscar" type="search" value={q} onChange={(e) => set({ q: e.target.value || null })} placeholder="Busca: magnesio, maca, sueño…" className="field pl-10" />
              {q && (
                <button type="button" onClick={() => set({ q: null })} className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-fg" aria-label="Borrar la búsqueda">
                  <IconX size={15} aria-hidden="true" />
                </button>
              )}
            </div>
            <div>
              <label htmlFor="orden" className="sr-only">
                Ordenar por
              </label>
              <select id="orden" value={sort} onChange={(e) => set({ orden: e.target.value === 'featured' ? null : e.target.value })} className="field h-11 w-auto pr-3 text-[0.85rem]">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden rounded-full border border-line-strong bg-surface p-0.5 sm:flex" role="group" aria-label="Tipo de vista">
              {[
                { id: 'cuadricula', Icon: IconLayoutGrid, label: 'Cuadrícula' },
                { id: 'lista', Icon: IconList, label: 'Lista' },
              ].map(({ id, Icon, label }) => (
                <button key={id} type="button" aria-pressed={view === id} aria-label={label} onClick={() => set({ vista: id === 'lista' ? 'lista' : null })} className={`grid size-9 place-items-center rounded-full transition-colors ${view === id ? 'bg-night text-white' : 'text-muted hover:text-fg'}`}>
                  <Icon size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <div role="group" aria-label="Filtrar por objetivo" className="scroll-x -mx-1 mt-2.5 flex gap-2 overflow-x-auto px-1 pb-1">
            <button type="button" aria-pressed={goal === 'all'} onClick={() => set({ objetivo: null })} className={chip(goal === 'all')}>
              Todas <span className={`rounded-full px-1.5 text-[0.75rem] ${goal === 'all' ? 'bg-white/20' : 'bg-sand'}`}>{PRODUCTS.length}</span>
            </button>
            {GOALS.map((g) => {
              const IconG = GOAL_ICONS[g.id];
              return (
                <button key={g.id} type="button" aria-pressed={goal === g.id} onClick={() => set({ objetivo: g.slug })} className={chip(goal === g.id)}>
                  <IconG size={15} stroke={1.9} aria-hidden="true" /> {g.short}
                  <span className={`rounded-full px-1.5 text-[0.75rem] ${goal === g.id ? 'bg-white/20' : 'bg-sand'}`}>{countByGoal(g.id)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section aria-label="Resultados" className="wrap py-10">
        <p className="text-[0.85rem] font-medium text-muted" role="status" aria-live="polite">
          {results.length === 0 ? 'Sin resultados' : `${results.length} ${results.length === 1 ? 'fórmula' : 'fórmulas'}`}
          {q && ` para «${q}»`}
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-10 text-center">
            <h2 className="font-display text-[1.4rem] font-medium">No encontramos nada con esa búsqueda</h2>
            <p className="mx-auto mt-2 max-w-md text-[0.95rem] text-muted">Prueba con otra palabra, quita el filtro de objetivo o escríbenos y te recomendamos una fórmula.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <button type="button" onClick={() => setParams({}, { replace: true })} className={buttonClass('night')}>
                Ver todas las fórmulas
              </button>
            </div>
          </div>
        ) : view === 'lista' ? (
          <ul className="mt-5 space-y-2.5">
            {results.map((p) => (
              <li key={p.slug} className={`g-${p.goal} card flex flex-wrap items-center gap-4 p-3 transition-shadow hover:shadow-[0_10px_24px_-14px_rgb(35_35_31/0.22)] sm:flex-nowrap`}>
                <Link to={`/${productPath(p.slug)}`} className="goal-block relative block size-24 shrink-0 overflow-hidden rounded-xl" aria-label={`Ver ${p.name}`}>
                  <ProductImage product={p} width={200} className="absolute inset-0 size-full object-contain p-2" />
                </Link>
                <div className="min-w-0 flex-1">
                  <GoalBadge goal={p.goal} small />
                  <h2 className="mt-1.5 font-display text-[1.05rem] leading-snug font-medium">
                    <Link to={`/${productPath(p.slug)}`} className="transition-colors hover:text-accent">
                      {p.name}
                    </Link>
                  </h2>
                  <p className="mt-0.5 text-[0.88rem] text-muted">{p.headline}</p>
                  <p className="mt-0.5 text-[0.78rem] text-muted">{p.format || 'Presentación por confirmar'}</p>
                </div>
                <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
                  <PriceTag product={p} />
                  <AddButton product={p} compact variant="night" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p, i) => (
              <li key={p.slug} className="rise" style={d(Math.min(i, 8) * 55)}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
