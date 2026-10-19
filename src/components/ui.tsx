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

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link to="/" aria-label="Gold Roots Nutrition, inicio" className="inline-flex items-center gap-2.5 whitespace-nowrap">
      <span className={`grid size-9 place-items-center rounded-lg ${onDark ? 'bg-white/12 text-white' : 'bg-night text-white'}`}>
        <IconLeaf size={19} stroke={1.9} aria-hidden="true" />
      </span>
      <span className={`font-display text-[1.15rem] leading-none font-medium tracking-tight ${onDark ? 'text-white' : 'text-fg'}`}>Gold Roots</span>
    </Link>
  );
}

/** Título de sección: el tamaño de las páginas de referencia (28–36 px), no los 72 px de la versión anterior. */
export function SectionHeading({ eyebrow, title, lead, center = false, onDark = false, as = 'h2', className = '' }: { eyebrow: string; title: ReactNode; lead?: string; center?: boolean; onDark?: boolean; as?: 'h2' | 'h3'; className?: string }) {
  const Heading = as;
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''} ${className}`}>
      <p className={`eyebrow ${onDark ? '!text-white/55' : ''}`}>{eyebrow}</p>
      <Heading className={`mt-2.5 text-[1.75rem] leading-[1.15] font-medium sm:text-[2.1rem] ${onDark ? 'text-white' : 'text-fg'}`}>{title}</Heading>
      {lead && <p className={`mt-3 text-[1.05rem] leading-relaxed ${onDark ? 'text-white/70' : 'text-muted'}`}>{lead}</p>}
    </div>
  );
}

type Variant = 'primary' | 'night' | 'outline' | 'light' | 'wa' | 'ghost-dark';
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-deep',
  night: 'bg-night text-white hover:bg-fg/85',
  outline: 'border border-line-strong bg-surface text-fg hover:border-fg hover:bg-sand',
  light: 'border border-white/25 bg-white/10 text-white hover:bg-white hover:text-night',
  wa: 'bg-wa text-white hover:bg-wa-deep',
  'ghost-dark': 'border border-white/25 text-white hover:bg-white/10',
};

export const buttonClass = (variant: Variant = 'primary', extra = '') =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 whitespace-nowrap text-[0.9rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${extra}`;

export function WhatsAppButton({ text, children, variant = 'wa', className = '' }: { text: string; children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)}>
      <IconBrandWhatsapp size={18} aria-hidden="true" />
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}

/** La etiqueta de objetivo: fondo pastel y texto del mismo family, siempre legible. */
export function GoalBadge({ goal, small = false }: { goal: GoalId; small?: boolean }) {
  const g = goalOf(goal);
  const IconG = GOAL_ICONS[goal];
  return (
    <span className={`g-${goal} goal-block text-goal goal-ring inline-flex items-center gap-1.5 rounded-full font-semibold ${small ? 'px-2.5 py-0.5 text-[0.7rem]' : 'px-3 py-1 text-[0.8rem]'}`}>
      <IconG size={small ? 12 : 14} stroke={2} aria-hidden="true" />
      {g.short}
    </span>
  );
}

export function PriceTag({ product, big = false }: { product: Product; big?: boolean }) {
  if (product.price == null) {
    return <span className={`font-display font-medium text-muted ${big ? 'text-2xl' : 'text-base'}`}>Consultar precio</span>;
  }
  const off = percentOff(product);
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`font-display font-medium text-fg ${big ? 'text-3xl' : 'text-lg'}`}>{money(product.price)}</span>
      {product.compareAt != null && (
        <>
          <s className={`text-muted ${big ? 'text-base' : 'text-sm'}`} aria-label={`Precio normal ${money(product.compareAt)}`}>
            {money(product.compareAt)}
          </s>
          {off > 0 && <span className="text-[0.8rem] font-semibold text-wa-deep">−{off}%</span>}
        </>
      )}
    </span>
  );
}

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const btn = 'grid size-9 place-items-center rounded-full border border-line-strong bg-surface text-fg transition hover:bg-sand disabled:opacity-40';
  return (
    <div className="inline-flex items-center gap-1.5" role="group" aria-label={`Cantidad de ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label={`Quitar una unidad de ${label}`}>
        <IconMinus size={15} aria-hidden="true" />
      </button>
      <output className="w-8 text-center font-display text-base font-medium" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label={`Agregar una unidad de ${label}`}>
        <IconPlus size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

/** Agrega al pedido y avisa un instante con un check; no abre el panel si `quiet`. */
export function AddButton({ product, qty = 1, variant = 'night', className = '', compact = false, quiet = false }: { product: Product; qty?: number; variant?: Variant; className?: string; compact?: boolean; quiet?: boolean }) {
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
      className={buttonClass(variant, `${compact ? '!min-h-10 !px-4 !text-[0.82rem]' : ''} ${className}`)}
    >
      {done ? <IconCheck size={17} stroke={2.4} className="pop" aria-hidden="true" /> : <IconShoppingBagPlus size={17} aria-hidden="true" />}
      {done ? 'Agregado' : 'Agregar al pedido'}
    </button>
  );
}

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line last:border-0">
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-6 py-4 text-left font-display text-[1.05rem] font-medium text-fg">
          {title}
          <IconChevronDown size={18} aria-hidden="true" className={`shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      <div className={`grid transition-[grid-template-rows] duration-250 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="max-w-2xl pb-5 text-[0.95rem] leading-relaxed text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Sello para lo que la marca aún no confirma: no se inventa, se marca. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-[0.72rem] font-semibold text-muted ring-1 ring-line-strong">
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      Por confirmar: {children}
    </span>
  );
}

/** Fila de datos reales de la línea (los que se pueden afirmar del catálogo; no se inventan certificaciones ni reseñas). */
export function TrustMarks({ items, onDark = false }: { items: Array<{ Icon: Icon; text: string }>; onDark?: boolean }) {
  return (
    <ul className={`grid gap-x-6 gap-y-3 ${items.length > 3 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
      {items.map(({ Icon, text }) => (
        <li key={text} className={`flex items-center gap-2.5 text-[0.88rem] font-medium ${onDark ? 'text-white/80' : 'text-fg'}`}>
          <Icon size={17} stroke={1.9} aria-hidden="true" className={`shrink-0 ${onDark ? 'text-white/60' : 'text-muted'}`} />
          {text}
        </li>
      ))}
    </ul>
  );
}
