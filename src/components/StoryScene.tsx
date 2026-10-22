// Experiencia A — «Descubre Gold Roots». Una sola composición que se transforma al bajar: la placa activa pasa al
// centro y crece, las otras dos se apartan y bajan su presencia, y el mensaje cambia con ella. React solo se
// re-renderiza una vez por tramo; el movimiento lo hacen los valores de Motion.
import { IconArrowRight } from '@tabler/icons-react';
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ProductImage } from '@/components/ProductCard';
import { CatalogGate } from '@/components/CatalogGate';
import { buttonClass, Reveal, SectionHeading } from '@/components/ui';
import { EASE_OUT, useDesktop, useQuietMotion } from '@/lib/motion';
import { goalOf, type Product } from '@/lib/products';
import { pickVaried, stepAt } from '@/lib/showcase';

/* Los tres tramos se escriben sobre datos que ya están en el catálogo: nombre, objetivo y ficha. */
const STEPS = [
  {
    n: '01',
    eyebrow: 'Conocer',
    title: 'Empieza por el objetivo.',
    text: (product: Product) => `La línea se organiza en seis territorios de bienestar. ${product.name} entra por «${goalOf(product.goal).label.toLowerCase()}»: un punto de partida claro para recorrer el catálogo.`,
    to: (product: Product) => `/catalogo?objetivo=${goalOf(product.goal).slug}`,
    cta: 'Ver este objetivo',
  },
  {
    n: '02',
    eyebrow: 'Comprender',
    title: 'Lee la fórmula completa.',
    text: (product: Product) => `${product.name} reúne en su ficha ingredientes, presentación y beneficios declarados por el catálogo. La información está antes que cualquier decisión.`,
    to: (product: Product) => `/producto/${product.slug}`,
    cta: 'Abrir la ficha',
  },
  {
    n: '03',
    eyebrow: 'Profundizar',
    title: 'Lleva la ficha contigo.',
    text: (product: Product) => `${product.name} conserva una dirección propia que abre esta misma página, para volver a consultarla cuando quieras.`,
    to: (product: Product) => `/producto/${product.slug}`,
    cta: 'Ver producto',
  },
];

/* Posición de cada placa según el tramo: la activa al centro y grande; las otras, apartadas y en segundo plano. */
const LAYOUT = [
  { x: '0%', scale: 1, opacity: 1, rotate: 0, z: 30 },
  { x: '56%', scale: 0.66, opacity: 0.4, rotate: 5, z: 10 },
  { x: '-56%', scale: 0.66, opacity: 0.4, rotate: -5, z: 10 },
];

export function StoryScene() {
  return (
    <CatalogGate error={null} empty={null}>
      {(catalog) => {
        /* La escena cuenta con tres productos distintos: con menos de tres no se muestra (no se repiten ni se inventan). */
        const stories = pickVaried(catalog.products, STEPS.length);
        return stories.length === STEPS.length ? <Story stories={stories} /> : null;
      }}
    </CatalogGate>
  );
}

