import { IconBrandWhatsapp, IconShoppingBag, IconTrash, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ProductImage } from './ProductCard';
import { QtyStepper } from './ui';
import { orderActions, useOrder } from '@/lib/order';
import { money, productPath } from '@/lib/products';
import { orderMessage, waLink } from '@/lib/whatsapp';

const field = 'h-12 w-full rounded-2xl border border-line bg-surface px-4 text-base outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15';

/** Panel lateral «Mi pedido»: lista, cantidades, datos opcionales y el botón que abre WhatsApp con todo escrito. */
export function OrderDrawer() {
  const { lines, totals, drawer } = useOrder();
  const [who, setWho] = useState({ name: '', place: '', note: '' });
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!drawer) return;
    opener.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') orderActions.close();
      if (e.key === 'Tab' && panel.current) {
        const focusables = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, [drawer]);

  if (!drawer) return null;
  const empty = lines.length === 0;
  const href = waLink(orderMessage(lines, who));

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="pedido-title">
      <div className="absolute inset-0 bg-fg/60 backdrop-blur-sm [animation:fade-in_0.25s_both]" onClick={orderActions.close} aria-hidden="true" />
      <div ref={panel} className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl [animation:slide-in_0.35s_cubic-bezier(0.2,0.8,0.2,1)_both]">
        <header className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
          <div>
            <h2 id="pedido-title" className="font-display text-2xl font-extrabold">
              Mi pedido
            </h2>
            <p className="text-sm text-muted" aria-live="polite">
              {empty ? 'Aún no eliges nada' : `${totals.units} ${totals.units === 1 ? 'unidad' : 'unidades'}`}
            </p>
          </div>
          <button type="button" onClick={orderActions.close} className="grid size-11 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:bg-sun" aria-label="Cerrar mi pedido">
            <IconX size={20} aria-hidden="true" />
          </button>
        </header>

        {empty ? (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <span className="grad-sun mx-auto grid size-20 place-items-center rounded-3xl text-night shadow-lg shadow-coral/30">
                <IconShoppingBag size={36} aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-extrabold">Tu pedido está vacío</h3>
              <p className="mt-2 text-muted">Elige tus fórmulas, agrégalas aquí y mándalo todo junto por WhatsApp.</p>
              <Link to="/catalogo" onClick={orderActions.close} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-inv px-7 font-bold text-inv-fg transition hover:opacity-85">
                Ver el catálogo
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {lines.map(({ product, qty }) => (
                <li key={product.slug} className={`g-${product.goal} flex gap-4 rounded-3xl bg-surface p-3 ring-1 ring-line`}>
                  <Link to={`/${productPath(product.slug)}`} onClick={orderActions.close} className="grad-goal relative block size-24 shrink-0 overflow-hidden rounded-2xl" aria-label={`Ver ${product.name}`}>
                    <ProductImage product={product} width={160} className="absolute inset-0 size-full object-contain p-1.5" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm leading-tight font-extrabold">{product.name}</p>
                      <button type="button" onClick={() => orderActions.remove(product.slug)} className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-rose/10 hover:text-rose" aria-label={`Quitar ${product.name} del pedido`}>
                        <IconTrash size={17} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <QtyStepper value={qty} onChange={(n) => orderActions.setQty(product.slug, n)} label={product.name} />
                      <span className="font-display font-extrabold">{product.price != null ? money(product.price * qty) : 'Por cotizar'}</span>
                    </div>
                  </div>
                </li>
              ))}

              <li className="rounded-3xl bg-surface p-4 ring-1 ring-line">
                <p className="text-sm font-bold">Para atenderte mejor <span className="font-normal text-muted">(opcional)</span></p>
                <div className="mt-3 grid gap-3">
                  <label className="sr-only" htmlFor="ped-nombre">Tu nombre</label>
                  <input id="ped-nombre" className={field} placeholder="Tu nombre" autoComplete="name" value={who.name} onChange={(e) => setWho({ ...who, name: e.target.value })} />
                  <label className="sr-only" htmlFor="ped-lugar">Ciudad o país de entrega</label>
                  <input id="ped-lugar" className={field} placeholder="Ciudad o país de entrega" autoComplete="address-level2" value={who.place} onChange={(e) => setWho({ ...who, place: e.target.value })} />
                  <label className="sr-only" htmlFor="ped-nota">Nota para la marca</label>
                  <textarea id="ped-nota" rows={2} className={`${field} !h-auto py-3`} placeholder="¿Algo más que quieras contarnos?" value={who.note} onChange={(e) => setWho({ ...who, note: e.target.value })} />
                </div>
              </li>
            </ul>

            <footer className="border-t border-line bg-surface px-6 pt-5 pb-6">
              <dl className="space-y-1.5 text-sm">
                {totals.saved > 0 && (
                  <div className="flex justify-between text-wa-deep">
                    <dt>Ahorras frente al precio normal</dt>
                    <dd className="font-bold">{money(totals.saved)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <dt className="font-bold">Total referencial</dt>
                  <dd className="font-display text-3xl font-extrabold">{money(totals.subtotal)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-xs text-muted">
                Sin envío{totals.unpriced > 0 && ` · ${totals.unpriced} ${totals.unpriced === 1 ? 'producto' : 'productos'} por cotizar`}. El envío y la forma de pago se confirman en el chat; aquí no se cobra nada.
              </p>
              <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-wa text-base font-extrabold text-night shadow-lg shadow-wa/30 transition hover:brightness-105 active:scale-[0.98]">
                <IconBrandWhatsapp size={24} aria-hidden="true" />
                Enviar mi pedido por WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <button type="button" onClick={orderActions.clear} className="mt-3 w-full text-center text-sm font-semibold text-muted underline-offset-4 hover:text-fg hover:underline">
                Vaciar el pedido
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
