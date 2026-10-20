import type { ReactNode } from 'react';
import { d } from '@/components/ui';

/** Cabecera clara de las páginas internas: arena de fondo, filete abajo y título en peso medio. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: string; children?: ReactNode }) {
  return (
    <header className="border-b border-line bg-sand">
      <div className="wrap py-14 sm:py-20">
        <p className="eyebrow rise" style={d(0)}>{eyebrow}</p>
        <h1 className="rise mt-3 max-w-3xl text-[2.1rem] leading-[1.12] font-medium sm:text-[2.7rem]" style={d(70)}>{title}</h1>
        {lead && <p className="rise mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-muted" style={d(150)}>{lead}</p>}
        {children && <div className="rise mt-7 flex flex-wrap gap-3" style={d(230)}>{children}</div>}
      </div>
    </header>
  );
}
