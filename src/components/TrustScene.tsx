// Experiencia D — «Calidad y confianza». Aquí lo que aparece no se funde: primero se traza el riel, después van
// cayendo los nodos uno por uno y las cifras del catálogo cuentan hacia arriba. Solo datos comprobables en la web.
import { IconFlask, IconLink, IconRoute, IconShieldCheck, type Icon } from '@tabler/icons-react';
import * as m from 'motion/react-m';
import { Link } from 'react-router';
import { CountUp, SectionHeading } from '@/components/ui';
import { EASE_OUT } from '@/lib/motion';
import { trustFacts } from '@/lib/showcase';

const facts = trustFacts();

const RAIL = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.5 } } };
const DRAW = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE_OUT } } };
const NODE = { hidden: { opacity: 0, scale: 0.6, y: 18 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } } };
const TEXT = { hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, show: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.6, ease: EASE_OUT } } };

/* Cada garantía va atada a algo que se puede abrir y comprobar en esta misma web. */
const items: { Icon: Icon; title: string; text: string; check: string; to: string }[] = [
  { Icon: IconFlask, title: 'Fórmula completa', text: `Ingredientes, presentación y objetivo declarado en cada una de las ${facts.formulas} fichas.`, check: 'Ver una ficha', to: '/producto/zinc-triple-play' },
  { Icon: IconRoute, title: 'Información primero', text: 'Sin precios, sin carrito y sin presión: la página describe, no vende.', check: 'Recorrer el catálogo', to: '/catalogo' },
  { Icon: IconLink, title: 'Rutas que permanecen', text: 'Cada ficha conserva una dirección propia para volver a consultarla cuando quieras.', check: 'Preguntar por una ficha', to: '/contacto' },
  { Icon: IconShieldCheck, title: 'Límites claros', text: 'Suplementos alimenticios: no sustituyen una dieta variada ni la consulta profesional.', check: 'Leer los avisos', to: '/legal/terminos' },
];

const cifras = [
  { to: facts.formulas, label: 'fórmulas documentadas' },
  { to: facts.goals, label: 'objetivos para explorar' },
  { to: facts.sheets, label: 'fichas con su fotografía' },
];

export function TrustScene() {
  return (
    <section className="border-y border-line bg-surface" aria-labelledby="quality-title">
      <div className="wrap section">
        <m.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-12%' }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
          <m.div variants={TEXT}>
            <SectionHeading center eyebrow="Nuestra calidad" title={<span id="quality-title">Lo que esta página sí puede garantizar</span>} lead="Una declaración de calidad solo es útil si se puede comprobar en la propia web. Esto es lo que se puede verificar aquí, fórmula por fórmula." />
          </m.div>
          <m.ul variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }} className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {cifras.map((cifra) => (
              <m.li key={cifra.label} variants={NODE}>
                <p className="font-display text-[3.2rem] leading-none text-night">
                  <CountUp to={cifra.to} />
                </p>
                <p className="mt-2 text-[0.82rem] font-medium text-muted">{cifra.label}</p>
              </m.li>
            ))}
          </m.ul>
        </m.div>

        {/* El riel: la línea se estira y los cuatro nodos caen encima, en orden. */}
        <m.div variants={RAIL} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-18%' }} className="relative mt-16">
          <m.span aria-hidden="true" variants={DRAW} className="absolute top-6 right-0 left-0 hidden h-px origin-left bg-gradient-to-r from-accent via-line-strong to-transparent lg:block" />
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {items.map(({ Icon, title, text, check, to }) => (
              <m.li key={title} variants={RAIL} className="relative">
                <m.span variants={NODE} className="relative z-10 grid size-12 place-items-center rounded-full border border-line-strong bg-surface text-accent-deep">
                  <Icon size={22} stroke={1.5} aria-hidden="true" />
                </m.span>
                <m.p variants={TEXT} className="mt-5 text-[1.12rem] font-medium">
                  {title}
                </m.p>
                <m.p variants={TEXT} className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                  {text}
                </m.p>
                <m.div variants={TEXT} className="mt-4">
                  <Link to={to} className="link-swipe text-[0.8rem] font-semibold text-night">
                    {check}
                  </Link>
                </m.div>
              </m.li>
            ))}
          </ul>
        </m.div>
      </div>
    </section>
  );
}
