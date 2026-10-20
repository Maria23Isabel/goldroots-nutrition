import { IconCheck, IconChevronRight, IconLeaf, IconMessageCircle, IconPackage, IconShieldCheck, IconTruckDelivery } from '@tabler/icons-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link, useParams } from 'react-router';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { QrCard } from '@/components/QrCard';
import { Accordion, AddButton, buttonClass, d, GoalBadge, Pending, PriceTag, QtyStepper, Reveal, SectionHeading, TrustMarks, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { findProduct, goalOf, money, productPath, related, savings } from '@/lib/products';
import { productMessage } from '@/lib/whatsapp';
import { NotFound } from './Legal';

/* ─────────────────── barra de compra pegajosa (la usan las páginas de suplementos de arriba) ─────────────────── */
function StickyBuyBar({ product, buyRef }: { product: ReturnType<typeof findProduct>; buyRef: RefObject<HTMLDivElement | null> }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const box = buyRef.current;
    if (!box || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(box);
    return () => io.disconnect();
  }, [buyRef, product?.slug]);
  if (!product || !show) return null;
  return (
    <div className="fixed inset-x-0 bottom-[5.75rem] z-40 px-4 sm:bottom-6">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-line-strong bg-surface px-4 py-3 shadow-[0_16px_40px_-18px_rgb(35_35_31/0.35)] [animation:sheet-up_0.25s_both]">
        <div className="min-w-0">
          <p className="truncate font-display text-[0.95rem] font-medium">{product.name}</p>
          <p className="text-[0.8rem] text-muted">{product.price == null ? 'Precio por confirmar' : `${money(product.price)} · ${product.format}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <WhatsAppButton text={productMessage(product)} variant="outline" className="max-sm:hidden">
            Preguntar
          </WhatsAppButton>
          {product.price != null && <AddButton product={product} compact variant="primary" quiet />}
        </div>
      </div>
    </div>
  );
}

export function Product() {
  const { slug } = useParams();
  const product = findProduct(slug);
  const [qty, setQty] = useState(1);
  const buyBox = useRef<HTMLDivElement>(null);

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
      <div className="wrap pt-8 sm:pt-10">
        <nav aria-label="Ruta de navegación" className="text-[0.82rem] text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="transition-colors hover:text-fg">
                Inicio
              </Link>
            </li>
            <IconChevronRight size={13} aria-hidden="true" />
            <li>
              <Link to="/catalogo" className="transition-colors hover:text-fg">
                Catálogo
              </Link>
            </li>
            <IconChevronRight size={13} aria-hidden="true" />
            <li>
              <Link to={`/catalogo?objetivo=${goal.slug}`} className="transition-colors hover:text-fg">
                {goal.short}
              </Link>
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* Foto protagonista sobre un bloque pastel plano, sin degradado ni reflejo. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="goal-block grid aspect-[4/4.2] place-items-center overflow-hidden rounded-2xl">
              <ProductImage product={product} width={560} eager className="float h-[85%] w-auto object-contain" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 text-[0.82rem] text-muted">
              <span className="flex items-center gap-2">
                <IconPackage size={15} aria-hidden="true" /> {product.format || 'Presentación por confirmar'}
              </span>
              {saved > 0 && <span className="font-semibold text-wa-deep">Ahorras {money(saved)}</span>}
            </div>
          </div>

          <div>
            <div className="rise" style={d(0)}>
              <GoalBadge goal={product.goal} />
            </div>
            <h1 className="rise mt-3 text-[1.9rem] leading-[1.15] font-medium sm:text-[2.4rem]" style={d(60)}>
              {product.name}
            </h1>
            <p className="rise mt-2 text-[1.05rem] leading-relaxed text-muted" style={d(130)}>
              {product.headline}
            </p>

            <div className="rise mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-line py-4" style={d(200)}>
              <PriceTag product={product} big />
              <p className="text-[0.82rem] text-muted">{soon ? 'Escríbenos y te pasamos el precio y la disponibilidad.' : 'Precio en dólares. El envío se calcula en el chat.'}</p>
            </div>

            <p className="rise mt-5 text-[1rem] leading-relaxed text-fg/90" style={d(260)}>
              {product.summary}
            </p>

            <div ref={buyBox} className="mt-6 rounded-2xl border border-line bg-surface p-5">
              {soon ? (
                <WhatsAppButton text={productMessage(product)} className="w-full justify-center">
                  Consultar por esta fórmula
                </WhatsAppButton>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
                  <AddButton product={product} qty={qty} variant="primary" className="min-w-48 flex-1" />
                </div>
              )}
              {!soon && (
                <WhatsAppButton text={productMessage(product)} variant="outline" className="mt-2.5 w-full justify-center">
                  Preguntar o pedir solo este por WhatsApp
                </WhatsAppButton>
              )}
              <p className="mt-3 text-center text-[0.78rem] text-muted">Sin pago en línea: confirmamos disponibilidad, envío y pago contigo en el chat.</p>
            </div>

            <div className="mt-6">
              <TrustMarks
                items={[
                  { Icon: IconLeaf, text: product.format || 'Cápsulas vegetarianas' },
                  { Icon: IconShieldCheck, text: 'Etiqueta ingrediente por ingrediente' },
                  { Icon: IconTruckDelivery, text: 'Envío coordinado contigo' },
                  { Icon: IconMessageCircle, text: 'Atención por WhatsApp' },
                ]}
              />
            </div>
          </div>
        </div>

        <section aria-labelledby="beneficios-title" className="mt-16 border-t border-line pt-12">
          <Reveal>
            <SectionHeading eyebrow="Qué te aporta" title={<span id="beneficios-title">Beneficios declarados en la etiqueta</span>} lead="Lo que la fórmula dice apoyar, en las mismas palabras del fabricante. Un suplemento acompaña: no reemplaza una consulta profesional." />
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.benefits.map((b, i) => (
              <li key={b}>
                <Reveal delay={Math.min(i, 5) * 45}>
                  <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                    <span className="text-goal mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--gb)]">
                      <IconCheck size={14} stroke={2.6} aria-hidden="true" />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed">{b}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 grid gap-10 border-t border-line pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <section aria-labelledby="ingredientes-title">
            <SectionHeading eyebrow="Ficha" title={<span id="ingredientes-title">Ingredientes</span>} />
            <ul className="mt-6 flex flex-wrap gap-2">
              {product.ingredients.map((i) => (
                <li key={i} className="rounded-lg bg-sand px-3 py-1.5 text-[0.88rem] font-medium text-fg">
                  {i}
                </li>
              ))}
            </ul>
            <dl className="mt-7 divide-y divide-line border-y border-line text-[0.9rem]">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Presentación</dt>
                <dd className="text-right font-medium">{product.format || 'Por confirmar'}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Objetivo</dt>
                <dd className="text-right font-medium">
                  <Link to={`/catalogo?objetivo=${goal.slug}`} className="transition-colors hover:text-accent">
                    {goal.label}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Tipo</dt>
                <dd className="text-right font-medium">Suplemento alimenticio</dd>
              </div>
            </dl>
          </section>

          <section aria-label="Más información">
            <div className="border-t border-line">
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
            </div>
          </section>
        </div>

        <div className="mt-10">
          <QrCard slug={product.slug} name={product.name} />
        </div>

        <section aria-labelledby="relacionados-title" className="mt-16 border-t border-line pt-12">
          <Reveal>
            <SectionHeading eyebrow="Combínala con" title={<span id="relacionados-title">Otras fórmulas de la línea</span>} />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related(product).map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/catalogo" className={buttonClass('outline')}>
              Ver todo el catálogo
            </Link>
          </div>
        </section>
      </div>

      <StickyBuyBar product={product} buyRef={buyBox} />
    </div>
  );
}
