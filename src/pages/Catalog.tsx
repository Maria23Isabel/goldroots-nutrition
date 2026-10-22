import { IconArrowRight, IconLayoutGrid, IconList, IconSearch, IconX } from '@tabler/icons-react';
import * as m from 'motion/react-m';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { buttonClass, d, GOAL_ICONS, GoalBadge, Reveal } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { LayoutMotion } from '@/lib/motion';
import { asset, countByGoal, goalBySlug, GOALS, PRODUCTS, productPath, searchProducts, type GoalId, type SortId } from '@/lib/products';

const SORTS: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Selección de la marca' },
  { id: 'name', label: 'Nombre (A–Z)' },
];

export function Catalog() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const goal: GoalId | 'all' = goalBySlug(params.get('objetivo'))?.id ?? 'all';
  const sort = (SORTS.find((item) => item.id === params.get('orden'))?.id ?? 'featured') as SortId;
  const view = params.get('vista') === 'lista' ? 'lista' : 'cuadricula';

  const set = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => searchProducts(query, goal, sort), [query, goal, sort]);
  const current = goal === 'all' ? null : GOALS.find((item) => item.id === goal)!;

  usePageMeta({
    title: `${current ? current.label : 'Catálogo'} — Gold Roots Nutrition`,
    description: current ? `${current.blurb}. Conoce las fórmulas de Gold Roots Nutrition relacionadas con ${current.label.toLowerCase()}.` : `Explora las ${PRODUCTS.length} fórmulas de Gold Roots Nutrition por nombre, ingrediente u objetivo.`,
    path: '/catalogo',
  });

  /* La pastilla oscura del filtro activo es un solo nodo que viaja de una categoría a otra: al cambiar de objetivo
     no aparece y desaparece un fondo, se mueve. El rótulo va por encima porque también está posicionado. */
  const chip = (active: boolean) => `relative inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[0.84rem] font-semibold transition-colors ${active ? 'text-white' : 'border border-line-strong bg-surface text-muted hover:border-night hover:text-night'}`;
  const pill = <m.span layoutId="chip-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" className="absolute inset-0 rounded-full bg-night" />;

  return (
    <LayoutMotion>
      <header className="catalog-hero border-b border-line">
        <div className="wrap py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:gap-16">
            <div className="max-w-3xl">
              <p className="eyebrow rise text-accent-deep">Catálogo informativo</p>
              <h1 className="rise mt-4 text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.95] tracking-[-0.045em]" style={d(70)}>{current ? current.label : 'La línea, fórmula por fórmula.'}</h1>
              <p className="rise mt-6 text-[1.05rem] leading-relaxed text-muted" style={d(140)}>{current ? current.blurb : `${PRODUCTS.length} fórmulas para explorar por objetivo, nombre o ingrediente. Sin precios ni decisiones apresuradas: primero, la información.`}</p>
            </div>
            {/* Índice editorial: aprovecha el margen derecho del encabezado y permite saltar de un
                territorio a otro sin volver a la lista de chips. Son enlaces, no tarjetas. */}
            <nav aria-label="Índice por objetivo" className="rise lg:pb-2" style={d(200)}>
              <p className="eyebrow text-accent-deep">Territorios</p>
              <ul className="mt-4 border-t border-line">
                {GOALS.map((item) => (
                  <li key={item.id} className="border-b border-line">
                    <Link to={`/catalogo?objetivo=${item.slug}`} aria-current={goal === item.id ? 'page' : undefined} className={`group flex items-baseline gap-4 py-2 text-[0.89rem] font-semibold transition-colors hover:text-accent-deep ${goal === item.id ? 'text-accent-deep' : 'text-fg'}`}>
                      <span className="flex-1">{item.short}</span>
                      <span className="text-[0.76rem] font-medium tabular-nums text-muted group-hover:text-accent-deep">{countByGoal(item.id)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* Sin filtro puesto, la colección entera se presenta con la fotografía oficial de los frascos
              alineados. Esta escena trae fondo gris de estudio, así que va en panel redondeado: sobre el crema,
              el multiply la dejaría como un rectángulo cortado en seco. */}
          {!current && (
            <Reveal kind="mask" className="mt-10 sm:mt-12">
              <div className="mx-auto max-w-[84rem] overflow-hidden rounded-[2rem]">
                <img src={asset('brand/lineup.webp')} srcSet={`${asset('brand/lineup-900.webp')} 900w, ${asset('brand/lineup.webp')} 1600w`} sizes="(max-width: 1280px) 92vw, 84rem" width="1600" height="914" loading="lazy" decoding="async" alt="Los frascos de la línea Gold Roots alineados bajo su logotipo" className="block h-auto w-full" />
              </div>
            </Reveal>
          )}
        </div>
      </header>

      <div className="sticky top-[4.75rem] z-30 border-b border-line bg-canvas/94 backdrop-blur-lg">
        <div className="wrap py-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[15rem] flex-1">
              <label htmlFor="buscar" className="sr-only">Buscar por nombre, ingrediente o beneficio</label>
              <IconSearch size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input id="buscar" type="search" value={query} onChange={(event) => set({ q: event.target.value || null })} placeholder="Busca: magnesio, maca, sueño…" className="field pl-10" />
              {query && <button type="button" onClick={() => set({ q: null })} className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-sand hover:text-night" aria-label="Borrar la búsqueda"><IconX size={15} aria-hidden="true" /></button>}
            </div>
            <select aria-label="Ordenar fórmulas" value={sort} onChange={(event) => set({ orden: event.target.value === 'featured' ? null : event.target.value })} className="field h-11 w-auto pr-8 text-[0.84rem]">{SORTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
            <div className="hidden rounded-full border border-line-strong bg-surface p-0.5 sm:flex" role="group" aria-label="Tipo de vista">
              {[{ id: 'cuadricula', Icon: IconLayoutGrid, label: 'Cuadrícula' }, { id: 'lista', Icon: IconList, label: 'Lista' }].map(({ id, Icon, label }) => <button key={id} type="button" aria-pressed={view === id} aria-label={label} onClick={() => set({ vista: id === 'lista' ? 'lista' : null })} className={`grid size-9 place-items-center rounded-full ${view === id ? 'bg-night text-white' : 'text-muted hover:text-night'}`}><Icon size={17} aria-hidden="true" /></button>)}
            </div>
          </div>
          <div role="group" aria-label="Filtrar por objetivo" className="scroll-x -mx-1 mt-2.5 flex gap-2 overflow-x-auto px-1 pb-1">
            <button type="button" aria-pressed={goal === 'all'} onClick={() => set({ objetivo: null })} className={chip(goal === 'all')}>{goal === 'all' && pill}<span className="relative">Todas</span> <span className="relative opacity-70">{PRODUCTS.length}</span></button>
            {GOALS.map((item) => {
              const GoalIcon = GOAL_ICONS[item.id];
              return <button key={item.id} type="button" aria-pressed={goal === item.id} onClick={() => set({ objetivo: item.slug })} className={chip(goal === item.id)}>{goal === item.id && pill}<GoalIcon size={15} className="relative" aria-hidden="true" /><span className="relative">{item.short}</span><span className="relative opacity-70">{countByGoal(item.id)}</span></button>;
            })}
          </div>
        </div>
      </div>

      <section aria-label="Resultados" className="wrap py-10 sm:py-14">
        <p className="text-[0.84rem] font-medium text-muted" role="status" aria-live="polite">{results.length === 0 ? 'Sin resultados' : `${results.length} ${results.length === 1 ? 'fórmula' : 'fórmulas'}`}{query && ` para «${query}»`}</p>
        {results.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-line bg-surface p-10 text-center"><h2 className="text-[1.5rem]">No encontramos esa búsqueda</h2><p className="mx-auto mt-3 max-w-md text-[0.94rem] text-muted">Prueba con otro ingrediente o revisa la colección completa.</p><button type="button" onClick={() => setParams({}, { replace: true })} className={buttonClass('night', 'mt-6')}>Ver todas las fórmulas</button></div>
        ) : view === 'lista' ? (
          <ul className="mt-6 space-y-3">{results.map((product) => <li key={product.slug} className={`g-${product.goal} card flex items-center gap-5 p-3 sm:p-4`}><Link to={`/${productPath(product.slug)}`} className="goal-block grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl sm:size-28"><ProductImage product={product} width={220} className="h-full w-full object-contain p-2" /></Link><div className="min-w-0 flex-1"><GoalBadge goal={product.goal} small /><h2 className="mt-2 text-[1.08rem]"><Link to={`/${productPath(product.slug)}`} className="hover:text-accent-deep">{product.name}</Link></h2><p className="mt-1 line-clamp-2 text-[0.87rem] text-muted">{product.tagline}</p></div><Link to={`/${productPath(product.slug)}`} className="hidden items-center gap-2 pr-4 text-[0.82rem] font-semibold sm:flex">Ver ficha <IconArrowRight size={15} aria-hidden="true" /></Link></li>)}</ul>
        ) : (
          <ul key={`${goal}-${query}-${sort}`} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{results.map((product, index) => <li key={product.slug}><Reveal kind={index % 2 === 0 ? 'rise' : 'scale'} delay={(index % 4) * 70} className="h-full"><ProductCard product={product} /></Reveal></li>)}</ul>
        )}
      </section>
    </LayoutMotion>
  );
}
