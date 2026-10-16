import { IconBrandWhatsapp } from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';
import { PRODUCTS, money } from '@/lib/products';
import { inquiryMessage, waLink } from '@/lib/whatsapp';

const field = 'h-12 w-full rounded-2xl border border-line bg-white px-4';
const label = 'block text-sm font-bold tracking-wide text-forest uppercase';

/** Formulario que arma el mensaje y abre WhatsApp con el texto ya escrito: la vitrina no guarda ni envía nada a ningún servidor. */
export function InquiryForm({ kind, defaultProduct }: { kind: 'contact' | 'wholesale'; defaultProduct?: string }) {
  const [problems, setProblems] = useState<Record<string, string>>({});
  const [link, setLink] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = (k: string) => String(data.get(k) ?? '').trim();
    const next: Record<string, string> = {};
    if (!text('name')) next.name = 'Please tell us your name.';
    if (text('message').length < 5) next.message = 'Add a short message so we know what you need.';
    setProblems(next);
    if (Object.keys(next).length) return setLink(null);
    const slug = text('product');
    const product = PRODUCTS.find((p) => p.slug === slug)?.name;
    const url = waLink(inquiryMessage({ kind, name: text('name'), message: text('message'), product, business: text('business'), country: text('country') }));
    setLink(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-[2rem] border border-line bg-white p-8 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className={kind === 'contact' ? 'sm:col-span-2' : ''}>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input id="name" name="name" autoComplete="name" aria-invalid={problems.name ? true : undefined} aria-describedby={problems.name ? 'name-error' : undefined} className={`${field} mt-2`} />
          {problems.name && <p role="alert" id="name-error" className="mt-1 text-sm text-red-700">{problems.name}</p>}
        </div>
        {kind === 'wholesale' ? (
          <>
            <div>
              <label htmlFor="business" className={label}>
                Store or company
              </label>
              <input id="business" name="business" autoComplete="organization" className={`${field} mt-2`} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="country" className={label}>
                Country
              </label>
              <input id="country" name="country" autoComplete="country-name" className={`${field} mt-2`} />
            </div>
          </>
        ) : (
          <div className="sm:col-span-2">
            <label htmlFor="product" className={label}>
              Which formula? (optional)
            </label>
            <select id="product" name="product" defaultValue={defaultProduct} className={`${field} mt-2`}>
              <option value="">No preference</option>
              {PRODUCTS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — {p.price != null ? money(p.price) : 'coming soon'}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            aria-invalid={problems.message ? true : undefined}
            aria-describedby={problems.message ? 'message-error' : undefined}
            className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3"
          />
          {problems.message && <p role="alert" id="message-error" className="mt-1 text-sm text-red-700">{problems.message}</p>}
        </div>
      </div>
      <button type="submit" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-wa px-7 text-sm font-bold tracking-wider text-forest uppercase transition hover:brightness-105 sm:w-auto">
        <IconBrandWhatsapp size={20} aria-hidden="true" /> {kind === 'wholesale' ? 'Request wholesale on WhatsApp' : 'Send on WhatsApp'}
      </button>
      <p aria-live="polite" className="mt-3 text-sm text-muted">
        {Object.keys(problems).length ? (
          'Please fix the highlighted fields.'
        ) : link ? (
          <>
            WhatsApp should have opened in a new tab.{' '}
            <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-deep underline underline-offset-4">
              Open the chat here
            </a>{' '}
            if it didn’t.
          </>
        ) : (
          'We open WhatsApp with your message already written — you just press send.'
        )}
      </p>
    </form>
  );
}
