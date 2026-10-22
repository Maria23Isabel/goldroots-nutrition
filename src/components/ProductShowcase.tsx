// El selector interactivo de la colección. Es estado de React puro: al elegir otra fórmula cambian la imagen, el
// tinte del objetivo y toda la información, sin recargar la página ni pedir nada al servidor.
import { IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ProductImage } from '@/components/ProductCard';
import { buttonClass, GoalBadge, SectionHeading, WhatsAppButton } from '@/components/ui';
import { EASE_OUT, LayoutMotion } from '@/lib/motion';
import { GOALS, PRODUCTS } from '@/lib/products';
import { showcasePicks } from '@/lib/showcase';
import { infoAbout } from '@/lib/whatsapp';

/* Cinco fórmulas reales, una por objetivo: todas salen del catálogo generado desde la web de la marca. */
const picks = showcasePicks();

const CONTAINER = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } };
const ITEM = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } };

export function ProductShowcase() {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const product = picks[index];

  /* Flechas, Inicio y Fin dentro del grupo de pestañas; el foco sigue a la pestaña elegida. */
  const move = useCallback((step: number) => {
    setIndex((current) => {
      const next = (current + step + picks.length) % picks.length;
      tabs.current[next]?.focus();
      return next;
    });
  }, []);

  const goTo = (position: number) => {
    setIndex(position);
    tabs.current[position]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') move(1);
    else if (event.key === 'ArrowLeft') move(-1);
    else if (event.key === 'Home') goTo(0);
    else if (event.key === 'End') goTo(picks.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <LayoutMotion>
    <section className="border-y border-line bg-sand" aria-labelledby="showcase-title">
      <div className="wrap section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Mueve la línea" title={<span id="showcase-title">Elige una fórmula y mírala de cerca</span>} lead="Selecciona un frasco y la ficha cambia en la misma página. Son datos del catálogo: no hay precios ni carrito." />
          <Link to="/catalogo" className={buttonClass('outline')}>
            Ver las {PRODUCTS.length} fórmulas <IconArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div id="showcase-panel" role="tabpanel" aria-labelledby={`showcase-tab-${product.slug}`} tabIndex={0} className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          {/* Escenario: las cinco fotos quedan montadas y solo se cruzan con opacidad y escala, así que cambiar
              de producto nunca deja un hueco esperando el archivo. */}
          {/* Cada capa lleva su propia placa teñida dentro del nodo que se cruza: el multiplicado del frasco
              necesita ese fondo dentro del mismo grupo, porque la opacidad animada aísla la mezcla. */}
          <div className="relative grid aspect-[4/3.4] place-items-center overflow-hidden rounded-[2rem]">
            {picks.map((item, position) => (
              <m.div
                key={item.slug}
                aria-hidden={position !== index}
                className="absolute inset-0 overflow-hidden rounded-[2rem]"
                initial={false}
                animate={{ opacity: position === index ? 1 : 0, scale: position === index ? 1 : 0.9, x: position === index ? 0 : position > index ? 26 : -26 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
                style={{ zIndex: position === index ? 10 : 1 }}
              >
                <span aria-hidden="true" className={`g-${item.goal} goal-block absolute inset-0`} />
                <span className="relative block h-full p-6 sm:p-10">
                  <ProductImage product={item} width={520} className="mx-auto h-full w-full object-contain" />
                </span>
              </m.div>
            ))}
            {/* El hilo dorado del pie viaja de una posición a otra: es la misma pieza, no una nueva por producto. */}
            <m.span layoutId="showcase-thread" transition={{ type: 'spring', stiffness: 320, damping: 34 }} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-accent-deep via-gold-light to-accent" />
          </div>

          {/* La información entra y sale con su producto, escalonada. */}
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={product.slug} variants={CONTAINER} initial="hidden" animate="show" exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
              <m.div variants={ITEM}>
                <GoalBadge goal={product.goal} />
                <h3 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-[1.03] text-night">{product.name}</h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-muted">{product.headline}</p>
              </m.div>
              <m.p variants={ITEM} className="mt-5 text-[0.95rem] leading-[1.8] text-fg/85">
                {product.summary}
              </m.p>
              <m.ul variants={ITEM} className="mt-6 flex flex-wrap gap-2">
                {product.ingredients.slice(0, 6).map((ingredient) => (
                  <li key={ingredient} className="rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-[0.8rem] font-medium text-fg">
                    {ingredient}
                  </li>
                ))}
              </m.ul>
              <m.div variants={ITEM} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[0.85rem] text-muted">
                <span>{product.format || 'Presentación por confirmar'}</span>
                <span>{GOALS.find((goal) => goal.id === product.goal)?.label}</span>
              </m.div>
              <m.div variants={ITEM} className="mt-8 flex flex-wrap gap-3">
                <Link to={`/producto/${product.slug}`} className={buttonClass('primary')}>
                  Ver ficha completa <IconArrowRight size={16} aria-hidden="true" />
                </Link>
                <WhatsAppButton text={infoAbout(product.name)} variant="outline">
                  Preguntar por esta fórmula
                </WhatsAppButton>
              </m.div>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Los controles: miniaturas con su frasco y su nombre, navegables con teclado y cómodas de tocar. */}
        <div role="tablist" aria-label="Fórmulas destacadas" aria-orientation="horizontal" onKeyDown={onKeyDown} className="scroll-x -mx-5 mt-10 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {picks.map((item, position) => {
            const on = position === index;
            return (
              <button
                key={item.slug}
                ref={(node) => {
                  tabs.current[position] = node;
                }}
                type="button"
                role="tab"
                id={`showcase-tab-${item.slug}`}
                aria-selected={on}
                aria-controls="showcase-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setIndex(position)}
                className={`group relative flex min-h-14 shrink-0 items-center gap-3 rounded-full border py-2 pr-5 pl-2 text-left transition-colors duration-300 ${on ? 'border-accent bg-surface text-night' : 'border-line-strong text-muted hover:border-night hover:text-night'}`}
              >
                {on && <m.span layoutId="showcase-tab-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_10px_26px_-16px_rgb(34_55_92/0.55)]" />}
                <span className={`g-${item.goal} goal-block grid size-10 place-items-center overflow-hidden rounded-full`}>
                  <ProductImage product={item} width={120} className="size-9 object-contain" />
                </span>
                <span className="whitespace-nowrap text-[0.84rem] font-semibold">{item.name}</span>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          Fórmula seleccionada: {product.name}.
        </p>
      </div>
    </section>
    </LayoutMotion>
  );
}
