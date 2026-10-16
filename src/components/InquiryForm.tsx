import { useState, type FormEvent } from 'react';
import { buttonClass } from './ui';
import { PRODUCTS, money } from '@/lib/products';

const field = 'h-12 w-full rounded-2xl border border-line bg-white px-4';
const label = 'block text-sm font-bold tracking-wide text-forest uppercase';

/** Formulario de muestra: valida y confirma en pantalla, pero no envía nada todavía (no hay buzón confirmado). */
export function InquiryForm({ kind, defaultProduct }: { kind: 'contact' | 'wholesale'; defaultProduct?: string }) {
  const [state, setState] = useState<'idle' | 'sent' | 'error'>('idle');
  const [problems, setProblems] = useState<Record<string, string>>({});

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const email = String(data.get('email') ?? '').trim();
    if (!String(data.get('name') ?? '').trim()) next.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email address.';
    if (!String(data.get('message') ?? '').trim()) next.message = 'Add a short message so we know what you need.';
    setProblems(next);
    if (Object.keys(next).length) return setState('error');
    setState('sent');
    e.currentTarget.reset();
  };

  if (state === 'sent')
    return (
      <div role="status" className="rounded-[2rem] border border-moss/30 bg-moss/10 p-8">
        <h2 className="font-serif text-2xl text-forest">Thanks — your inquiry is ready</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Nothing was sent anywhere yet: this page has no inbox until the brand confirms where inquiries should go. The form and the fields it collects are what will be used.
        </p>
        <button type="button" onClick={() => setState('idle')} className={buttonClass('outline', 'mt-6')}>
          Write another
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="rounded-[2rem] border border-line bg-white p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input id="name" name="name" autoComplete="name" aria-invalid={problems.name ? true : undefined} aria-describedby={problems.name ? 'name-error' : undefined} className={`${field} mt-2`} />
          {problems.name && <p role="alert" id="name-error" className="mt-1 text-sm text-red-700">{problems.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" aria-invalid={problems.email ? true : undefined} aria-describedby={problems.email ? 'email-error' : undefined} className={`${field} mt-2`} />
          {problems.email && <p role="alert" id="email-error" className="mt-1 text-sm text-red-700">{problems.email}</p>}
        </div>
        {kind === 'wholesale' ? (
          <>
            <div>
              <label htmlFor="business" className={label}>
                Store or company
              </label>
              <input id="business" name="business" autoComplete="organization" className={`${field} mt-2`} />
            </div>
            <div>
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
      <button type="submit" className={buttonClass('gold', 'mt-7 w-full sm:w-auto')}>
        {kind === 'wholesale' ? 'Request wholesale details' : 'Send inquiry'}
      </button>
      <p aria-live="polite" className="mt-3 text-sm text-muted">
        {state === 'error' ? 'Please fix the highlighted fields.' : 'Prototype form — it does not send anything yet.'}
      </p>
    </form>
  );
}
