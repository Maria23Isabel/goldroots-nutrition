import { IconCheck, IconChevronRight, IconLeaf, IconPackage } from '@tabler/icons-react';
import { Link, useParams } from 'react-router';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { Accordion, buttonClass, d, GoalBadge, Reveal, SectionHeading, TrustMarks } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { findProduct, goalOf, productPath, related } from '@/lib/products';
import { NotFound } from './NotFound';

export function Product() {
  const { slug } = useParams();
  const product = findProduct(slug);

  usePageMeta({
    title: product ? `${product.name} — Gold Roots Nutrition` : 'Producto no encontrado — Gold Roots Nutrition',
    description: product ? `${product.headline}. ${product.summary}` : 'Esta página de producto no existe.',
    path: product ? productPath(product.slug) : '/catalogo',
    image: product?.image ?? undefined,
  });

  if (!product) return <NotFound />;
  const goal = goalOf(product.goal);

  return (
    <div className={`g-${product.goal}`}>
      <div className="wrap pt-7 sm:pt-10">
        <nav aria-label="Ruta de navegación" className="text-[0.8rem] text-muted">
          <ol className="flex flex-wrap items-center gap-1.5"><li><Link to="/" className="hover:text-night">Inicio</Link></li><IconChevronRight size={13} aria-hidden="true" /><li><Link to="/catalogo" className="hover:text-night">Catálogo</Link></li><IconChevronRight size={13} aria-hidden="true" /><li><Link to={`/catalogo?objetivo=${goal.slug}`} className="hover:text-night">{goal.short}</Link></li></ol>
        </nav>

        <div className="mt-7 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="goal-block relative grid aspect-[4/4.25] place-items-center overflow-hidden rounded-[2rem]">
              <span className="absolute inset-[15%] rounded-full bg-white/42 blur-2xl" aria-hidden="true" />
              <ProductImage product={product} width={620} eager className="product-float absolute inset-0 size-full object-contain p-6" />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-[0.82rem] text-muted"><IconPackage size={16} aria-hidden="true" /><span>{product.format || 'Presentación por confirmar'}</span></div>
          </div>

          <div className="pb-4 lg:pt-8">
            <div className="rise" style={d(0)}><GoalBadge goal={product.goal} /></div>
            <h1 className="rise mt-5 text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.96] tracking-[-0.045em]" style={d(60)}>{product.name}</h1>
            <p className="rise mt-5 text-[1.1rem] leading-relaxed text-muted" style={d(120)}>{product.headline}</p>
            <div className="rule-gold rise mt-7 w-32" style={d(150)} aria-hidden="true" />
            <p className="rise mt-7 text-[1rem] leading-[1.8] text-fg/88" style={d(180)}>{product.summary}</p>
            <div className="rise mt-8" style={d(240)}>
              <TrustMarks items={[{ Icon: IconLeaf, text: goal.label }, { Icon: IconPackage, text: product.format || 'Presentación por confirmar' }]} />
            </div>
            <div className="rise mt-9 flex flex-wrap gap-3" style={d(300)}><a href="#ficha" className={buttonClass('primary')}>Leer la ficha completa</a><Link to="/catalogo" className={buttonClass('outline')}>Volver al catálogo</Link></div>
          </div>
        </div>

        <section id="ficha" aria-labelledby="beneficios-title" className="mt-20 border-t border-line pt-14">
          <Reveal><SectionHeading eyebrow="Información del catálogo" title={<span id="beneficios-title">Beneficios declarados para la fórmula</span>} lead="Se presentan como información de bienestar aportada por el catálogo. No son promesas médicas ni sustituyen una consulta profesional." /></Reveal>
          <ul className="mt-9 grid gap-3 sm:grid-cols-2">{product.benefits.map((benefit, index) => <li key={benefit}><Reveal delay={Math.min(index, 5) * 40}><div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4"><span className="text-goal mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--gb)]"><IconCheck size={14} stroke={2.5} aria-hidden="true" /></span><span className="text-[0.94rem] leading-relaxed">{benefit}</span></div></Reveal></li>)}</ul>
        </section>

        <div className="mt-16 grid gap-12 border-t border-line pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <section aria-labelledby="ingredients-title">
            <SectionHeading eyebrow="Composición" title={<span id="ingredients-title">Ingredientes</span>} />
            <ul className="mt-7 flex flex-wrap gap-2">{product.ingredients.map((ingredient) => <li key={ingredient} className="rounded-full border border-line-strong bg-surface px-4 py-2 text-[0.86rem] font-medium">{ingredient}</li>)}</ul>
            <dl className="mt-8 divide-y divide-line border-y border-line text-[0.9rem]"><div className="flex justify-between gap-4 py-4"><dt className="text-muted">Presentación</dt><dd className="text-right font-semibold">{product.format || 'Por confirmar'}</dd></div><div className="flex justify-between gap-4 py-4"><dt className="text-muted">Objetivo</dt><dd className="text-right font-semibold"><Link to={`/catalogo?objetivo=${goal.slug}`} className="hover:text-accent-deep">{goal.label}</Link></dd></div><div className="flex justify-between gap-4 py-4"><dt className="text-muted">Tipo</dt><dd className="text-right font-semibold">Suplemento alimenticio</dd></div></dl>
          </section>
          <section aria-label="Avisos de la ficha" className="border-t border-line">
            <Accordion title="Cómo leer esta información" defaultOpen>Revisa la etiqueta física del producto antes de usarlo. La ficha resume el contenido disponible en el catálogo y puede actualizarse cuando la marca aporte nueva información.</Accordion>
            <Accordion title="Consulta profesional">Habla con un profesional de la salud antes de empezar cualquier suplemento, sobre todo si estás embarazada, en lactancia, tomas medicamentos o tienes una condición de salud.</Accordion>
            <Accordion title="Aviso importante">Estas declaraciones no han sido evaluadas por la FDA de EE. UU. Este producto no está destinado a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.</Accordion>
          </section>
        </div>

        <section aria-labelledby="related-title" className="mt-20 border-t border-line pt-14">
          <Reveal><SectionHeading eyebrow="Continúa explorando" title={<span id="related-title">Otras fórmulas de la línea</span>} /></Reveal>
          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related(product).map((item) => <li key={item.slug}><ProductCard product={item} /></li>)}</ul>
        </section>
      </div>
    </div>
  );
}
