import { IconArrowRight, IconFlask, IconLeaf, IconPackage } from '@tabler/icons-react';
import { Link } from 'react-router';
import { ProductImage } from '@/components/ProductCard';
import { PageHero } from '@/components/PageHero';
import { buttonClass, GOAL_ICONS, Reveal, SectionHeading } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { countByGoal, findProduct, GOALS, PRODUCTS } from '@/lib/products';

const STEPS = [
  { Icon: IconLeaf, title: 'Ingredientes de raíz', text: 'Plantas, hongos y minerales con una larga historia de uso: maca, shilajit, cúrcuma, cardo mariano, melena de león.' },
  { Icon: IconFlask, title: 'Una fórmula, un trabajo', text: 'Cada producto se construye alrededor de un objetivo claro, sin relleno innecesario y con etiquetas que dicen lo que lleva.' },
  { Icon: IconPackage, title: 'Directo a ti', text: 'Eliges, armas tu pedido y lo coordinas por WhatsApp: disponibilidad, envío y pago, sin intermediarios.' },
];

export function About() {
  usePageMeta({
    title: 'Nosotros — Gold Roots Nutrition',
    description: 'Ingredientes de raíz y fórmulas con criterio: qué hace Gold Roots Nutrition y cómo se usa esta vitrina.',
    path: '/nosotros',
  });
  const hero = findProduct('shilajit-gold')!;

  return (
    <>
      <PageHero eyebrow="Nuestra historia" title="Ingredientes de raíz. Fórmulas con criterio." lead="Gold Roots Nutrition hace suplementos para quienes esperan más que lo común: pocas fórmulas, cada una con un trabajo claro.">
        <Link to="/catalogo" className={buttonClass('primary')}>
          Ver el catálogo <IconArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link to="/mayoristas" className={buttonClass('outline')}>
          Mayoristas
        </Link>
      </PageHero>

      <section className="wrap grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <p className="text-[1.15rem] leading-relaxed text-fg/90">
            La línea se mantiene pequeña a propósito: <strong>{PRODUCTS.length} fórmulas</strong>, cada una pensada para un objetivo claro y construida con ingredientes de larga tradición de uso. Así eliges por lo que quieres apoyar, no entre una pared de frascos parecidos.
          </p>
          <p className="mt-5 text-[1.15rem] leading-relaxed text-fg/90">
            Todo lo que ves aquí es <strong>claro y verificable</strong>: fórmulas enfocadas, sin relleno, en cápsulas vegetarianas y con etiquetas que dicen exactamente qué hay dentro.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className={`g-${hero.goal} goal-block grid place-items-center overflow-hidden rounded-2xl p-8`}>
            <ProductImage product={hero} width={360} className="mx-auto h-64 w-auto object-contain" />
            <p className="mt-3 font-display text-[1.05rem] font-medium text-[color:var(--gi)]">{hero.name}</p>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="pasos-title" className="border-y border-line bg-surface">
        <div className="wrap section">
          <Reveal>
            <SectionHeading eyebrow="Cómo funciona la línea" title={<span id="pasos-title">Tres ideas, de la raíz a tu mesa</span>} />
          </Reveal>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map(({ Icon, title, text }, i) => (
              <li key={title}>
                <Reveal delay={i * 70} className="h-full">
                  <div className="h-full border-t border-line pt-5">
                    <div className="flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-xl bg-sand text-fg">
                        <Icon size={20} stroke={1.8} aria-hidden="true" />
                      </span>
                      <span className="font-display text-[1.6rem] leading-none font-medium text-line-strong">0{i + 1}</span>
                    </div>
                    <h3 className="mt-4 font-display text-[1.08rem] font-medium">{title}</h3>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cobertura-title" className="wrap section">
        <Reveal>
          <SectionHeading eyebrow="Cobertura" title={<span id="cobertura-title">Lo que apoyan las {PRODUCTS.length} fórmulas</span>} />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g, i) => {
            const IconG = GOAL_ICONS[g.id];
            const n = countByGoal(g.id);
            return (
              <li key={g.id}>
                <Reveal delay={Math.min(i, 5) * 55} className="h-full">
                  <Link to={`/catalogo?objetivo=${g.slug}`} className={`g-${g.id} card card-lift flex h-full items-start gap-4 p-5`}>
                    <span className="goal-block text-goal grid size-10 shrink-0 place-items-center rounded-lg">
                      <IconG size={19} stroke={1.9} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[1.02rem] font-medium">{g.label}</span>
                      <span className="mt-0.5 block text-[0.88rem] leading-snug text-muted">{g.blurb}</span>
                      <span className="text-goal mt-2 block text-[0.82rem] font-semibold">{n} {n === 1 ? 'fórmula' : 'fórmulas'} →</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="wrap pb-14">
        <div className="rounded-2xl border border-line bg-sand p-7">
          <h2 className="font-display text-[1.2rem] font-medium">Sobre esta página</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
            Es una vitrina informativa: no hay carrito ni pago en línea, y los pedidos se coordinan por WhatsApp. Los nombres, precios, beneficios, ingredientes y fotos provienen del catálogo de la marca; los datos de contacto, las condiciones de envío y los textos legales aún deben ser confirmados por la marca antes de darse por definitivos.
          </p>
        </div>
      </section>
    </>
  );
}
