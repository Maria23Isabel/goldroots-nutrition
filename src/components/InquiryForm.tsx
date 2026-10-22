import { IconBrandWhatsapp } from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';
import { PRODUCTS } from '@/lib/products';
import { inquiryMessage, waLink } from '@/lib/whatsapp';

const label = 'block text-[0.85rem] font-semibold text-fg';

export function InquiryForm({ defaultProduct }: { defaultProduct?: string }) {
  const [problems, setProblems] = useState<Record<string, string>>({});
  const [link, setLink] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? '').trim();
    const next: Record<string, string> = {};
    if (!text('name')) next.name = 'Dinos tu nombre, por favor.';
    if (text('message').length < 5) next.message = 'Escribe un mensaje corto para saber qué necesitas.';
    setProblems(next);
    if (Object.keys(next).length) return setLink(null);
    const product = PRODUCTS.find((item) => item.slug === text('product'))?.name;
    const url = waLink(inquiryMessage({ name: text('name'), message: text('message'), product }));
    setLink(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const error = (id: string) => problems[id] && <p role="alert" id={`${id}-error`} className="mt-1.5 text-[0.82rem] font-medium text-accent-deep">{problems[id]}</p>;

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={label}>Tu nombre</label>
          <input id="name" name="name" autoComplete="name" aria-invalid={problems.name ? true : undefined} aria-describedby={problems.name ? 'name-error' : undefined} className="field mt-1.5" />
          {error('name')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="product" className={label}>¿Sobre qué fórmula? <span className="font-normal text-muted">(opcional)</span></label>
          <select id="product" name="product" defaultValue={defaultProduct ?? ''} className="field mt-1.5">
            <option value="">Consulta general</option>
            {PRODUCTS.map((product) => <option key={product.slug} value={product.slug}>{product.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>Tu mensaje</label>
          <textarea id="message" name="message" rows={5} aria-invalid={problems.message ? true : undefined} aria-describedby={problems.message ? 'message-error' : undefined} className="field mt-1.5 h-auto py-2.5" />
          {error('message')}
        </div>
      </div>
      <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-wa px-6 text-[0.92rem] font-semibold text-white transition-colors hover:bg-wa-deep sm:w-auto">
        <IconBrandWhatsapp size={20} aria-hidden="true" /> Continuar en WhatsApp
      </button>
      <p className="mt-4 text-[0.85rem] text-muted" role="status" aria-live="polite">
        {link ? <>Si no se abrió WhatsApp, <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline underline-offset-4">toca aquí para continuar</a>.</> : 'La página no guarda lo que escribes; prepara tu consulta y abre WhatsApp.'}
      </p>
    </form>
  );
}
