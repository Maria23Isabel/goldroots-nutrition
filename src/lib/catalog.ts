// El catálogo de Gold Roots viene de Herbavida: una sola petición pública de solo lectura (GET /api/public/sites/goldroots/catalog) trae las marcas
// habilitadas para este sitio con sus productos publicados, sin precios ni stock. Aquí viven la lectura, los valores predeterminados y el estado compartido.
//
// - Una sola petición por visita, compartida por todas las pantallas (no hay un pedido por ficha ni por componente).
// - La última respuesta buena se guarda en el navegador: la visita siguiente pinta al instante y revisa en segundo plano. Es información real de Herbavida
//   de hace poco, nunca datos de ejemplo.
// - Sin conexión o con Herbavida caído: se muestra lo guardado si lo hay; si no, un aviso con «Reintentar». Jamás productos inventados.
import { useSyncExternalStore } from 'react';
import { DEFAULTS } from './defaults';
import { type Brand, goalFromText, type Product } from './products';

export interface RawProduct {
  slug: string;
  name: string;
  brandId: number;
  presentation: string | null;
  shortDescription: string | null;
  benefits: string[];
  ingredients: string[];
  images: { url: string; alt: string | null }[];
  goal: string | null;
  headline: string | null;
  tagline: string | null;
  usage: string | null;
  attributes: { name: string; value: string }[];
  featured: boolean;
}

export interface RawBrand {
  id: number;
  name: string;
  description: string | null;
  colors: { name: string; hex: string }[];
  logo: string | null;
  order: number;
}

export interface RawCatalog {
  version: string;
  site: string;
  brands: RawBrand[];
  products: RawProduct[];
}

export interface Catalog {
  version: string;
  brands: Brand[];
  products: Product[];
}

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const strings = (value: unknown) => (Array.isArray(value) ? value.map(text).filter(Boolean) : []);

/** Convierte la respuesta de Herbavida en lo que usa la web, aplicando los valores predeterminados. Descarta lo que no tenga lo mínimo (nombre y dirección). */
export function normalizeCatalog(raw: unknown): Catalog {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Partial<RawCatalog>;
  const brands: Brand[] = (Array.isArray(source.brands) ? source.brands : []).flatMap((b) =>
    b && typeof b.id === 'number' && text(b.name)
      ? [{ id: b.id, name: text(b.name), description: text(b.description) || null, logo: text(b.logo) || null, colors: Array.isArray(b.colors) ? b.colors : [] }]
      : [],
  );
  const brandName = new Map(brands.map((b) => [b.id, b.name]));

  const products: Product[] = (Array.isArray(source.products) ? source.products : []).flatMap((p) => {
    const slug = text(p?.slug);
    const name = text(p?.name);
    // Sin nombre o sin dirección no hay ficha que publicar; un producto de una marca que no viene tampoco
    if (!slug || !name || !brandName.has(p.brandId)) return [];
    const images = (Array.isArray(p.images) ? p.images : []).map((i) => text(i?.url)).filter(Boolean);
    const format = text(p.presentation);
    return [
      {
        slug,
        name,
        brandId: p.brandId,
        brandName: brandName.get(p.brandId) ?? DEFAULTS.brandName,
        goal: goalFromText(p.goal),
        headline: text(p.headline) || DEFAULTS.headline,
        tagline: text(p.tagline) || DEFAULTS.tagline,
        summary: text(p.shortDescription) || DEFAULTS.summary,
        benefits: strings(p.benefits),
        ingredients: strings(p.ingredients),
        format,
        usage: text(p.usage) || null,
        attributes: (Array.isArray(p.attributes) ? p.attributes : []).flatMap((a) => (text(a?.name) && text(a?.value) ? [{ name: text(a.name), value: text(a.value) }] : [])),
        images,
        image: images[0] ?? null,
        featured: p.featured === true,
      },
    ];
  });
  return { version: text(source.version), brands, products };
}

// ── Estado compartido ────────────────────────────────────────────────────────────────────────────────────────────────────

