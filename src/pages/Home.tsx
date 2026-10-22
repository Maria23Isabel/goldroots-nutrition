import { IconArrowRight } from '@tabler/icons-react';
import * as m from 'motion/react-m';
import { Link } from 'react-router';
import { HeroScene } from '@/components/HeroScene';
import { SectionRail, type RailItem } from '@/components/SectionRail';
import { Accordion, buttonClass, CountUp, LeafMark, Reveal, SectionHeading, WhatsAppButton } from '@/components/ui';
import { useCursorCard } from '@/lib/cursor';
import { Defer, lazyNamed } from '@/lib/lazy';
import { usePageMeta } from '@/lib/meta';
import { asset, GOALS, PRODUCTS } from '@/lib/products';
import { INFO_MESSAGE } from '@/lib/whatsapp';

/* Las escenas de abajo se descargan cuando van a entrar en pantalla: la portada llega sola y primero. */
const UniverseBand = lazyNamed(() => import('@/components/UniverseBand'), 'UniverseBand');
const StoryScene = lazyNamed(() => import('@/components/StoryScene'), 'StoryScene');
const FormulaFinder = lazyNamed(() => import('@/components/FormulaFinder'), 'FormulaFinder');
const ProductSpotlight = lazyNamed(() => import('@/components/ProductSpotlight'), 'ProductSpotlight');
const ProductShowcase = lazyNamed(() => import('@/components/ProductShowcase'), 'ProductShowcase');
const TrustScene = lazyNamed(() => import('@/components/TrustScene'), 'TrustScene');

/* Los tramos que el riel derecho puede marcar y a los que salta. */
const RAIL: RailItem[] = [
  { id: 'historia', label: 'La línea' },
  { id: 'objetivos', label: 'Objetivos' },
  { id: 'explorador', label: 'Explorador' },
  { id: 'destacado', label: 'Destacado' },
  { id: 'coleccion', label: 'Colección' },
  { id: 'calidad', label: 'Calidad' },
  { id: 'preguntas', label: 'Preguntas' },
];

