import {
  IconBolt,
  IconBrain,
  IconBrandWhatsapp,
  IconCheck,
  IconChevronDown,
  IconEye,
  IconHeartbeat,
  IconMinus,
  IconMoon,
  IconPlus,
  IconShieldCheck,
  IconShoppingBagPlus,
  IconLeaf,
  type Icon,
} from '@tabler/icons-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { MAX_QTY, orderActions } from '@/lib/order';
import { goalOf, money, percentOff, type GoalId, type Product } from '@/lib/products';
import { waLink } from '@/lib/whatsapp';

export const GOAL_ICONS: Record<GoalId, Icon> = {
  energy: IconBolt,
  heart: IconHeartbeat,
  brain: IconBrain,
  sleep: IconMoon,
  'eye-skin': IconEye,
  immune: IconShieldCheck,
};

/** Aparece suavemente al entrar en pantalla; respeta «reducir movimiento» con la media query de styles.css. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return void el.classList.add('in');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" aria-label="Gold Roots Nutrition, inicio" className="inline-flex items-center gap-2.5 whitespace-nowrap">
      <span className="grad-sun grid size-10 place-items-center rounded-2xl text-night shadow-lg shadow-coral/30">
        <IconLeaf size={22} stroke={2.2} aria-hidden="true" />
      </span>
      <span className={`font-display text-xl leading-none font-extrabold tracking-tight ${light ? 'text-white' : 'text-fg'}`}>
        Gold<span className="text-grad">Roots</span>
      </span>
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, lead, center = false, light = false, as = 'h2' }: { eyebrow: string; title: ReactNode; lead?: string; center?: boolean; light?: boolean; as?: 'h2' | 'h3' }) {
  const Heading = as;
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`eyebrow ${light ? '!text-sun' : ''}`}>{eyebrow}</p>
      <Heading className={`mt-3 text-4xl leading-[1.05] font-extrabold sm:text-5xl ${light ? 'text-white' : 'text-fg'}`}>{title}</Heading>
      {lead && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/75' : 'text-muted'}`}>{lead}</p>}
    </div>
  );
}

type Variant = 'sun' | 'ink' | 'outline' | 'light' | 'wa' | 'ghost-light';
const VARIANTS: Record<Variant, string> = {
  sun: 'grad-sun text-night shadow-lg shadow-coral/25 hover:brightness-105 hover:shadow-xl hover:shadow-coral/35',
  ink: 'bg-inv text-inv-fg hover:opacity-85',
  outline: 'border-2 border-fg/15 text-fg hover:border-fg hover:bg-inv hover:text-inv-fg',
  light: 'bg-paper text-night hover:bg-sun',
  wa: 'bg-wa text-night shadow-lg shadow-wa/30 hover:brightness-105',
  'ghost-light': 'border-2 border-white/25 text-white hover:bg-white hover:text-night',
};

export const buttonClass = (variant: Variant = 'sun', extra = '') =>
  `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 whitespace-nowrap text-[0.95rem] font-bold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${extra}`;

export function WhatsAppButton({ text, children, variant = 'wa', className = '' }: { text: string; children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)}>
      <IconBrandWhatsapp size={21} aria-hidden="true" />
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}

export function GoalBadge({ goal, small = false }: { goal: GoalId; small?: boolean }) {
  const g = goalOf(goal);
  const IconG = GOAL_ICONS[goal];
  return (
    <span className={`g-${goal} soft-goal text-goal inline-flex items-center gap-1.5 rounded-full font-bold ${small ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}>
      <IconG size={small ? 14 : 17} stroke={2.4} aria-hidden="true" />
      {g.short}
    </span>
  );
}

export function PriceTag({ product, big = false }: { product: Product; big?: boolean }) {
  if (product.price == null) {
    return <span className={`font-display font-bold text-muted ${big ? 'text-2xl' : 'text-base'}`}>Consultar precio</span>;
  }
  const off = percentOff(product);
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={`font-display font-extrabold text-fg ${big ? 'text-4xl' : 'text-xl'}`}>{money(product.price)}</span>
      {product.compareAt != null && (
        <>
          <s className={`text-muted ${big ? 'text-lg' : 'text-sm'}`} aria-label={`Precio normal ${money(product.compareAt)}`}>
            {money(product.compareAt)}
          </s>
          <span className={`grad-sun rounded-full font-extrabold text-night ${big ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`}>−{off}%</span>
        </>
      )}
    </span>
  );
}

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const btn = 'grid size-10 place-items-center rounded-full bg-surface text-fg shadow-sm ring-1 ring-line transition hover:bg-sun hover:text-night disabled:opacity-40 disabled:hover:bg-surface';
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Cantidad de ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label={`Quitar una unidad de ${label}`}>
        <IconMinus size={16} aria-hidden="true" />
      </button>
      <output className="w-8 text-center font-display text-lg font-extrabold" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label={`Agregar una unidad de ${label}`}>
        <IconPlus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

/** Agrega al pedido y avisa un instante con un check; no abre el panel si `quiet`. */
export function AddButton({ product, qty = 1, variant = 'ink', className = '', compact = false, quiet = false }: { product: Product; qty?: number; variant?: Variant; className?: string; compact?: boolean; quiet?: boolean }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() => {
        orderActions.add(product.slug, qty, !quiet);
        setDone(true);
      }}
      className={buttonClass(variant, `${compact ? '!min-h-11 !px-4 !text-sm' : ''} ${className}`)}
    >
      {done ? <IconCheck size={19} stroke={3} className="pop" aria-hidden="true" /> : <IconShoppingBagPlus size={19} aria-hidden="true" />}
      {done ? '¡Agregado!' : 'Agregar al pedido'}
    </button>
  );
}

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg font-bold text-fg">
          {title}
          <IconChevronDown size={22} aria-hidden="true" className={`shrink-0 text-coral-deep transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-5 leading-relaxed text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Sello para lo que la marca aún no confirma: no se inventa, se marca. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/25 px-3 py-1 text-xs font-bold text-coral-deep ring-1 ring-sun/60">
      <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
      Por confirmar: {children}
    </span>
  );
}
