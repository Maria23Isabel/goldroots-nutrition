import { IconBrandWhatsapp, IconLeaf } from '@tabler/icons-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router';

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
      { threshold: 0.12, rootMargin: '0px 0px -40px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" aria-label="Gold Roots Nutrition, home" className="inline-flex items-center gap-2.5 whitespace-nowrap">
      <span className={`grid size-10 place-items-center rounded-full ${light ? 'bg-gold text-forest' : 'bg-forest text-gold'}`}>
        <IconLeaf size={21} stroke={2} aria-hidden="true" />
      </span>
      <span className={`font-serif text-xl leading-none tracking-wide ${light ? 'text-white' : 'text-forest'}`}>
        GOLD <span className={light ? 'text-gold' : 'text-gold-deep'}>ROOTS</span>
      </span>
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, lead, center = false, light = false, as = 'h2' }: { eyebrow: string; title: string; lead?: string; center?: boolean; light?: boolean; as?: 'h2' | 'h3' }) {
  const Heading = as;
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`eyebrow ${light ? '!text-gold' : ''}`}>{eyebrow}</p>
      <Heading className={`mt-3 text-3xl leading-tight sm:text-5xl ${light ? 'text-white' : 'text-forest'}`}>{title}</Heading>
      {lead && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/75' : 'text-muted'}`}>{lead}</p>}
    </div>
  );
}

export const buttonClass = (variant: 'gold' | 'dark' | 'outline' | 'ghost-light' | 'wa' = 'gold', extra = '') =>
  `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 whitespace-nowrap text-sm font-bold tracking-wider uppercase transition disabled:cursor-not-allowed disabled:opacity-50 ${
    {
      gold: 'gold-fill text-forest hover:brightness-110',
      wa: 'bg-wa text-forest hover:brightness-105',
      dark: 'bg-forest text-white hover:bg-forest-2',
      outline: 'border-2 border-forest text-forest hover:bg-forest hover:text-white',
      'ghost-light': 'border border-white/30 text-white hover:bg-white/10',
    }[variant]
  } ${extra}`;

/** Abre WhatsApp con el mensaje ya escrito: la vitrina no cobra en línea, los pedidos se cierran por el chat. */
export function WhatsAppButton({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass('wa', className)}>
      <IconBrandWhatsapp size={20} aria-hidden="true" />
      {children}
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}

/** Aviso de que un dato del negocio todavía no está confirmado: se ve, pero no interrumpe. */
export function ToConfirm({ label = 'to be confirmed' }: { label?: string }) {
  return (
    <span className="rounded-full border border-dashed border-gold-deep/50 bg-gold-soft/40 px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-gold-deep uppercase">
      {label}
    </span>
  );
}

export function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
      <ToConfirm /> {children}
    </p>
  );
}