function Goals() {
  return (
    <section id="objetivos" className="wrap section" aria-labelledby="goals-title">
      <Reveal kind="fade">
        <SectionHeading eyebrow="Explora por objetivo" title={<span id="goals-title">Seis puertas de entrada</span>} lead="No son diagnósticos ni recomendaciones médicas. Son categorías para orientarte dentro del catálogo y revisar la información de cada fórmula." />
      </Reveal>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GOALS.map((goal, index) => (
          <li key={goal.id}>
            <GoalCard goal={goal} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Cada puerta reacciona al cursor con la misma luz dorada de las tarjetas de producto. */
function GoalCard({ goal, index }: { goal: (typeof GOALS)[number]; index: number }) {
  const cursor = useCursorCard<HTMLAnchorElement>(2.5);
  return (
    <Reveal kind={index % 2 === 0 ? 'rise' : 'mask'} delay={index * 40} className="h-full">
      <Link
        {...cursor}
        to={`/catalogo?objetivo=${goal.slug}`}
        className={`g-${goal.id} goal-block tilt spot group flex h-full min-h-56 flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1`}
      >
        <span className="text-goal text-[0.72rem] font-bold tracking-[0.14em] uppercase">0{index + 1}</span>
        <h3 className="mt-auto text-[1.55rem] leading-tight">{goal.label}</h3>
        <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-muted">{goal.blurb}.</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-semibold text-night">
          Explorar <IconArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </Reveal>
  );
}

function BrandMoment() {
  return (
    <section className="wrap section" aria-labelledby="brand-title">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16 lg:p-14">
          <Reveal kind="slide">
            <p className="eyebrow text-accent-deep">La colección completa</p>
            <h2 id="brand-title" className="mt-4 text-[clamp(2.2rem,4.5vw,4rem)] leading-[0.98]">
              Un lenguaje visual. Distintos objetivos.
            </h2>
            <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-muted">Frascos, ingredientes y fichas conviven en un sistema consistente para que comparar resulte más simple.</p>
          </Reveal>
          <Reveal kind="scale" delay={120}>
            <dl className="grid grid-cols-2 gap-5 border-t border-line pt-7">
              <div>
                <dd className="font-display text-4xl text-night">
                  <CountUp to={PRODUCTS.length} />
                </dd>
                <dt className="mt-1 text-[0.78rem] font-medium text-muted">fórmulas documentadas</dt>
              </div>
              <div>
                <dd className="font-display text-4xl text-night">
                  <CountUp to={GOALS.length} />
                </dd>
                <dt className="mt-1 text-[0.78rem] font-medium text-muted">objetivos para explorar</dt>
              </div>
            </dl>
          </Reveal>
        </div>
        {/* La foto entra con un fundido corto y se muestra completa, a su proporción real (16:9): sin recorte ni ampliación, así nunca se pixela. */}
        <m.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }} className="overflow-hidden bg-[#f1eee7]">
          <img src={asset('brand/lineup-premium.webp')} srcSet={`${asset('brand/lineup-premium-900.webp')} 900w, ${asset('brand/lineup-premium.webp')} 1600w`} sizes="(max-width: 1280px) 92vw, 76rem" width="1600" height="914" loading="lazy" decoding="async" alt="La colección Gold Roots completa, con sus frascos al frente y sus ingredientes alrededor" className="block h-auto w-full" />
        </m.div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="preguntas" className="wrap section grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20" aria-labelledby="faq-title">
      <Reveal kind="fade">
        <SectionHeading eyebrow="Preguntas frecuentes" title={<span id="faq-title">Antes de explorar</span>} lead="La página presenta la información disponible en el catálogo y no sustituye la orientación de un profesional de la salud." />
      </Reveal>
      <div className="border-t border-line">
        <Accordion title="¿Puedo comprar desde esta página?" defaultOpen>
          No. Gold Roots funciona aquí como una experiencia corporativa e informativa. No hay precios, carrito, cantidades ni flujo de compra. Para cualquier consulta, el canal es WhatsApp.
        </Accordion>
        <Accordion title="¿Qué información tiene cada ficha?">Nombre, objetivo, descripción, ingredientes, presentación, beneficios declarados por el catálogo y un QR que abre la misma página.</Accordion>
        <Accordion title="¿El sitio recomienda qué suplemento tomar?">No. Las categorías ayudan a navegar la línea, pero no constituyen una recomendación médica ni reemplazan la evaluación de un profesional.</Accordion>
        <Accordion title="¿Para qué sirve el código QR?">Permite abrir y compartir la ficha informativa de un producto mediante una dirección estable. No afirma autenticidad por sí solo.</Accordion>
        <Accordion title="¿Son medicamentos?">No. Son suplementos alimenticios y no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.</Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="wrap pb-2" aria-labelledby="final-title">
      <m.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }} className="relative overflow-hidden rounded-[2rem] bg-night px-7 py-14 text-center text-white sm:px-12 sm:py-20">
        <span className="drift absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-accent/14 blur-3xl" aria-hidden="true" />
        <LeafMark className="relative mx-auto size-9" />
        <h2 id="final-title" className="relative mx-auto mt-5 max-w-3xl text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.98]">
          Encuentra la fórmula que quieres conocer.
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed text-white/62">Recorre el catálogo completo, filtra por objetivo o escribe directamente a la marca.</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/catalogo" className={buttonClass('primary')}>
            Explorar catálogo <IconArrowRight size={17} aria-hidden="true" />
          </Link>
          <WhatsAppButton text={INFO_MESSAGE} variant="ghost-dark">
            Contactar por WhatsApp
          </WhatsAppButton>
        </div>
      </m.div>
    </section>
  );
}

export function Home() {
  usePageMeta({
    title: 'Gold Roots Nutrition — Fórmulas para tu bienestar diario',
    description: `Conoce las ${PRODUCTS.length} fórmulas de Gold Roots Nutrition: ingredientes, objetivos, presentaciones y fichas informativas con QR.`,
    path: '/',
    image: 'brand/hero-gold.webp',
  });
  return (
    <>
      <SectionRail items={RAIL} />
      <HeroScene />
      <Defer reserve="min-h-[60svh]"><UniverseBand /></Defer>
      <Defer id="historia" reserve="min-h-[120svh] lg:min-h-[300svh]"><StoryScene /></Defer>
      <Goals />
      <Defer id="explorador" reserve="min-h-[48rem]"><FormulaFinder /></Defer>
      <Defer id="destacado" reserve="min-h-[90svh] lg:min-h-[260svh]"><ProductSpotlight /></Defer>
      <Defer id="coleccion" reserve="min-h-[56rem]"><ProductShowcase /></Defer>
      <BrandMoment />
      <Defer id="calidad" reserve="min-h-[60rem]"><TrustScene /></Defer>
      <Faq />
      <FinalCta />
    </>
  );
}
