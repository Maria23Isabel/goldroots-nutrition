import { IconBolt, IconBrain, IconBrandWhatsapp, IconChevronDown, IconEye, IconHeartbeat, IconLeaf, IconMoon, IconShieldCheck, type Icon } from '@tabler/icons-react';
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type SVGProps } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { Link } from 'react-router';
import { EASE_OUT } from '@/lib/motion';
import { asset, goalOf, type GoalId } from '@/lib/products';
import { waLink, INFO_MESSAGE } from '@/lib/whatsapp';

export const GOAL_ICONS: Record<GoalId, Icon> = {
  energy: IconBolt,
  heart: IconHeartbeat,
  brain: IconBrain,
  sleep: IconMoon,
  'eye-skin': IconEye,
  immune: IconShieldCheck,
  general: IconLeaf,
};

export const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Cinco maneras de entrar, para que no todo aparezca con el mismo fundido: sube, se destapa de arriba a abajo, entra de lado, crece o solo se aclara. */
export type RevealKind = 'rise' | 'mask' | 'slide' | 'scale' | 'fade';
const REVEALS = {
  rise: { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } },
  mask: { hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)', y: 14 }, show: { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 } },
  slide: { hidden: { opacity: 0, x: -42 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
} as const;

/** Entra una sola vez al acercarse a la pantalla. El movimiento (no la opacidad) se apaga solo con «reducir movimiento». */
export function Reveal({ children, className = '', delay = 0, kind = 'rise' }: { children: ReactNode; className?: string; delay?: number; kind?: RevealKind }) {
  return (
    <m.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }} variants={REVEALS[kind]} transition={{ duration: 0.8, delay: delay / 1000, ease: EASE_OUT }}>
      {children}
    </m.div>
  );
}

/** Filete dorado que se dibuja de izquierda a derecha al entrar en pantalla: separa y presenta bloques sin ruido. */
export function DrawLine({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return <m.span aria-hidden="true" className={`block h-px origin-left bg-gradient-to-r from-accent to-accent/0 ${className}`} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 1.1, delay: delay / 1000, ease: EASE_OUT }} />;
}

export function CountUp({ to, suffix = '', duration = 1200, className = '' }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const quiet = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (quiet || typeof IntersectionObserver === 'undefined') return void setN(to);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        setN(to * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return <span ref={ref} className={className}>{Math.round(n)}{suffix}</span>;
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link to="/" aria-label="Gold Roots Nutrition, inicio" className="inline-flex items-center">
      <img src={asset('brand/logo-gold-240.webp')} alt="Gold Roots" width="240" height="108" className={`h-10 w-auto object-contain ${onDark ? 'brightness-125' : ''}`} />
    </Link>
  );
}

/** Las tres hojas del logotipo, solas y sin el texto GOLDROOTS: el mismo dibujo del favicon. */
export function LeafMark({ className = '', ...rest }: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} {...rest}>
      <defs>
        <linearGradient id="leafmark-oro" x1="14" y1="6" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-gold-light)" />
          <stop offset="0.45" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-deep)" />
        </linearGradient>
        <path id="leafmark-hoja" fill="url(#leafmark-oro)" fillRule="evenodd" d="M32 7.5C39.5 14 42.5 23 39.6 30.8C38 35.2 35 39 32 40.2C29 39 26 35.2 24.4 30.8C21.5 23 24.5 14 32 7.5ZM33.1 16C34.9 21.5 35.1 28 33.6 34.5C33.2 36.2 32.7 37.3 32.2 37.9C31.1 32.6 30.9 25.6 31.9 19.6C32.2 17.9 32.6 16.7 33.1 16Z" />
      </defs>
      <use href="#leafmark-hoja" />
      <use href="#leafmark-hoja" transform="translate(-2.4 1.6) rotate(-43 32 41)" />
      <use href="#leafmark-hoja" transform="translate(2.4 1.6) rotate(43 32 41)" />
    </svg>
  );
}

