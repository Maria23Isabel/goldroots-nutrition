import { IconCheck, IconChevronRight, IconLeaf, IconMessageCircle, IconPackage } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { QrCard } from '@/components/QrCard';
import { Accordion, AddButton, buttonClass, GoalBadge, Pending, PriceTag, QtyStepper, Reveal, SectionHeading, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { findProduct, goalOf, related, savings, money, productPath } from '@/lib/products';
import { productMessage } from '@/lib/whatsapp';
import { NotFound } from './Legal';

export function Product() {
  const { slug } = useParams();
  const product = findProduct(slug);
  const [qty, setQty] = useState(1);

  usePageMeta({
    title: product ? `${product.name} — Gold Roots Nutrition` : 'Producto no encontrado — Gold Roots Nutrition',
    description: product ? `${product.headline}. ${product.summary}` : 'Esta página de producto no existe.',
    path: product ? productPath(product.slug) : '/catalogo',
    image: product?.image ?? undefined,
  });

  if (!product) return <NotFound />;
  const goal = goalOf(product.goal);
  const soon = product.price == null;
  const saved = savings(product);

  return (
    <div className={`g-${product.goal}`}>
      <div className="mx-auto max-w-6xl px-5 pt-28 sm:pt-32">
        <nav aria-label="Ruta de navegación" className="text-sm font-semibold text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-fg">
                Inicio
              </Link>
            </li>
            <IconChevronRight size={14} aria-hidden="true" />
            <li>
              <Link to="/catalogo" className="hover:text-fg">
                Catálogo
              </Link>
            </li>
            <IconChevronRight size={14} aria-hidden="true" />
            <li>
              <Link to={`/catalogo?objetivo=${goal.slug}`} className="hover:text-fg">
                {goal.short}
              </Link>
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="grad-goal grain relative grid aspect-[4/4.6] place-items-center overflow-hidden rounded-[2.5rem] shadow-2xl">
              <div className="animate-drift absolute -top-16 -left-16 size-72 rounded-full bg-white/30 blur-3xl" aria-hidden="true" />
              <ProductImage product={product} width={560} eager className="animate-float [--r:0deg] relative h-[28rem] max-h-[62vw] w-auto object-contain sm:max-h-none" />
              {saved > 0 && <span className="absolute top-5 left-5 rounded-full bg-paper px-4 py-1.5 text-sm font-extrabold text-night shadow-lg">Ahorras {money(saved)}</span>}
            </div>
          </div>

          <div>
            <GoalBadge goal={product.goal} />
            <h1 className="mt-4 text-4xl leading-[1.02] font-extrabold sm:text-6xl">{product.name}</h1>
            <p className="mt-3 text-lg font-semibold text-goal">{product.headline}</p>

            <div className="mt-6">
              <PriceTag product={product} big />
              <p className="mt-1 text-sm text-muted">{soon ? 'Escríbenos y te pasamos el precio y la disponibilidad.' : 'Precio en dólares. El envío se calcula en el chat.'}</p>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-fg/80">{product.summary}</p>

            <div className="mt-8 rounded-[2rem] bg-surface p-5 ring-1 ring-line sm:p-6">
              {soon ? (
                <WhatsAppButton text={productMessage(product)} className="w-full">
                  Consultar por esta fórmula
                </WhatsAppButton>
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
                  <AddButton product={product} qty={qty} variant="sun" className="min-w-52 flex-1" />
                </div>
              )}
              {!soon && (
                <WhatsAppButton text={productMessage(product)} variant="outline" className="mt-3 w-full">
                  Preguntar o pedir solo este por WhatsApp
                </WhatsAppButton>
              )}
              <p className="mt-3 text-center text-xs text-muted">Sin pago en línea: confirmamos disponibilidad, envío y pago contigo en el chat.</p>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { Icon: IconLeaf, text: product.format || 'Presentación por confirmar' },
                { Icon: IconPackage, text: 'Etiqueta clara' },
                { Icon: IconMessageCircle, text: 'Atención por WhatsApp' },
              ].map(({ Icon, text }) => (
                <li key={text} className="soft-goal text-goal flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-bold">
                  <Icon size={20} aria-hidden="true" className="shrink-0" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section aria-labelledby="beneficios-title" className="mt-24">
          <Reveal>
            <SectionHeading eyebrow="Qué te aporta" title={<span id="beneficios-title">Beneficios clave</span>} />
          </Reveal>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {product.benefits.map((b, i) => (
              <li key={b}>
                <Reveal delay={Math.min(i, 5) * 50}>
                  <div className="flex items-start gap-4 rounded-3xl bg-surface p-5 ring-1 ring-line">
                    <span className="grad-goal mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-white">
                      <IconCheck size={18} stroke={3} aria-hidden="true" />
                    </span>
                    <span className="leading-relaxed">{b}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="ingredientes-title" className="rounded-[2rem] bg-ink p-8 text-white">
            <h2 id="ingredientes-title" className="eyebrow !text-sun">
              Ingredientes
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {product.ingredients.map((i) => (
                <li key={i} className="rounded-full bg-white/10 px-4 py-2 font-display font-bold ring-1 ring-white/20">
                  {i}
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Presentación</dt>
                <dd className="text-right font-bold">{product.format || 'Por confirmar'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Objetivo</dt>
                <dd className="text-right font-bold">{goal.label}</dd>
              </div>
            </dl>
          </section>

          <section aria-label="Más información" className="border-t border-line">
            <Accordion title="¿Cómo hago el pedido?" defaultOpen>
              Agrégalo a «Mi pedido» y envíalo por WhatsApp. Te respondemos para confirmar disponibilidad, costo de envío y forma de pago.
            </Accordion>
            <Accordion title="Envíos y devoluciones">
              <p>El tiempo y el costo de envío dependen de tu ubicación y se acuerdan en el chat.</p>
              <p className="mt-3">
                <Pending>política de envíos y devoluciones</Pending>
              </p>
            </Accordion>
            <Accordion title="Aviso importante">
              Estas declaraciones no han sido evaluadas por la FDA de EE. UU. Este producto no está destinado a diagnosticar, tratar, curar ni prevenir ninguna enfermedad. Consulta a un profesional de la salud antes de usarlo, sobre todo si estás embarazada, en lactancia o tomas medicamentos.
            </Accordion>
          </section>
        </div>

        <div className="mt-12">
          <QrCard slug={product.slug} name={product.name} />
        </div>

        <section aria-labelledby="relacionados-title" className="mt-24">
          <Reveal>
            <SectionHeading eyebrow="Combínala con" title={<span id="relacionados-title">También te puede interesar</span>} />
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related(product).map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link to="/catalogo" className={buttonClass('outline')}>
              Ver todo el catálogo
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
