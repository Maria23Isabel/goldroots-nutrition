import { IconArrowLeft, IconArrowRight, IconRefresh, IconTag } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { buttonClass, SectionHeading } from './ui';
import { asset, countByGoal, goalOf, GOALS, money, percentOff, PRODUCTS, savings, type GoalId, type Product } from '@/lib/products';

type Priority = 'value' | 'budget' | 'picks';
type Step = 'goal' | 'priority' | 'result';

const STEPS: { id: Step; label: string }[] = [
  { id: 'goal', label: 'Your goal' },
  { id: 'priority', label: 'How you choose' },
  { id: 'result', label: 'Your shortlist' },
];

const PRIORITIES: { id: Priority; label: string; text: string }[] = [
  { id: 'value', label: 'Biggest saving', text: 'Order by the discount on the regular price.' },
  { id: 'budget', label: 'Lowest price', text: 'Cheapest formula first; the one still unpriced goes last.' },
  { id: 'picks', label: 'Brand picks', text: 'The four formulas the brand highlights today.' },
];

/** Ordena las fórmulas de un objetivo según cómo elija el visitante; los datos salen del catálogo real. */
function rank(goal: GoalId, priority: Priority): Product[] {
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
    <section id="finder" aria-labelledby="finder-title" className="mx-auto mt-24 max-w-7xl px-5">
      <div className="grain relative overflow-hidden rounded-[2.5rem] bg-forest px-6 py-12 text-white sm:px-12">
        <div className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <SectionHeading as="h3" light eyebrow="Find your formula" title="Three answers, one shortlist" lead="Tell us what you want to support and how you like to choose. We show the formulas from the line that fit — no account, no cart." />

          <ol className="mt-9 flex flex-wrap gap-2" aria-label="Steps">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                aria-current={step === s.id ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[0.18em] uppercase transition ${
                  i < current ? 'border-white/25 text-white/60' : i === current ? 'border-gold bg-gold text-forest' : 'border-white/25 text-white/40'
                }`}
              >
                <span aria-hidden="true">{i + 1}</span> {s.label}
              </li>
            ))}
          </ol>

          <div key={step} className="animate-rise mt-8 min-h-[19rem]">
            {step === 'goal' && (
              <div role="group" aria-labelledby="finder-title">
                <p className="text-lg text-white/80">What do you want to work on?</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {GOALS.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setGoal(g.id);
                          setStep('priority');
                        }}
                        className="h-full w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition hover:border-gold hover:bg-white/10 focus-visible:bg-white/10"
                      >
                        <span className="block font-serif text-xl">{g.label}</span>
                        <span className="mt-1 block text-sm text-white/60">{g.blurb}</span>
                        <span className="mt-3 block text-xs font-bold tracking-[0.18em] text-gold uppercase">
                          {countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'formula' : 'formulas'}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 'priority' && goal && (
              <div role="group" aria-label="How you want to choose">
                <p className="text-lg text-white/80">
                  For <span className="font-serif text-gold">{goalOf(goal).label}</span>, how do you want to pick?
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                  {PRIORITIES.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPriority(p.id);
                          setStep('result');
                        }}
                        className="h-full w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition hover:border-gold hover:bg-white/10 focus-visible:bg-white/10"
                      >
                        <span className="block font-bold tracking-wide uppercase">{p.label}</span>
                        <span className="mt-2 block text-sm leading-relaxed text-white/60">{p.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setStep('goal')} className="mt-7 inline-flex items-center gap-2 text-sm font-bold tracking-wider text-white/70 uppercase hover:text-gold">
                  <IconArrowLeft size={18} aria-hidden="true" /> Back to goals
                </button>
              </div>
            )}

            {step === 'result' && goal && priority && (
              <div>
                <p aria-live="polite" className="text-lg text-white/80">
                  {shown.length} {shown.length === 1 ? 'formula' : 'formulas'} for {goalOf(goal).label} ·{' '}
                  <span className="text-gold">{PRIORITIES.find((p) => p.id === priority)!.label.toLowerCase()}</span>
                </p>
                <ul className="mt-5 grid gap-3 lg:grid-cols-3">
                  {shown.map((p) => (
                    <li key={p.slug}>
                      <Link to={`/product/${p.slug}`} className="flex h-full gap-4 rounded-2xl bg-white p-4 text-ink transition hover:-translate-y-1 hover:shadow-2xl">
                        <img src={asset(p.image!)} alt="" loading="lazy" decoding="async" className="size-24 shrink-0 rounded-xl bg-sand/60 object-contain" />
                        <span className="min-w-0">
                          <span className="block font-bold tracking-wide text-forest uppercase">{p.name}</span>
                          <span className="mt-1 block line-clamp-2 text-sm text-muted">{p.benefits[0]}</span>
                          <span className="mt-2 flex flex-wrap items-baseline gap-2">
                            <span className="font-serif text-xl text-forest">{p.price != null ? money(p.price) : 'Coming soon'}</span>
                            {p.compareAt != null && p.price != null && (
                              <span className="text-sm text-muted line-through">{money(p.compareAt)}</span>
                            )}
                            {percentOff(p) > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-bold tracking-wider text-gold-deep uppercase">
                                <IconTag size={12} aria-hidden="true" /> Save {money(savings(p))}
                              </span>
                            )}
                          </span>
                          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] text-gold-deep uppercase">
                            Open the formula <IconArrowRight size={15} aria-hidden="true" />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to={`/catalog?goal=${goal}`} className={buttonClass('gold')}>
                    See all for {goalOf(goal).short} <IconArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <button type="button" onClick={() => setStep('priority')} className={buttonClass('ghost-light')}>
                    <IconArrowLeft size={18} aria-hidden="true" /> Change how I choose
                  </button>
                  <button type="button" onClick={reset} className={buttonClass('ghost-light')}>
                    <IconRefresh size={18} aria-hidden="true" /> Start over
                  </button>
                </div>
                <p className="mt-5 text-sm text-white/50">This page shows the line; it holds no cart and takes no payment. Open a formula and use “Ask about this formula” to reach the brand.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