export function SectionHeading({ eyebrow, title, lead, center = false, onDark = false, as = 'h2', className = '' }: { eyebrow: string; title: ReactNode; lead?: string; center?: boolean; onDark?: boolean; as?: 'h2' | 'h3'; className?: string }) {
  const Heading = as;
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''} ${className}`}>
      <p className={`eyebrow ${onDark ? '!text-white/55' : ''}`}>{eyebrow}</p>
      <Heading className={`mt-3 text-[1.9rem] leading-[1.08] font-medium sm:text-[2.55rem] ${onDark ? 'text-white' : 'text-fg'}`}>{title}</Heading>
      {lead && <p className={`mt-4 text-[1rem] leading-relaxed sm:text-[1.08rem] ${onDark ? 'text-white/68' : 'text-muted'}`}>{lead}</p>}
    </div>
  );
}

type Variant = 'primary' | 'night' | 'outline' | 'light' | 'wa' | 'ghost-dark';
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-night hover:bg-accent-deep hover:text-white',
  night: 'bg-night text-white hover:bg-ink',
  outline: 'border border-line-strong bg-transparent text-fg hover:border-night hover:bg-night hover:text-white',
  light: 'border border-white/25 bg-white/8 text-white hover:bg-white hover:text-night',
  wa: 'bg-wa text-white hover:bg-wa-deep',
  'ghost-dark': 'border border-white/25 text-white hover:bg-white/10',
};

export const buttonClass = (variant: Variant = 'primary', extra = '') =>
  `press btn-shine group relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-5 whitespace-nowrap text-[0.88rem] font-semibold transition-colors ${VARIANTS[variant]} ${extra}`;

export function WhatsAppButton({ text, children, variant = 'wa', className = '', icon = true }: { text: string; children: ReactNode; variant?: Variant; className?: string; icon?: boolean }) {
  return (
    <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)}>
      {icon && <IconBrandWhatsapp size={18} aria-hidden="true" />}
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}

/**
 * El canal de contacto fijo de toda la web: abajo a la derecha, en escritorio y en móvil.
 * Es solo un enlace a wa.me con el mensaje precargado — no hay chatbot, ni respuestas automáticas,
 * ni formularios de datos personales. El número sale de `site.whatsapp` (o de VITE_WHATSAPP al compilar).
 */
export function WhatsAppFloat() {
  return (
    <a href={waLink(INFO_MESSAGE)} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Escribir a Gold Roots por WhatsApp (se abre en una pestaña nueva)">
      <IconBrandWhatsapp size={24} aria-hidden="true" />
      <span className="wa-label">WhatsApp</span>
    </a>
  );
}

export function GoalBadge({ goal, small = false }: { goal: GoalId; small?: boolean }) {
  const item = goalOf(goal);
  const GoalIcon = GOAL_ICONS[goal];
  return (
    <span className={`g-${goal} goal-block text-goal goal-ring inline-flex items-center gap-1.5 rounded-full font-semibold ${small ? 'px-2.5 py-0.5 text-[0.7rem]' : 'px-3 py-1 text-[0.8rem]'}`}>
      <GoalIcon size={small ? 12 : 14} stroke={2} aria-hidden="true" />
      {item.short}
    </span>
  );
}

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line last:border-0">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen(!open)} className="group flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.05rem] font-medium text-fg">
          <span className="transition-colors group-hover:text-accent-deep">{title}</span>
          <span className={`grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${open ? 'rotate-180 border-accent bg-accent-soft text-accent-deep' : 'border-line-strong text-muted group-hover:border-night'}`}>
            <IconChevronDown size={16} aria-hidden="true" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div id={`${id}-panel`} key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.34, ease: EASE_OUT }} className="overflow-hidden">
            <m.div initial={{ y: -8 }} animate={{ y: 0 }} exit={{ y: -8 }} transition={{ duration: 0.34, ease: EASE_OUT }} className="max-w-2xl pb-5 text-[0.95rem] leading-relaxed text-muted">
              {children}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TrustMarks({ items, onDark = false }: { items: Array<{ Icon: Icon; text: string }>; onDark?: boolean }) {
  return (
    <ul className={`grid gap-x-6 gap-y-3 ${items.length > 3 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
      {items.map(({ Icon: ItemIcon, text }) => (
        <li key={text} className={`flex items-center gap-2.5 text-[0.88rem] font-medium ${onDark ? 'text-white/80' : 'text-fg'}`}>
          <ItemIcon size={17} stroke={1.9} aria-hidden="true" className={`shrink-0 ${onDark ? 'text-accent' : 'text-accent-deep'}`} />
          {text}
        </li>
      ))}
    </ul>
  );
}
