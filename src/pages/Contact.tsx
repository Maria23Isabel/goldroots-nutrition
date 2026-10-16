import { IconBrandInstagram, IconBrandWhatsapp, IconClockHour4, IconMapPin, IconTruckDelivery } from '@tabler/icons-react';
import { Link, useSearchParams } from 'react-router';
import { InquiryForm } from '@/components/InquiryForm';
import { buttonClass, SectionHeading, ToConfirm, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { findProduct } from '@/lib/products';
import { site } from '@/lib/site';
import { GENERAL_MESSAGE, productMessage, waLink } from '@/lib/whatsapp';

const CHANNELS = [
  { icon: IconBrandWhatsapp, label: 'WhatsApp', value: site.whatsapp ? `+${site.whatsapp}` : null, hint: 'Questions and orders, one chat' },
  { icon: IconClockHour4, label: 'Hours', value: site.hours, hint: 'When the brand answers' },
  { icon: IconTruckDelivery, label: 'Shipping & payment', value: null, hint: 'Confirmed with you in the chat' },
  { icon: IconMapPin, label: 'Location', value: site.address, hint: 'Where the brand ships from' },
];

export function Contact() {
  const [params] = useSearchParams();
  const product = findProduct(params.get('product') ?? undefined);

  usePageMeta({
    title: 'Contact — Gold Roots Nutrition',
    description: 'Questions about a formula, an order or stocking the line: message Gold Roots Nutrition on WhatsApp.',
    path: '/contact',
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <header className="hero-bg relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-14">
        <div className="hero-dots pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="eyebrow !text-gold">Contact</p>
          <h1 className="mt-3 text-4xl sm:text-6xl">
            Let’s talk on <span className="gold-text">WhatsApp</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/75">Ask about a formula, place an order or stock the line. There is no checkout here: we reply in the chat and arrange availability, shipping and payment with you.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton href={waLink(product ? productMessage(product) : GENERAL_MESSAGE)}>{product ? 'Ask about this formula' : 'Open WhatsApp chat'}</WhatsAppButton>
            <Link to="/wholesale" className={buttonClass('ghost-light')}>
              Wholesale inquiry
            </Link>
          </div>
          {product && (
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-white/80">
              <span className="font-bold tracking-wider text-gold uppercase">About this formula:</span>
              <Link to={`/product/${product.slug}`} className="font-semibold text-white underline underline-offset-4 hover:text-gold-soft">
                {product.name}
              </Link>
            </p>
          )}
        </div>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Contact details">
        {CHANNELS.map((c) => (
          <div key={c.label} className="rounded-3xl border border-line bg-white p-6">
            <span className="gold-fill grid size-11 place-items-center rounded-full text-forest">
              <c.icon size={21} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-sm font-bold tracking-[0.16em] text-forest uppercase">{c.label}</h2>
            {c.value ? <p className="mt-1 font-semibold break-all text-forest">{c.value}</p> : <p className="mt-2"><ToConfirm /></p>}
            <p className="mt-2 text-sm text-muted">{c.hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Write to us" title="Ask anything about the line" lead="Product questions, wholesale, or a formula a customer keeps asking you for. Your message opens in WhatsApp, ready to send." />
          <ul className="mt-8 grid gap-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <IconBrandInstagram size={17} className="text-gold-deep" aria-hidden="true" /> Social accounts: {site.instagram ? site.instagram : 'not confirmed yet'}
            </li>
          </ul>
        </div>
        <InquiryForm kind="contact" defaultProduct={product?.slug} />
      </section>
    </div>
  );
}
