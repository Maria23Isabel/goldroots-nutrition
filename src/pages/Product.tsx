import { IconCheck, IconChevronRight, IconPlus, IconMessageCircle } from '@tabler/icons-react';
import { Link, useParams } from 'react-router';
import { ProductCard } from '@/components/ProductCard';
import { QrCard } from '@/components/QrCard';
import { buttonClass, Pending, SectionHeading, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { asset, findProduct, goalLabel, money, percentOff, related, savings } from '@/lib/products';
import { productMessage, waLink } from '@/lib/whatsapp';
import { NotFound } from './Legal';

function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line py-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-bold tracking-wider text-forest uppercase">
        {title}
        <IconPlus size={18} className="transition group-open:rotate-45" aria-hidden="true" />
      </summary>
      <div className="mt-3 leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export function Product() {
  const { slug } = useParams();
  const product = findProduct(slug);

  usePageMeta({
    title: product ? `${product.name} — Gold Roots Nutrition` : 'Product not found — Gold Roots Nutrition',
    description: product ? `${product.headline}. ${product.summary}` : 'This product page does not exist.',
    image: product?.image ?? undefined,
    path: `product/${slug ?? ''}`,
  });

  if (!product) return <NotFound />;

  const soon = product.price == null;
  const off = percentOff(product);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-forest">Home</Link>
        <IconChevronRight size={14} aria-hidden="true" />
        <Link to="/catalog" className="hover:text-forest">Catalog</Link>
        <IconChevronRight size={14} aria-hidden="true" />
        <Link to={`/catalog?goal=${product.goal}`} className="hover:text-forest">
          {goalLabel(product.goal)}
        </Link>
        <IconChevronRight size={14} aria-hidden="true" />
        <span className="font-semibold text-forest">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-sand to-white">
            {off > 0 && <span className="absolute top-5 left-5 z-10 rounded-full bg-gold px-4 py-1.5 text-sm font-bold tracking-wider text-forest uppercase">Save {off}%</span>}
            {product.image && (
              <img
                src={asset(product.image)}
                alt={product.name}
                width={600}
                height={900}
                decoding="async"
                className="mx-auto aspect-[4/5] w-full max-w-lg object-contain p-8 mix-blend-multiply transition duration-500 hover:scale-110"
              />
            )}
          </div>
          <ul className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
            {[
              ['Goal', goalLabel(product.goal)],
              ['Format', product.format || '—'],
              ['Price', soon ? 'Soon' : money(product.price!)],
            ].map(([k, v]) => (
              <li key={k} className="rounded-2xl border border-line bg-white px-3 py-3">
                <p className="text-xs font-bold tracking-[0.16em] text-muted uppercase">{k}</p>
                <p className="mt-1 font-semibold text-forest">{v}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">{goalLabel(product.goal)}</p>
          <h1 className="mt-3 font-sans text-3xl leading-tight font-extrabold tracking-wide text-forest uppercase sm:text-4xl">{product.name}</h1>
          <p className="mt-3 font-serif text-xl text-moss italic">{product.headline}</p>

          <p className="mt-6 flex flex-wrap items-baseline gap-3">
            {soon ? (
              <span className="text-2xl font-bold text-muted">Coming soon</span>
            ) : (
              <>
                <span className="text-4xl font-bold text-forest">{money(product.price!)}</span>
                {product.compareAt && <s className="text-xl text-muted">{money(product.compareAt)}</s>}
                {savings(product) > 0 && <span className="rounded-full bg-moss/10 px-3 py-1 text-sm font-bold text-moss">You save {money(savings(product))}</span>}
              </>
            )}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted">{product.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsAppButton href={waLink(productMessage(product))} className="flex-1 sm:min-w-72 sm:flex-none">
              {soon ? 'Ask about this formula' : 'Order on WhatsApp'}
            </WhatsAppButton>
            <Link to={`/contact?product=${product.slug}`} className={buttonClass('outline')}>
              <IconMessageCircle size={18} aria-hidden="true" /> Write a message
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted">No cart and no online checkout: we confirm availability, shipping and payment with you in the chat.</p>

          <div className="mt-10">
            <QrCard slug={product.slug} name={product.name} />
          </div>

          <div className="mt-10">
            <h2 className="font-sans text-sm font-bold tracking-[0.2em] text-gold-deep uppercase">Key benefits</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-forest">
                  <IconCheck size={20} className="mt-0.5 shrink-0 text-moss" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <Accordion title="Ingredients" open>
              <ul className="flex flex-wrap gap-2">
                {product.ingredients.map((i) => (
                  <li key={i} className="rounded-full bg-sand px-4 py-1.5 text-sm font-semibold text-forest">
                    {i}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Shipping & returns">
              Delivery times, costs and the returns policy belong to the brand and are not decided for this page.
              <Pending>Shipping and returns text.</Pending>
            </Accordion>
            <Accordion title="Important information">
              These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease. Consult your healthcare
              professional before use. <em>[Legal text to be reviewed before launch.]</em>
            </Accordion>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <SectionHeading eyebrow="Keep going" title="More formulas worth a look" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {related(product).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
