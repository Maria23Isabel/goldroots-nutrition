import { IconArrowRight, IconQrcode, IconSearch, IconShieldCheck } from '@tabler/icons-react';
import { Link } from 'react-router';
import { buttonClass, Reveal, SectionHeading } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { asset, GOALS, PRODUCTS, countByGoal, goalOf } from '@/lib/products';
import { site } from '@/lib/site';

const STEPS = [
  { icon: IconSearch, title: 'Pick a goal', text: 'Six areas — energy, heart, brain, sleep, eye and skin, immune — each with the formulas built for it.' },
  { icon: IconShieldCheck, title: 'Read the label', text: 'Benefits, ingredients and format come straight from the product, so what you see is what the bottle says.' },
  { icon: IconQrcode, title: 'Scan on the shelf', text: 'Each page has its own QR code. Print it and a customer lands on that exact formula.' },
];

export function About() {
  usePageMeta({
    title: 'About the brand — Gold Roots Nutrition',
    description: 'Organic ingredients and powerful results: what Gold Roots Nutrition makes, and how this showcase page is meant to be used.',
    path: '/about',
  });

  const hero = PRODUCTS.find((p) => p.slug === 'shilajit-gold')!;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <header className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 text-4xl leading-tight text-forest sm:text-6xl">Organic ingredients. Powerful results.</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Gold Roots Nutrition makes high-quality supplements for people who expect more than average. The line stays deliberately small: fourteen formulas, each built around ingredients with a
            long history of use and one clear job — so a customer can choose by what they want to support, not by a wall of similar bottles.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Everything shown here is <strong className="text-forest">pure, safe and effective</strong>: focused formulas without filler, vegetarian capsules, and labels that say what is inside.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/catalog" className={buttonClass('gold')}>
              Browse the line <IconArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/wholesale" className={buttonClass('outline')}>
              Wholesale
            </Link>
          </div>
        </div>
        <Reveal>
          <div className="grain relative rounded-[2rem] bg-gradient-to-br from-forest to-forest-2 p-8 text-center">
            <img src={asset(hero.image!)} alt={hero.name} width={420} height={600} loading="lazy" className="mx-auto aspect-[4/5] w-full max-w-xs object-contain" />
            <p className="mt-4 font-serif text-xl text-gold">{goalOf(hero.goal).label}</p>
            <p className="text-sm text-white/70">{hero.headline}</p>
          </div>
        </Reveal>
      </header>

      <section className="mt-20">
        <SectionHeading eyebrow="How the line works" title="Three steps, start to shelf" />
        <ol className="mt-8 grid gap-4 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 80}>
                <div className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-white p-6">
                  <span className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-sand text-gold-deep">
                      <s.icon size={20} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Step {i + 1}</span>
                  </span>
                  <h3 className="font-serif text-2xl text-forest">{s.title}</h3>
                  <p className="text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Coverage" title="What the fourteen formulas support" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g) => (
            <li key={g.id} className="rounded-3xl border border-line bg-white p-6">
              <span className={`inline-block h-1 w-12 rounded-full ${g.bar}`} aria-hidden="true" />
              <h3 className="mt-3 font-serif text-xl text-forest">{g.label}</h3>
              <p className="mt-1 text-sm text-muted">{g.blurb}</p>
              <Link to={`/catalog?goal=${g.id}`} className="mt-3 inline-block text-sm font-bold tracking-wider text-gold-deep uppercase hover:text-forest">
                {countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'formula' : 'formulas'}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 rounded-[2rem] bg-sand p-8 sm:p-12">
        <h2 className="font-serif text-3xl text-forest">About this page</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          This is a showcase site, not the brand’s store: there is no cart and no payment. Product names, prices, benefits, ingredients and photography come from{' '}
          <a href={site.originalShop} className="font-semibold text-forest underline underline-offset-4 hover:text-gold-deep">
            {site.originalShop.replace(/^https?:\/\//, '')}
          </a>
          , and the contact details, shipping terms and legal text still need to be confirmed by the brand before it goes live.
        </p>
      </section>
    </div>
  );
}