export type CatalogState =
  | { status: 'loading'; catalog: null; stale: false }
  | { status: 'ready'; catalog: Catalog; stale: boolean }
  /** Sin respuesta y sin copia guardada */
  | { status: 'error'; catalog: null; stale: false };

const API = (import.meta.env.VITE_CATALOG_API as string | undefined)?.replace(/\/$/, '') ?? '';
export const CATALOG_URL = `${API}/api/public/sites/goldroots/catalog`;

const STORAGE_KEY = 'goldroots:catalog:v1';
const MAX_SAVED_AGE = 24 * 60 * 60 * 1000;
const REVALIDATE_AFTER = 5 * 60 * 1000;
const TIMEOUT = 8000;
const RETRY_DELAYS = [600, 1500];

let state: CatalogState = { status: 'loading', catalog: null, stale: false };
let loadedAt = 0;
let inflight: Promise<void> | null = null;
let started = false;
const listeners = new Set<() => void>();

function set(next: CatalogState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function readSaved(): Catalog | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as { savedAt: number; raw: unknown } | null;
    if (!saved || Date.now() - saved.savedAt > MAX_SAVED_AGE) return null;
    const catalog = normalizeCatalog(saved.raw);
    return catalog.products.length ? catalog : null;
  } catch {
    return null;
  }
}

function save(raw: unknown) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), raw }));
  } catch {
    /* sin almacenamiento (modo privado, cuota): la web funciona igual, solo sin copia */
  }
}

async function request(signal: AbortSignal): Promise<RawCatalog> {
  // Sin cabeceras propias: así la petición coincide con la precarga de index.html y se aprovecha la que ya viene en camino
  const response = await fetch(CATALOG_URL, { signal });
  if (!response.ok) throw Object.assign(new Error(`Herbavida respondió ${response.status}`), { retry: response.status >= 500 });
  return (await response.json()) as RawCatalog;
}

async function fetchWithRetry(): Promise<RawCatalog> {
  let last: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      return await request(controller.signal);
    } catch (error) {
      last = error;
      if ((error as { retry?: boolean }).retry === false) break; // un 4xx no mejora reintentando
      if (attempt < RETRY_DELAYS.length) await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
    } finally {
      clearTimeout(timer);
    }
  }
  throw last;
}

/** Pide el catálogo (una sola petición a la vez, aunque lo pidan varios). Si ya hay una copia, la deja a la vista mientras llega la nueva. */
export function loadCatalog(): Promise<void> {
  inflight ??= fetchWithRetry()
    .then((raw) => {
      const catalog = normalizeCatalog(raw);
      loadedAt = Date.now();
      if (state.status !== 'ready' || state.catalog.version !== catalog.version || state.stale) set({ status: 'ready', catalog, stale: false });
      save(raw);
    })
    .catch(() => {
      // Con una copia guardada se sigue mostrando (marcada como no confirmada); sin ella, el aviso de error
      if (state.status !== 'ready') set({ status: 'error', catalog: null, stale: false });
      else if (!state.stale) set({ ...state, stale: true });
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Arranca la lectura una sola vez, al abrir la web: lo guardado se pinta al instante y la petición va en paralelo. */
export function startCatalog() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const saved = readSaved();
  if (saved) state = { status: 'ready', catalog: saved, stale: true };
  void loadCatalog();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - loadedAt > REVALIDATE_AFTER) void loadCatalog();
  });
}

export function retryCatalog() {
  if (state.status === 'error') set({ status: 'loading', catalog: null, stale: false });
  return loadCatalog();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const snapshot = () => state;

export function useCatalogState(): CatalogState {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Lectura directa del estado (sin React): para las pruebas. */
export const getCatalogState = () => state;

/** Pruebas: deja el estado como al abrir la web. */
export function resetCatalogForTests() {
  state = { status: 'loading', catalog: null, stale: false };
  loadedAt = 0;
  inflight = null;
  started = false;
}