function Story({ stories }: { stories: Product[] }) {
  const section = useRef<HTMLElement>(null);
  const desktop = useDesktop();
  const quiet = useQuietMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = stepAt(value, STEPS.length);
    setActive((current) => (current === next ? current : next));
  });

  if (desktop && !quiet) {
    return (
      <section ref={section} className="story-section relative text-white" aria-labelledby="story-title">
        <div className="relative h-[190svh]">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <div className="wrap grid w-full items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
              {/* El escenario: las tres placas comparten el mismo centro y solo cambia cuál manda. */}
              <div className="story-stage relative order-2 h-[38svh] sm:h-[46svh] lg:order-none lg:h-[62svh]">
                <span aria-hidden="true" className="absolute inset-[16%_10%] rounded-full bg-accent/14 blur-3xl" />
                {stories.map((product, index) => {
                  const place = LAYOUT[(index - active + STEPS.length) % STEPS.length];
                  return (
                    <div key={product.slug} className="absolute inset-0 grid place-items-center" style={{ zIndex: place.z }}>
                      <m.div
                        initial={false}
                        animate={{ x: place.x, scale: place.scale, opacity: place.opacity, rotate: place.rotate }}
                        transition={{ type: 'spring', stiffness: 190, damping: 26, mass: 0.7 }}
                        className={`g-${product.goal} story-bottle w-[58%] rounded-[1.75rem] bg-gradient-to-b from-white to-[#efe9dc] p-3 shadow-[0_30px_60px_-28px_rgb(6_12_22/0.9)] ring-1 ring-white/15`}
                      >
                        <ProductImage product={product} width={520} eager className="mx-auto h-auto w-full" />
                      </m.div>
                    </div>
                  );
                })}
              </div>

              {/* El mensaje: entra uno y sale el otro, con el riel de tramos debajo. */}
              <div className="order-1 lg:order-none">
                <p className="eyebrow !text-accent">Una línea, varios caminos</p>
                <div className="relative mt-6 min-h-[24rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <m.div key={active} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -22 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
                      <p className="flex items-center gap-3 text-[0.74rem] font-semibold tracking-[0.16em] text-accent uppercase">
                        <span>{STEPS[active].n}</span>
                        <span className="h-px w-10 bg-accent/60" />
                        {STEPS[active].eyebrow}
                      </p>
                      <h2 id="story-title" className="mt-5 max-w-lg text-[clamp(2.1rem,4.2vw,3.9rem)] leading-[0.99] font-medium tracking-[-0.04em]">
                        {STEPS[active].title}
                      </h2>
                      <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-white/66">{STEPS[active].text(stories[active])}</p>
                      <Link to={STEPS[active].to(stories[active])} className={buttonClass('light', 'mt-9')}>
                        {STEPS[active].cta} <IconArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </m.div>
                  </AnimatePresence>
                </div>
                {/* Riel de tramos: la línea dorada avanza con el scroll y los puntos marcan el momento actual. */}
                <div className="mt-10 flex items-center gap-4">
                  <span className="relative h-px w-40 overflow-hidden bg-white/18" aria-hidden="true">
                    <m.span className="absolute inset-0 origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
                  </span>
                  <ul className="flex gap-2" aria-hidden="true">
                    {STEPS.map((step, index) => (
                      <li key={step.n} className={`size-1.5 rounded-full transition-colors duration-300 ${index === active ? 'bg-accent' : 'bg-white/25'}`} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* En celular la escena se simplifica: cada tramo con su placa, sin composición anclada ni cambios de posición. */
  return (
    <section ref={section} className="story-section relative text-white" aria-labelledby="story-title">
      <div className="wrap section">
        <Reveal kind="fade">
          <SectionHeading onDark eyebrow="Una línea, varios caminos" title={<span id="story-title">La composición cambia mientras avanzas.</span>} lead="Objetivo, fórmula y ficha: tres momentos para recorrer Gold Roots." />
        </Reveal>
        <ol className="mt-10 space-y-12">
          {STEPS.map((step, index) => (
            <li key={step.n}>
              <Reveal kind={index === 0 ? 'rise' : index === 1 ? 'mask' : 'scale'}>
                <div className={`g-${stories[index].goal} story-bottle mx-auto w-[62%] max-w-[16rem] rounded-[1.5rem] bg-gradient-to-b from-white to-[#efe9dc] p-3 ring-1 ring-white/15`}>
                  <ProductImage product={stories[index]} width={420} className="mx-auto h-auto w-full" />
                </div>
                <div className="mt-7 text-center">
                  <p className="flex items-center justify-center gap-3 text-[0.72rem] font-semibold tracking-[0.16em] text-accent uppercase">
                    <span>{step.n}</span>
                    <span className="h-px w-8 bg-accent/60" />
                    {step.eyebrow}
                  </p>
                  <h3 className="mt-4 text-[1.6rem] leading-tight font-medium">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/66">{step.text(stories[index])}</p>
                  <Link to={step.to(stories[index])} className={buttonClass('light', 'mt-6')}>
                    {step.cta} <IconArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
