// «Mi pedido»: la lista de lo que el cliente quiere, guardada en su propio navegador (localStorage).
// No es un carrito de compra: no hay pago ni servidor; al final se manda todo por WhatsApp (ver whatsapp.ts).
import { useSyncExternalStore } from 'react';
import { findProduct } from './products';
import { orderTotals, type OrderLine } from './whatsapp';

const KEY = 'gold-roots:pedido';
const MAX_QTY = 20;

interface State {
  /** slug → cantidad */
  items: Record<string, number>;
  drawer: boolean;
}

function read(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, unknown>;
    const items: Record<string, number> = {};
    for (const [slug, qty] of Object.entries(parsed)) {
      if (findProduct(slug) && typeof qty === 'number' && qty >= 1) items[slug] = Math.min(MAX_QTY, Math.floor(qty));
    }
    return items;
  } catch {
    return {};
  }
}

let state: State = { items: typeof localStorage === 'undefined' ? {} : read(), drawer: false };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state.items));
  } catch {
    // sin permiso de almacenamiento: el pedido vive solo mientras la página esté abierta
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

export const orderActions = {
  add(slug: string, qty = 1, openDrawer = true) {
    if (!findProduct(slug)) return;
    const next = Math.min(MAX_QTY, (state.items[slug] ?? 0) + qty);
    set({ items: { ...state.items, [slug]: next }, drawer: openDrawer ? true : state.drawer });
  },
  setQty(slug: string, qty: number) {
    if (qty < 1) return orderActions.remove(slug);
    set({ ...state, items: { ...state.items, [slug]: Math.min(MAX_QTY, qty) } });
  },
  remove(slug: string) {
    const { [slug]: _quitado, ...rest } = state.items;
    set({ ...state, items: rest });
  },
  clear() {
    set({ ...state, items: {} });
  },
  open() {
    set({ ...state, drawer: true });
  },
  close() {
    set({ ...state, drawer: false });
  },
};

export function useOrder() {
  const snapshot = useSyncExternalStore(subscribe, () => state);
  const lines: OrderLine[] = Object.entries(snapshot.items).flatMap(([slug, qty]) => {
    const product = findProduct(slug);
    return product ? [{ product, qty }] : [];
  });
  return { lines, totals: orderTotals(lines), drawer: snapshot.drawer, has: (slug: string) => slug in snapshot.items };
}

export { MAX_QTY };
