import { IconArrowRight, IconCheck, IconQrcode, IconScale, IconShieldCheck, IconSparkles, IconLeaf, IconTruckDelivery } from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { ProductCard } from '@/components/ProductCard';
import { buttonClass, Reveal, SectionHeading, ToConfirm } from '@/components/ui';
import { asset, countByGoal, featured, GOALS, money, PRODUCTS } from '@/lib/products';
import { usePageMeta } from '@/lib/meta';

const PILLARS = [
  { icon: IconLeaf, title: 'Organic ingredients', text: 'Botanical and mineral sources chosen for quality, shown clearly on every label.' },
  { icon: IconSparkles, title: 'Powerful results', text: 'Focused formulas with the ingredients that matter, built for people who want more than average.' },
  { icon: IconShieldCheck, title: 'Pure • Safe • Effective', text: 'Made with integrity. Nothing hidden, nothing you can’t pronounce.' },
  { icon: IconTruckDelivery, title: 'Built for daily use', text: 'One bottle, one purpose, easy to keep in your routine.' },
];

const MARQUEE = ['Organic ingredients', 'Powerful results', 'Pure • Safe • Effective', 'Vegetarian capsules', '14 focused formulas', 'Made with integrity'];

function Hero() {
  const trio = PRODUCTS.filter((p) => ['shilajit-gold', 'astaxanthin', 'lions-mane-blend-complex'].includes(p.slug));
  return (
    <section className="relative overflow-hidden bg-forest text-white">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[40rem] rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 size-[34rem] rounded-full bg-moss/40 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-14 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <div className="animate-rise">
          <p className="eyebrow !text-gold">Premium wellness</p>
          <h1 className="mt-5 text-5xl leading-[1.02] uppercase sm:text-7xl">
            Essential nutrition for <span className="text-gold">daily wellness</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">Clean, focused supplements for the way you live. Pure, safe and effective — made for people who expect more.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/catalog" className={buttonClass('gold')}>
              See all 14 formulas <IconArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#goals" className={buttonClass('ghost-light')}>
              Shop by goal
            </a>
          </div>
          <ul className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-6">
            {[
              ['14', 'Formulas'],
              ['6', 'Wellness goals'],
              ['100%', 'Vegetarian'],
            ].map(([n, l]) => (
              <li key={l}>
                <p className="font-serif text-3xl text-gold">{n}</p>
                <p className="mt-0.5 text-xs text-white/60">{l}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto grid w-full max-w-lg place-items-center">
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gold/35 to-transparent" aria-hidden="true" />
          <div className="relative flex items-end justify-center">
            {trio.map((p, i) => (
              <Link
                key={p.slug}
                to={`/product/${p.slug}`}
                className={`animate-float w-[42%] rounded-[1.75rem] bg-white p-2 shadow-[0_30px_50px_rgba(0,0,0,0.45)] transition hover:z-20 ${i === 1 ? 'z-10 -mx-[7%] w-[50%]' : i === 0 ? '-rotate-6' : 'rotate-6'}`}
                style={{ animationDelay: `${i * 0.8}s` }}
              >
                <img src={asset(p.image!)} alt={p.name} width={400} height={600} loading="eager" decoding="async" className="aspect-[4/5] w-full object-contain" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line bg-white py-4">
      <div className="marquee-track flex w-max gap-12 pr-12">
        {[...MARQUEE, ...MARQUEE].map((t, i) => (
          <span key={`${t}-${i}`} className="inline-flex items-center gap-3 text-sm font-bold tracking-[0.24em] text-forest uppercase">
            <span className="size-1.5 rounded-full bg-gold" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Goals() {
  return (
    <section id="goals" className="mx-auto max-w-7xl px-5 pt-24">
      <SectionHeading eyebrow="Shop by goal" title="Find what supports you" lead="Six areas, fourteen formulas. Pick the one you want to work on and see everything built for it." />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GOALS.map((g, i) => (
          <li key={g.id}>
            <Reveal delay={i * 60}>
              <Link to={`/catalog?goal=${g.id}`} className="group flex h-full flex-col gap-3 rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-gold hover:shadow-lg">
                <span className={`h-1 w-14 rounded-full ${g.bar}`} aria-hidden="true" />
                <span className="flex-1">
                  <span className="block font-serif text-2xl text-forest">{g.label}</span>
                  <span className="mt-1 block text-sm text-muted">{g.blurb}</span>
                </span>
                <span className="flex items-center justify-between text-sm font-bold tracking-wider text-gold-deep uppercase">
                  {countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'formula' : 'formulas'}
                  <IconArrowRight size={20} className="transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Featured() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Best value right now" title="Our collection" />
        <Link to="/catalog" className="inline-flex items-center gap-2 font-bold tracking-wider text-forest uppercase hover:text-gold-deep">
          View all products <IconArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {featured().map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Todos los productos visibles en una sola ojeada, sin salir de la portada. */
function AtAGlance() {
  const cheapest = Math.min(...PRODUCTS.filter((p) => p.price != null).map((p) => p.price!));
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <div className="rounded-[2rem] border border-line bg-white p-6 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="The full line" title="All fourteen, at a glance" lead={`Every formula we show here, with what it supports and its price — from ${money(cheapest)} up.`} />
          <Link to="/catalog" className={buttonClass('outline', 'hidden sm:inline-flex')}>
            Open the catalog
          </Link>
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => {
            const goal = GOALS.find((g) => g.id === p.goal)!;
            return (
              <li key={p.slug}>
                <Link to={`/product/${p.slug}`} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-sand/60">
                  <span className={`size-2 shrink-0 rounded-full ${goal.bar}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-bold tracking-wide text-forest uppercase">{p.name}</span>
                  <span className="shrink-0 text-sm text-muted">{p.price != null ? money(p.price) : 'Soon'}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex justify-center sm:hidden">
          <Link to="/catalog" className={buttonClass('outline')}>
            Open the catalog
          </Link>
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section id="why" className="mx-auto mt-24 grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2">
      <Reveal>
        <div className="grain relative rounded-[2rem] bg-gradient-to-br from-forest to-forest-2 p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-4">
            {PRODUCTS.filter((p) => ['maca-root-extra-strength', 'turmeric-curcumin'].includes(p.slug)).map((p) => (
              <img key={p.slug} src={asset(p.image!)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-2xl bg-white/95 object-contain p-3" />
            ))}
          </div>
          <span className="absolute -right-3 -bottom-3 rounded-full bg-gold px-5 py-3 font-serif text-lg text-forest shadow-xl">Organic • Powerful</span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <p className="eyebrow">Why choose Gold Roots?</p>
        <h2 className="mt-3 text-4xl leading-tight text-forest sm:text-5xl">Organic ingredients. Powerful results.</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          High-quality supplements for people looking for more than average. Every formula is built around ingredients with a long history of use and a clear purpose — with integrity from the first
          ingredient to the last capsule.
        </p>
        <ul className="mt-6 grid gap-3 text-forest">
          {['Focused formulas, no filler', 'Vegetarian capsules', 'Clear labels you can trust'].map((t) => (
            <li key={t} className="flex items-center gap-3 font-semibold">
              <IconCheck size={22} className="text-moss" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <Link to="/about" className={buttonClass('dark', 'mt-8')}>
          About the brand
        </Link>
      </Reveal>
    </section>
  );
}

function QrBand() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5">
      <div className="grid items-center gap-8 rounded-[2rem] bg-sand p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow">Made for the shelf</p>
          <h2 className="mt-3 text-3xl text-forest sm:text-4xl">Every product page carries its own QR code</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Print it on the bottle, a shelf talker or a catalog sheet: scanning it opens that exact formula on a phone, with benefits, ingredients and price. No app, no search.
          </p>
          <Link to="/product/shilajit-gold" className={buttonClass('dark', 'mt-7')}>
            See one with its QR code <IconArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <span className="grid size-40 place-items-center rounded-3xl bg-white text-gold-deep shadow-inner">
          <IconQrcode size={92} aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}

function WholesaleBand() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-forest px-8 py-12 text-white sm:px-12">
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="eyebrow !text-gold">Wholesale &amp; distribution</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Stock these formulas in your store</h2>
          <p className="mt-4 leading-relaxed text-white/75">
            This showcase page is built to present the line to shops, gyms and distributors. Minimum order, tier pricing and shipping terms still need to be confirmed with the brand.{' '}
            <span className="inline-flex align-middle">
              <ToConfirm />
            </span>
          </p>
          <Link to="/wholesale" className={buttonClass('gold', 'mt-7')}>
            <IconScale size={18} aria-hidden="true" /> Wholesale inquiry
          </Link>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');
    setError('');
    setDone(true);
  };
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24">
      <div className="rounded-[2rem] bg-gradient-to-br from-sand to-gold-soft/60 p-8 text-center sm:p-14">
        <p className="eyebrow">Keep going</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl text-forest sm:text-5xl">Pure. Safe. Effective.</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">Join our list for new formulas and member-only offers.</p>
        {done ? (
          <p role="status" className="mt-8 text-lg font-semibold text-moss">
            Thank you! You’re on the list. (Prototype: nothing was sent.)
          </p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor="news" className="sr-only">
              Email address
            </label>
            <input id="news" name="email" type="email" autoComplete="email" placeholder="Email address" aria-invalid={error ? true : undefined} className="h-12 flex-1 rounded-full border border-line bg-white px-6" />
            <button type="submit" className={buttonClass('dark')}>
              Subscribe
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export function Home() {
  usePageMeta({
    title: 'Gold Roots Nutrition — Essential nutrition for daily wellness',
    description: 'Fourteen focused supplements for energy, heart, brain, sleep, eye and skin and immune support. Pure, safe and effective formulas, shown with a QR code on every product page.',
    path: '/',
  });
  return (
    <>
      <Hero />
      <Marquee />
      <section aria-label="Why Gold Roots" className="border-b border-line bg-white">
        <ul className="mx-auto grid max-w-7xl gap-px px-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <li key={p.title} className="flex gap-4 py-7 sm:px-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sand text-gold-deep">
                <p.icon size={24} aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold tracking-wide text-forest">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <Goals />
      <Featured />
      <AtAGlance />
      <Why />
      <QrBand />
      <WholesaleBand />
      <Newsletter />
    </>
  );
}
