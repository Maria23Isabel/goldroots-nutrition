// El riel de la home: marca en qué sección está el visitante y deja saltar a cualquiera. Es un solo nodo fijo a la
// derecha, solo en escritorio, y la pastilla dorada viaja de un punto al siguiente (layoutId) en lugar de reaparecer.
import * as m from 'motion/react-m';
import { useEffect, useState } from 'react';
import { LayoutMotion, useQuietMotion } from '@/lib/motion';

export interface RailItem {
  id: string;
  label: string;
}

export function SectionRail({ items }: { items: RailItem[] }) {
  /* Arranca sin ninguna marcada: en la portada todavía no se cruzó ninguna sección, y señalar «La línea» desde el
     primer píxel mentiría sobre dónde está el visitante. */
  const [active, setActive] = useState('');
  const quiet = useQuietMotion();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const nodes = items.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;
    /* La sección activa es la que más ocupa la franja central de la pantalla. Se lleva la cuenta de todas, así que al volver arriba
       (ninguna cruza el centro) la marca se apaga en vez de quedarse en la última que se vio. */
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.isIntersecting ? Math.max(entry.intersectionRatio, 0.001) : 0);
        let best = '';
        let max = 0;
        for (const [id, ratio] of ratios) if (ratio > max) [best, max] = [id, ratio];
        setActive(best);
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.2, 0.6] },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [items]);

  const jump = (id: string) => {
    const node = document.getElementById(id);
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: quiet ? 'auto' : 'smooth' });
  };

  return (
    <LayoutMotion>
    <nav aria-label="Secciones de la portada" className="pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col items-end gap-3">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id} className="pointer-events-auto">
              <button type="button" onClick={() => jump(item.id)} aria-current={on ? 'true' : undefined} className="group flex items-center justify-end gap-3 py-1">
                <span className={`text-[0.7rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 ${on ? 'text-night opacity-100' : 'text-muted opacity-0 group-hover:opacity-100'}`}>{item.label}</span>
                <span className="relative flex h-4 items-center">
                  {on && <m.span layoutId="rail-active" transition={{ type: 'spring', stiffness: 400, damping: 34 }} className="absolute right-0 h-4 w-1.5 rounded-full bg-accent" />}
                  <span className={`ml-2 size-1.5 rounded-full transition-colors duration-300 ${on ? 'bg-accent' : 'bg-line-strong group-hover:bg-night'}`} aria-hidden="true" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
    </LayoutMotion>
  );
}
