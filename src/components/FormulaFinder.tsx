import { IconArrowRight } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ProductImage } from './ProductCard';
import { GOAL_ICONS, SectionHeading, buttonClass } from './ui';
import { countByGoal, goalOf, GOALS, productPath, type GoalId } from '@/lib/products';
import { rank } from '@/lib/showcase';

export function FormulaFinder() {
  const [goal, setGoal] = useState<GoalId>('energy');
  const matches = useMemo(() => rank(goal), [goal]);

  return (
    <section aria-labelledby="explorador-title" className="wrap section">
      <SectionHeading eyebrow="Explorador" title={<span id="explorador-title">Empieza por lo que quieres conocer</span>} lead="Selecciona un objetivo y revisa las fórmulas relacionadas. La elección final debe considerar la etiqueta y la orientación de un profesional de la salud." />
      <div className="scroll-x -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0" role="group" aria-label="Elegir objetivo">
        {GOALS.map((item) => {
          const GoalIcon = GOAL_ICONS[item.id];
          return <button key={item.id} type="button" aria-pressed={goal === item.id} onClick={() => setGoal(item.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[0.84rem] font-semibold transition-colors ${goal === item.id ? 'bg-night text-white' : 'border border-line-strong bg-surface text-muted hover:border-night hover:text-night'}`}><GoalIcon size={16} aria-hidden="true" />{item.short}</button>;
        })}
      </div>
      <div className="mt-5 overflow-hidden rounded-3xl border border-line bg-surface">
        <div className={`g-${goal} goal-block p-6 sm:p-8`}>
          <p className="eyebrow text-goal">{countByGoal(goal)} {countByGoal(goal) === 1 ? 'fórmula' : 'fórmulas'}</p>
          <h3 className="mt-2 text-[1.5rem] sm:text-[2rem]">{goalOf(goal).label}</h3>
          <p className="mt-2 max-w-xl text-[0.92rem] leading-relaxed text-muted">{goalOf(goal).blurb}.</p>
        </div>
        <ul key={goal} className="grid gap-px bg-line md:grid-cols-3">
          {matches.slice(0, 3).map((product) => (
            <li key={product.slug} className="group bg-surface p-5">
              <Link to={`/${productPath(product.slug)}`} className="block">
                <div className={`g-${product.goal} goal-block grid h-44 place-items-center overflow-hidden rounded-2xl`}><ProductImage product={product} width={250} className="h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105" /></div>
                <p className="mt-4 font-display text-[1rem] font-medium">{product.name}</p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">{product.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link to={`/catalogo?objetivo=${goalOf(goal).slug}`} className={buttonClass('outline', 'mt-6')}>Ver todas en {goalOf(goal).short.toLowerCase()} <IconArrowRight size={16} aria-hidden="true" /></Link>
    </section>
  );
}
