import { IconMail, IconMessageCircle, IconPhone, IconMapPin, IconBrandInstagram, IconExternalLink } from '@tabler/icons-react';
import { Link, useSearchParams } from 'react-router';
import { InquiryForm } from '@/components/InquiryForm';
import { buttonClass, SectionHeading, ToConfirm } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { findProduct } from '@/lib/products';
import { site } from '@/lib/site';

const CHANNELS = [
  { icon: IconMessageCircle, label: 'WhatsApp', value: site.phone, hint: 'Chats and orders with the brand' },
  { icon: IconMail, label: 'Email', value: site.email, hint: 'General questions' },
  { icon: IconPhone, label: 'Phone', value: null, hint: 'Business hours to be confirmed' },
  { icon: IconMapPin, label: 'Location', value: site.address, hint: 'Where the brand ships from' },
];

export function Contact() {
  const [params] = useSearchParams();
  const product = findProduct(params.get('product') ?? undefined);

  usePageMeta({
    title: 'Contact — Gold Roots Nutrition',
    description: 'Questions about a formula, an order or stocking the line: how to reach Gold Roots Nutrition.',
    path: '/contact',
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-4xl text-forest sm:text-6xl">Talk to the brand</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          This showcase has no checkout. Use it to ask about a formula, a bulk order or what your customers keep asking for — and the brand replies from its own store.
        </p>
        {product && (
          <p className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm">
            <span className="font-bold tracking-wider text-forest uppercase">About this formula:</span>
            <Link to={`/product/${product.slug}`} className="font-semibold text-gold-deep hover:text-forest">
              {product.name}
            </Link>
          </p>
        )}
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Contact channels">
        {CHANNELS.map((c) => (
          <div key={c.label} className="rounded-3xl border border-line bg-white p-6">
            <span className="grid size-11 place-items-center rounded-full bg-sand text-gold-deep">
              <c.icon size={21} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-sm font-bold tracking-[0.16em] text-forest uppercase">{c.label}</h2>
            {c.value ? <p className="mt-1 break-all font-semibold text-forest">{c.value}</p> : <p className="mt-2"><ToConfirm /></p>}
            <p className="mt-2 text-sm text-muted">{c.hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-sand px-6 py-5 text-sm text-muted">
        <p className="flex flex-wrap items-center gap-2">
          <ToConfirm label="needs confirmation" />
          Phone, email and location are not filled in here on purpose — they come from the brand. Orders and prices are on the live store:
        </p>
        <a href={site.originalShop} className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold tracking-wider text-forest uppercase hover:text-gold-deep">
          <IconExternalLink size={17} aria-hidden="true" /> {site.originalShop.replace(/^https?:\/\//, '')}
        </a>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Write to us" title="Ask anything about the line" lead="Product questions, wholesale, or a formula a customer keeps asking you for." />
          <p className="mt-6">
            <Link to="/wholesale" className={buttonClass('outline')}>
              Or send a wholesale inquiry
            </Link>
          </p>
          <ul className="mt-8 grid gap-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <IconBrandInstagram size={17} className="text-gold-deep" aria-hidden="true" /> Social accounts: {site.instagram ? site.instagram : 'not confirmed'}
            </li>
          </ul>
        </div>
        <InquiryForm kind="contact" defaultProduct={product?.slug} />
      </section>
    </div>
  );
}
