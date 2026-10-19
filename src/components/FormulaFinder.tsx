import { IconArrowLeft, IconArrowRight, IconCheck, IconCoins, IconRefresh, IconStar, IconTag, type Icon } from '@tabler/icons-react';
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

const PRIORITIES: { id: Priority; label: string; text: string; Icon: Icon }[] = [
  { id: 'value', label: 'Mayor ahorro', text: 'Primero las que más bajan frente al precio normal.', Icon: IconTag },
  { id: 'budget', label: 'Lo más económico', text: 'De menor a mayor precio; la que aún no tiene precio va al final.', Icon: IconCoins },
  { id: 'picks', label: 'Favoritas de la marca', text: `Las ${PRODUCTS.filter((p) => p.featured).length} fórmulas que la marca destaca hoy.`, Icon: IconStar },
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
    <section id="buscador" aria-labelledby="buscador-title" className="wrap section">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-10">
        <SectionHeading as="h2" eyebrow="Buscador de fórmulas" title={<span id="buscador-title">Tres respuestas, una selección para ti</span>} lead="Dinos qué quieres apoyar y cómo prefieres elegir. Te mostramos las fórmulas de la línea que encajan: sin cuentas ni compras." />

        <div className="mt-8 flex items-center gap-3" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={current + 1} aria-label={`Paso ${current + 1} de 3: ${STEPS[current].label}`}>
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[0.8rem] font-semibold transition-colors ${i < current ? 'bg-wa text-white' : i === current ? 'bg-night text-white' : 'bg-sand text-muted ring-1 ring-line'}`}>
                {i < current ? <IconCheck size={15} stroke={2.6} aria-hidden="true" /> : i + 1}
              </span>
              <span className={`hidden text-[0.85rem] font-medium sm:block ${i === current ? 'text-fg' : 'text-muted'}`}>{s.label}</span>
              {i < STEPS.length - 1 && <span className={`h-px flex-1 transition-colors ${i < current ? 'bg-wa' : 'bg-line'}`} aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div key={step} className="mt-8 min-h-[19rem] [animation:fade-in_0.3s_both]">
          {step === 'goal' && (
            <div role="group" aria-label="Elige tu objetivo">
              <p className="font-display text-[1.15rem] font-medium">¿Qué quieres apoyar?</p>
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
                        className="flex h-full w-full items-center gap-4 rounded-xl border border-line bg-canvas p-4 text-left transition-colors hover:border-fg hover:bg-sand"
                      >
                        <span className="goal-block text-goal grid size-11 shrink-0 place-items-center rounded-lg">
                          <IconG size={21} stroke={1.9} aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block font-display text-[1rem] leading-snug font-medium">{g.wish}</span>
                          <span className="mt-0.5 block text-[0.82rem] text-muted">
                            {countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'fórmula' : 'fórmulas'}
                          </span>
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
              <p className="font-display text-[1.15rem] font-medium">Para «{goalOf(goal).label.toLowerCase()}», ¿cómo prefieres elegir?</p>
              <ul className="mt-5 grid gap-3 md:grid-cols-3">
                {PRIORITIES.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setPriority(p.id);
                        setStep('result');
                      }}
                      className="h-full w-full rounded-xl border border-line bg-canvas p-5 text-left transition-colors hover:border-fg hover:bg-sand"
                    >
                      <p.Icon size={20} stroke={1.8} aria-hidden="true" className="text-muted" />
                      <span className="mt-3 block font-display text-[1.05rem] font-medium">{p.label}</span>
                      <span className="mt-1 block text-[0.85rem] leading-relaxed text-muted">{p.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => setStep('goal')} className="mt-5 inline-flex items-center gap-2 text-[0.85rem] font-medium text-muted transition-colors hover:text-fg">
                <IconArrowLeft size={16} aria-hidden="true" /> Cambiar objetivo
              </button>
            </div>
          )}

          {step === 'result' && goal && priority && (
            <div>
              <p className="font-display text-[1.15rem] font-medium" aria-live="polite">
                {shown.length === 1 ? 'Esta es la fórmula que encaja' : `Tus ${shown.length} fórmulas`} para «{goalOf(goal).label.toLowerCase()}»
              </p>
              <ol className="mt-5 grid gap-4 md:grid-cols-3">
                {shown.map((p, i) => (
                  <li key={p.slug} className={`g-${p.goal} flex flex-col overflow-hidden rounded-xl border border-line`}>
                    <Link to={`/${productPath(p.slug)}`} className="goal-block relative block h-44 overflow-hidden" aria-label={`Ver ${p.name}`}>
                      <span className="absolute top-3 left-3 grid size-7 place-items-center rounded-full bg-surface text-[0.8rem] font-semibold text-fg shadow-sm">{i + 1}</span>
                      <ProductImage product={p} width={240} className="absolute inset-0 size-full object-contain p-3" />
                    </Link>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h3 className="font-display text-[1rem] leading-snug font-medium">{p.name}</h3>
                      <p className="text-[0.85rem] leading-snug text-muted">{p.tagline}</p>
                      <div className="mt-auto pt-2">
                        <PriceTag product={p} />
                      </div>
                      <AddButton product={p} compact variant="night" className="mt-1 w-full" />
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link to={`/catalogo?objetivo=${goalOf(goal).slug}`} className={buttonClass('primary')}>
                  Ver todo «{goalOf(goal).short}» <IconArrowRight size={16} aria-hidden="true" />
                </Link>
                <button type="button" onClick={reset} className={buttonClass('outline')}>
                  <IconRefresh size={16} aria-hidden="true" /> Empezar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
