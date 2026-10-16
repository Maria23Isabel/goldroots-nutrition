import { Link, useParams } from 'react-router';
import { buttonClass } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';

const FDA = 'These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease.';

const PAGES: Record<string, { title: string; blocks: Array<{ h: string; p: string[] }> }> = {
  terms: {
    title: 'Terms & policies',
    blocks: [
      {
        h: 'About this site',
        p: [
          'This site shows the Gold Roots Nutrition line. It is a showcase: it holds no cart, takes no payment and stores no orders. Purchases happen on the brand’s own store.',
          '[To be reviewed: the legal entity behind the brand, the governing country and state, and the returns and warranty policy.]',
        ],
      },
      { h: 'Product information', p: ['Names, prices, benefits, ingredients and format come from the products as the brand publishes them. They may change without notice.', FDA] },
      { h: 'Consult a professional', p: ['Talk to a qualified healthcare professional before starting any supplement, especially if you are pregnant, nursing, taking medication or managing a condition.'] },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    blocks: [
      { h: 'What this site collects', p: ['Nothing. The contact and wholesale forms only write a message and open WhatsApp on your device; this site does not receive, send or store what you type. What you then send in WhatsApp is handled by WhatsApp and the brand.'] },
      { h: 'When it goes live', p: ['[To be written: what personal data the brand collects, why, how long it is kept, who it is shared with, and how to request its removal.]'] },
      { h: 'Cookies and analytics', p: ['[To be confirmed: whether the site will use analytics or marketing cookies, and what consent banner will be shown.]'] },
    ],
  },
};

export function Legal() {
  const { page = 'terms' } = useParams();
  const known = page in PAGES;
  const content = PAGES[page] ?? PAGES.terms;

  usePageMeta({ title: `${content.title} — Gold Roots Nutrition`, description: `${content.title} for the Gold Roots Nutrition showcase site.`, path: `/legal/${known ? page : 'terms'}` });

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl text-forest sm:text-5xl">{content.title}</h1>
      <p className="mt-3 text-sm text-muted">Draft for the brand — not reviewed and not in force yet.</p>
      {content.blocks.map((b) => (
        <section key={b.h} className="mt-10">
          <h2 className="font-serif text-2xl text-forest">{b.h}</h2>
          {b.p.map((text) => (
            <p key={text} className="mt-3 leading-relaxed text-muted">
              {text}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}

export function NotFound() {
  usePageMeta({ title: 'Page not found — Gold Roots Nutrition', description: 'This page does not exist on the Gold Roots Nutrition showcase site.', path: '/' });
  return (
    <div className="mx-auto grid max-w-2xl place-items-center px-5 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl text-forest sm:text-5xl">We couldn’t find that page</h1>
      <p className="mt-4 text-lg text-muted">The formula may have been renamed. The catalog shows everything that is on the line today.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/catalog" className={buttonClass('gold')}>
          Browse all 14 formulas
        </Link>
        <Link to="/" className={buttonClass('outline')}>
          Back home
        </Link>
      </div>
    </div>
  );
}
