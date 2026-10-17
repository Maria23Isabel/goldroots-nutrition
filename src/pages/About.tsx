import { IconArrowRight, IconFlask, IconLeaf, IconPackage } from '@tabler/icons-react';
import { Link } from 'react-router';
import { ProductImage } from '@/components/ProductCard';
import { PageHero } from '@/components/PageHero';
import { buttonClass, GOAL_ICONS, Reveal, SectionHeading } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { countByGoal, findProduct, GOALS } from '@/lib/products';
import { site } from '@/lib/site';

const STEPS = [
  { Icon: IconLeaf, title: 'Ingredientes de raíz', text: 'Plantas, hongos y minerales con una larga historia de uso: maca, shilajit, cúrcuma, cardo mariano, melena de león.' },
  { Icon: IconFlask, title: 'Una fórmula, un trabajo', text: 'Cada producto se construye alrededor de un objetivo claro, sin relleno innecesario y con etiquetas que dicen lo que lleva.' },
  { Icon: IconPackage, title: 'Directo a ti', text: 'Eliges, armas tu pedido y lo coordinas por WhatsApp: disponibilidad, envío y pago, sin intermediarios.' },
];

export function About() {
  usePageMeta({
    title: 'Nosotros — Gold Roots Nutrition',
    description: 'Ingredientes orgánicos y resultados poderosos: qué hace Gold Roots Nutrition y cómo se usa esta vitrina.',
    path: '/nosotros',
  });
  const hero = findProduct('shilajit-gold')!;

  return (
    <>
      <PageHero eyebrow="Nuestra historia" title="Ingredientes orgánicos. Resultados poderosos." lead="Gold Roots Nutrition crea suplementos de alta calidad para quienes esperan más que lo común.">
        <Link to="/catalogo" className={buttonClass('sun')}>
          Ver el catálogo <IconArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/mayoristas" className={buttonClass('ghost-light')}>
          Mayoristas
        </Link>
      </PageHero>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <p className="text-xl leading-relaxed text-fg/85">
            La línea se mantiene pequeña a propósito: <strong>catorce fórmulas</strong>, cada una pensada para un objetivo claro y construida con ingredientes de larga tradición de uso. Así eliges por lo que quieres apoyar, no entre una pared de frascos parecidos.
          </p>
          <p className="mt-5 text-xl leading-relaxed text-fg/85">
            Todo lo que ves aquí es <strong>puro, seguro y efectivo</strong>: fórmulas enfocadas, sin relleno, en cápsulas vegetarianas y con etiquetas que dicen exactamente qué hay dentro.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className={`g-${hero.goal} grad-goal grain relative grid place-items-center overflow-hidden rounded-[2.5rem] p-8 shadow-2xl`}>
            <ProductImage product={hero} width={360} className="animate-float [--r:0deg] mx-auto h-72 w-auto object-contain" />
            <p className="mt-4 font-display text-xl font-extrabold text-white">{hero.name}</p>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="pasos-title" className="mx-auto mt-24 max-w-6xl px-5">
        <Reveal>
          <SectionHeading eyebrow="Cómo funciona la línea" title={<span id="pasos-title">Tres ideas, de la raíz a tu mesa</span>} />
        </Reveal>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 80} className="h-full">
                <div className="card-lift h-full rounded-[2rem] bg-surface p-7 ring-1 ring-line">
                  <div className="flex items-center justify-between">
                    <span className="grad-sun grid size-14 place-items-center rounded-2xl text-night">
                      <Icon size={28} aria-hidden="true" />
                    </span>
                    <span className="font-display text-5xl font-extrabold text-sand">{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cobertura-title" className="mx-auto mt-24 max-w-6xl px-5">
        <Reveal>
          <SectionHeading eyebrow="Cobertura" title={<span id="cobertura-title">Lo que apoyan las catorce fórmulas</span>} />
        </Reveal>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g, i) => {
            const IconG = GOAL_ICONS[g.id];
            return (
              <li key={g.id}>
                <Reveal delay={i * 60} className="h-full">
                  <Link to={`/catalogo?objetivo=${g.slug}`} className={`g-${g.id} card-lift flex h-full items-start gap-4 rounded-[2rem] bg-surface p-6 ring-1 ring-line`}>
                    <span className="grad-goal grid size-12 shrink-0 place-items-center rounded-2xl text-white">
                      <IconG size={24} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-display text-lg font-extrabold">{g.label}</span>
                      <span className="mt-1 block text-sm text-muted">{g.blurb}</span>
                      <span className="text-goal mt-2 block text-sm font-bold">{countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'fórmula' : 'fórmulas'} →</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto mt-24 max-w-3xl px-5">
        <div className="rounded-[2rem] bg-sun/25 p-8 ring-1 ring-sun/60">
          <h2 className="text-2xl font-extrabold">Sobre esta página</h2>
          <p className="mt-3 leading-relaxed text-fg/80">
            Es una vitrina informativa: no hay carrito ni pago en línea, y los pedidos se coordinan por WhatsApp. Los nombres, precios, beneficios, ingredientes y fotos provienen de{' '}
            <a href={site.originalShop} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">
              la tienda original de la marca
            </a>
            ; los datos de contacto, las condiciones de envío y los textos legales aún deben ser confirmados por la marca antes de salir a producción.
          </p>
        </div>
      </section>
    </>
  );
}
