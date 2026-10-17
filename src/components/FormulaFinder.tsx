import { IconArrowLeft, IconArrowRight, IconCheck, IconRefresh } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ProductImage } from './ProductCard';
import { AddButton, GOAL_ICONS, PriceTag, SectionHeading, buttonClass } from './ui';
import { countByGoal, goalOf, GOALS, percentOff, PRODUCTS, productPath, type GoalId, type Product } from '@/lib/products';

type Priority = 'value' | 'budget' | 'picks';
type Step = 'goal' | 'priority' | 'result';

const STEPS: { id: Step; label: string }[] = [
  { id: 'goal', label: 'Tu objetivo' },
  { id: 'priority', label: 'Cómo eliges' },
  { id: 'result', label: 'Tu selección' },
];

const PRIORITIES: { id: Priority; label: string; text: string; emoji: string }[] = [
  { id: 'value', label: 'Mayor ahorro', text: 'Primero las que más bajan frente al precio normal.', emoji: '🏷️' },
  { id: 'budget', label: 'Lo más económico', text: 'De menor a mayor precio; la que aún no tiene precio va al final.', emoji: '💸' },
  { id: 'picks', label: 'Favoritas de la marca', text: 'Las cuatro fórmulas que la marca destaca hoy.', emoji: '⭐' },
];

/** Ordena las fórmulas de un objetivo según cómo elija el visitante; los datos salen del catálogo real. */
export function rank(goal: GoalId, priority: Priority): Product[] {
  const list = PRODUCTS.filter((p) => p.goal === goal);
  const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
  if (priority === 'value') return [...list].sort((a, b) => percentOff(b) - percentOff(a) || price(a) - price(b));
  if (priority === 'budget') return [...list].sort((a, b) => price(a) - price(b));
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || price(a) - price(b));
}

export function FormulaFinder() {
  const [step, setStep] = useState<Step>('goal');
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);

  const matches = useMemo(() => (goal && priority ? rank(goal, priority) : []), [goal, priority]);
  const shown = matches.slice(0, 3);
  const current = STEPS.findIndex((s) => s.id === step);
  const reset = () => {
    setStep('goal');
    setGoal(null);
    setPriority(null);
  };

  return (
    <section id="buscador" aria-labelledby="buscador-title" className="mx-auto mt-28 max-w-6xl px-5">
      <div className="grain relative overflow-hidden rounded-[2.5rem] bg-ink-2 px-6 py-12 text-white sm:px-12 sm:py-14">
        <div className="animate-drift pointer-events-none absolute -top-24 -right-20 size-96 rounded-full bg-rose/30 blur-3xl" aria-hidden="true" />
        <div className="animate-drift pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-lagoon/25 blur-3xl [animation-delay:-6s]" aria-hidden="true" />
        <div className="relative">
          <SectionHeading as="h2" light eyebrow="Buscador de fórmulas" title={<span id="buscador-title">Tres respuestas, una selección para ti</span>} lead="Dinos qué quieres apoyar y cómo prefieres elegir. Te mostramos las fórmulas de la línea que encajan: sin cuentas ni compras." />

          <div className="mt-9 flex items-center gap-3" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={current + 1} aria-label={`Paso ${current + 1} de 3: ${STEPS[current].label}`}>
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold transition ${i < current ? 'bg-wa text-night' : i === current ? 'grad-sun text-night' : 'bg-white/10 text-white/45'}`}>{i < current ? <IconCheck size={18} stroke={3} aria-hidden="true" /> : i + 1}</span>
                <span className={`hidden text-sm font-bold sm:block ${i === current ? 'text-white' : 'text-white/45'}`}>{s.label}</span>
                {i < STEPS.length - 1 && <span className={`h-0.5 flex-1 rounded-full transition ${i < current ? 'bg-wa' : 'bg-white/15'}`} aria-hidden="true" />}
              </div>
            ))}
          </div>

          <div key={step} className="mt-8 min-h-[20rem] [animation:sheet-up_0.4s_both]">
            {step === 'goal' && (
              <div role="group" aria-label="Elige tu objetivo">
                <p className="text-xl font-bold">¿Qué quieres apoyar?</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {GOALS.map((g) => {
                    const IconG = GOAL_ICONS[g.id];
                    return (
                      <li key={g.id} className={`g-${g.id}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setGoal(g.id);
                            setStep('priority');
                          }}
                          className="group flex h-full w-full items-center gap-4 rounded-3xl bg-white/[0.07] p-4 text-left ring-1 ring-white/15 transition hover:-translate-y-1 hover:bg-white/15 hover:ring-white/40"
                        >
                          <span className="grad-goal grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg transition group-hover:rotate-6 group-hover:scale-110">
                            <IconG size={28} aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block font-display text-lg leading-tight font-extrabold">{g.wish}</span>
                            <span className="mt-1 block text-sm text-white/60">{countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'fórmula' : 'fórmulas'}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {step === 'priority' && goal && (
              <div role="group" aria-label="Elige cómo prefieres decidir">
                <p className="text-xl font-bold">
                  Para «{goalOf(goal).label.toLowerCase()}», ¿cómo prefieres elegir?
                </p>
                <ul className="mt-5 grid gap-3 md:grid-cols-3">
                  {PRIORITIES.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPriority(p.id);
                          setStep('result');
                        }}
                        className="h-full w-full rounded-3xl bg-white/[0.07] p-6 text-left ring-1 ring-white/15 transition hover:-translate-y-1 hover:bg-white/15 hover:ring-white/40"
                      >
                        <span className="text-3xl" aria-hidden="true">{p.emoji}</span>
                        <span className="mt-3 block font-display text-xl font-extrabold">{p.label}</span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-white/65">{p.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setStep('goal')} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-sun">
                  <IconArrowLeft size={17} aria-hidden="true" /> Cambiar objetivo
                </button>
              </div>
            )}

            {step === 'result' && goal && priority && (
              <div>
                <p className="text-xl font-bold" aria-live="polite">
                  {shown.length === 1 ? 'Esta es la fórmula que encaja' : `Tus ${shown.length} fórmulas`} para «{goalOf(goal).label.toLowerCase()}»
                </p>
                <ol className="mt-5 grid gap-4 md:grid-cols-3">
                  {shown.map((p, i) => (
                    <li key={p.slug} className={`g-${p.goal} flex flex-col overflow-hidden rounded-3xl bg-surface text-fg`}>
                      <Link to={`/${productPath(p.slug)}`} className="grad-goal relative block h-52 overflow-hidden" aria-label={`Ver ${p.name}`}>
                        <span className="absolute top-3 left-3 grid size-9 place-items-center rounded-full bg-paper font-display font-extrabold text-night shadow-md">{i + 1}</span>
                        <ProductImage product={p} width={240} className="absolute inset-0 size-full object-contain p-3" />
                      </Link>
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <h3 className="font-display text-lg leading-tight font-extrabold">{p.name}</h3>
                        <p className="text-sm text-muted">{p.tagline}</p>
                        <div className="mt-auto pt-1">
                          <PriceTag product={p} />
                        </div>
                        <AddButton product={p} compact />
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link to={`/catalogo?objetivo=${goalOf(goal).slug}`} className={buttonClass('sun')}>
                    Ver todo «{goalOf(goal).short}» <IconArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <button type="button" onClick={reset} className={buttonClass('ghost-light')}>
                    <IconRefresh size={18} aria-hidden="true" /> Empezar de nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
