import type { ReactNode } from 'react';

/** Franja oscura de arriba con título grande: la comparten las páginas internas. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: string; children?: ReactNode }) {
  return (
    <header className="grain relative overflow-hidden bg-ink pt-32 pb-24 text-white sm:pt-40 sm:pb-28">
      <div className="animate-drift pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-coral/35 blur-3xl" aria-hidden="true" />
      <div className="animate-drift pointer-events-none absolute -bottom-32 left-10 size-96 rounded-full bg-violet-600/35 blur-3xl [animation-delay:-6s]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <p className="eyebrow !text-sun">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-5xl leading-[1.02] font-extrabold sm:text-7xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">{lead}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
      <svg className="absolute inset-x-0 bottom-[-1px] w-full text-cream" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 60V30C300 0 600 0 900 20s400 20 540 0v40z" />
      </svg>
    </header>
  );
}
