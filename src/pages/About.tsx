import { IconArrowRight, IconBook2, IconLayersIntersect, IconLeaf, IconLink } from '@tabler/icons-react';
import { Link } from 'react-router';
import { ProductImage } from '@/components/ProductCard';
import { PageHero } from '@/components/PageHero';
import * as m from 'motion/react-m';
import { buttonClass, CountUp, DrawLine, LeafMark, Reveal, SectionHeading } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { useCatalogState } from '@/lib/catalog';
import { asset } from '@/lib/products';
import { pickVaried, trustFacts } from '@/lib/showcase';

const pillars = [
  { Icon: IconLeaf, title: 'Raíz botánica', text: 'La identidad conecta el origen de los ingredientes con una presentación contemporánea y sobria.' },
  { Icon: IconLayersIntersect, title: 'Sistema claro', text: 'Una arquitectura común organiza objetivos, fórmulas, ingredientes y presentaciones.' },
  { Icon: IconBook2, title: 'Información visible', text: 'Las fichas reúnen el contenido disponible sin ocultarlo detrás de un flujo de compra.' },
  { Icon: IconLink, title: 'Continuidad digital', text: 'Cada ficha conserva su propia dirección, accesible para futuras consultas.' },
];

export function About() {
  usePageMeta({ title: 'La marca — Gold Roots Nutrition', description: 'Conoce el enfoque visual e informativo de Gold Roots Nutrition y la estructura de su línea de suplementos.', path: '/nosotros', image: 'brand/hero-gold.webp' });
  const products = useCatalogState().catalog?.products ?? [];
  const [first, second] = pickVaried(products, 2);
  const facts = trustFacts(products);

  return (
    <>
      <PageHero eyebrow="Gold Roots Nutrition" title={<>Una identidad nacida entre <span className="text-accent-deep">raíces y bienestar.</span></>} lead="La marca presenta una línea organizada por objetivos, con una estética botánica y una lectura contemporánea de sus fórmulas.">
        <Link to="/catalogo" className={buttonClass('primary')}>Explorar la línea <IconArrowRight size={17} aria-hidden="true" /></Link>
      </PageHero>

      <section className="wrap section">
        <div className="grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <Reveal kind="slide"><div><p className="eyebrow text-accent-deep">El punto de partida</p><h2 className="mt-4 text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.02]">Una colección que se entiende como un sistema.</h2><p className="mt-6 text-[1.05rem] leading-[1.8] text-muted">Gold Roots reúne {products.length > 0 ? `${products.length} fórmulas` : 'sus fórmulas'} en seis territorios de bienestar. El sitio pone esa estructura en primer plano para que cada visitante pueda recorrerla por objetivo, ingrediente o producto.</p></div></Reveal>
          <Reveal kind="mask" delay={80}><div className="relative"><LeafMark className="absolute -top-6 -left-2 size-10 opacity-90" /><div className="overflow-hidden rounded-[2rem] bg-sand"><img src={asset('brand/lineup-premium.webp')} srcSet={`${asset('brand/lineup-premium-900.webp')} 900w, ${asset('brand/lineup-premium.webp')} 1600w`} sizes="(max-width: 1024px) 92vw, 46vw" alt="La línea Gold Roots con sus ingredientes, en la composición oficial de la marca" width="1600" height="914" loading="lazy" decoding="async" className="block h-auto w-full" /></div></div></Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-night text-white">
        <div className="wrap grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1fr] lg:items-center">
          {/* Sobre el bloque tinta el multiply de la foto la dejaría invisible: cada frasco va en su placa marfil. */}
          <div className="relative h-[32rem]">
            <m.div initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -15% 0px' }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }} className="absolute bottom-0 left-[5%] h-[86%] w-[47%] -rotate-2 rounded-[1.75rem] bg-gradient-to-b from-white to-[#efe9dc] p-4 shadow-[0_34px_60px_-32px_rgb(6_12_22/0.9)] ring-1 ring-white/15">
              {first && <ProductImage product={first} width={430} className="mx-auto h-full w-auto" />}
            </m.div>
            <m.div initial={{ opacity: 0, y: 90 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -15% 0px' }} transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }} className="absolute right-[3%] bottom-6 h-[68%] w-[40%] rotate-3 rounded-[1.75rem] bg-gradient-to-b from-white to-[#efe9dc] p-4 shadow-[0_34px_60px_-32px_rgb(6_12_22/0.9)] ring-1 ring-white/15">
              {second && <ProductImage product={second} width={390} className="mx-auto h-full w-auto" />}
            </m.div>
          </div>
          <Reveal><div><p className="eyebrow !text-accent">La línea en números</p><h2 className="mt-4 text-[clamp(2.2rem,4.5vw,4.4rem)] leading-[0.98]">Pocas capas. Más contexto.</h2><p className="mt-6 max-w-xl text-[1.03rem] leading-relaxed text-white/64">La experiencia evita precios y mecanismos de compra para concentrarse en lo esencial: qué es cada fórmula, qué contiene y cómo se relaciona con el resto de la colección.</p><dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/14 pt-8"><div><dd className="font-display text-5xl text-accent">{facts.formulas > 0 ? <CountUp to={facts.formulas} /> : '—'}</dd><dt className="mt-2 text-[0.8rem] text-white/55">fórmulas</dt></div><div><dd className="font-display text-5xl text-accent">{facts.goals > 0 ? <CountUp to={facts.goals} /> : '—'}</dd><dt className="mt-2 text-[0.8rem] text-white/55">objetivos</dt></div></dl></div></Reveal>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="pillars-title">
        <Reveal><SectionHeading eyebrow="Principios de la experiencia" title={<span id="pillars-title">Una marca que se recorre con calma</span>} /><DrawLine className="mt-8 max-w-md" delay={250} /></Reveal>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{pillars.map(({ Icon, title, text }, index) => <li key={title}><Reveal kind={index % 2 === 0 ? 'rise' : 'mask'} delay={index * 90}><DrawLine className="mb-6" delay={index * 90 + 200} /><span className="grid size-12 place-items-center rounded-2xl bg-sand text-accent-deep"><Icon size={22} stroke={1.7} aria-hidden="true" /></span><h3 className="mt-5 text-[1.12rem]">{title}</h3><p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{text}</p></Reveal></li>)}</ul>
      </section>

      <section className="wrap pb-4"><Reveal kind="scale"><div className="rounded-[2rem] border border-line bg-surface p-8 sm:p-12"><p className="eyebrow text-accent-deep">Transparencia editorial</p><h2 className="mt-4 max-w-3xl text-[2rem] leading-tight sm:text-[3rem]">El sitio presenta lo respaldado por el catálogo y marca con claridad sus límites.</h2><p className="mt-5 max-w-3xl text-[0.98rem] leading-relaxed text-muted">No se publican certificaciones, condiciones comerciales ni datos institucionales que la marca no haya confirmado. La información de bienestar no reemplaza la consulta de un profesional de la salud.</p></div></Reveal></section>
    </>
  );
}
