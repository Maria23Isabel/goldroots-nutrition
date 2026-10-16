import { IconBuildingStore, IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router';
import { buttonClass, Pending, Reveal, SectionHeading, ToConfirm } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { GOALS, PRODUCTS, countByGoal, goalLabel, money } from '@/lib/products';
import { InquiryForm } from '@/components/InquiryForm';

const INCLUDED = [
  'A product page per formula with benefits, ingredients and format',
  'A printable QR code on every formula, pointing straight to its page',
  'Catalog views: grid for a wall display, list for a spec sheet',
  'Goal-first navigation, so a shop can browse by what a customer asks for',
  'Photography of every product already in place, with no cart to maintain',
];

export function Wholesale() {
  usePageMeta({
    title: 'Wholesale & distribution — Gold Roots Nutrition',
    description: 'Bring the fourteen Gold Roots formulas to your store, gym or clinic. Product pages, printable QR codes and a catalog sheet.',
    path: '/wholesale',
  });

  const from = Math.min(...PRODUCTS.filter((p) => p.price != null).map((p) => p.price!));
  const to = Math.max(...PRODUCTS.map((p) => p.price ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <header className="max-w-3xl">
        <p className="eyebrow">Wholesale &amp; distribution</p>
        <h1 className="mt-3 text-4xl text-forest sm:text-6xl">Stock the line in your store</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          This site is built to show the range to shops, gyms, spas and clinics: every formula has its own page, its own QR code and a clear place it supports. Retail prices run {money(from)}–{money(to)} per bottle.
        </p>
      </header>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="rounded-[2rem] border border-line bg-white p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-sand text-gold-deep">
                <IconBuildingStore size={22} aria-hidden="true" />
              </span>
              <SectionHeading eyebrow="What you get" title="A shelf-ready line" as="h2" />
            </div>
            <ul className="mt-6 grid gap-3 text-forest">
              {INCLUDED.map((t) => (
                <li key={t} className="flex gap-3">
                  <IconCheck size={20} className="mt-0.5 shrink-0 text-moss" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Pending>Minimum order, case quantities and tier pricing are decided by the brand.</Pending>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="h-full rounded-[2rem] bg-forest p-8 text-white">
            <h2 className="font-serif text-2xl">The range, by goal</h2>
            <ul className="mt-6 divide-y divide-white/12">
              {GOALS.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-4 py-3">
                  <Link to={`/catalog?goal=${g.id}`} className="font-semibold hover:text-gold">
                    {g.label}
                  </Link>
                  <span className="text-white/60">
                    {countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'formula' : 'formulas'}
                  </span>
                </li>
              ))}
            </ul>
            <Link to="/catalog?view=list" className={buttonClass('gold', 'mt-8 w-full')}>
              Open the full spec list
            </Link>
            <p className="mt-3 text-xs text-white/60">
              A public price list for distributors is not confirmed yet. <ToConfirm />
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mt-16">
        <SectionHeading eyebrow="Every formula" title="Fourteen products, one catalog" />
        <div className="mt-8 overflow-x-auto rounded-3xl border border-line bg-white">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">The full Gold Roots line with the goal each formula supports and its retail price</caption>
            <thead>
              <tr className="border-b border-line text-xs tracking-[0.16em] text-muted uppercase">
                <th scope="col" className="px-5 py-4">Formula</th>
                <th scope="col" className="px-5 py-4">Supports</th>
                <th scope="col" className="px-5 py-4">Format</th>
                <th scope="col" className="px-5 py-4">Retail</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.slug} className="border-b border-line/70 last:border-0">
                  <th scope="row" className="px-5 py-3.5 font-bold tracking-wide text-forest uppercase">
                    <Link to={`/product/${p.slug}`} className="hover:text-gold-deep">
                      {p.name}
                    </Link>
                  </th>
                  <td className="px-5 py-3.5 text-muted">{goalLabel(p.goal)}</td>
                  <td className="px-5 py-3.5 text-muted">{p.format || '—'}</td>
                  <td className="px-5 py-3.5 font-bold text-forest">{p.price != null ? money(p.price) : 'Soon'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Send an inquiry" title="Tell us about your store" lead="This prototype saves nothing: it shows what the form will collect once the brand confirms where inquiries go." />
          <Pending>Contact email or WhatsApp for wholesale.</Pending>
        </div>
        <InquiryForm kind="wholesale" />
      </section>
    </div>
  );
}
