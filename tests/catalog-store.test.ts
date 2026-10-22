import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogState, loadCatalog, resetCatalogForTests, retryCatalog } from '@/lib/catalog';

const raw = JSON.parse(readFileSync('tests/fixtures/catalog-qa.json', 'utf8'));
const ok = () => Promise.resolve(new Response(JSON.stringify(raw), { status: 200, headers: { 'content-type': 'application/json' } }));

describe('el almacén del catálogo (lo que entrega Herbavida)', () => {
  beforeEach(() => resetCatalogForTests());
  afterEach(() => vi.unstubAllGlobals());

  it('una sola petición aunque la pidan varias pantallas a la vez, y queda listo con los productos', async () => {
    const fetchMock = vi.fn(ok);
    vi.stubGlobal('fetch', fetchMock);
    expect(getCatalogState().status).toBe('loading');
    await Promise.all([loadCatalog(), loadCatalog(), loadCatalog()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const state = getCatalogState();
    expect(state.status).toBe('ready');
    if (state.status === 'ready') expect(state.catalog.products).toHaveLength(14);
  });

  it('si Herbavida responde con error del cliente y no hay copia, queda en error sin inventar productos; «Reintentar» lo recupera', async () => {
    let calls = 0;
    vi.stubGlobal('fetch', vi.fn(() => (++calls === 1 ? Promise.resolve(new Response('no', { status: 404 })) : ok())));
    await loadCatalog();
    expect(getCatalogState()).toMatchObject({ status: 'error', catalog: null });
    await retryCatalog();
    expect(getCatalogState().status).toBe('ready');
    expect(calls).toBe(2);
  });

  it('con una copia ya a la vista, un fallo la deja visible pero marcada como no confirmada', async () => {
    vi.stubGlobal('fetch', vi.fn(ok));
    await loadCatalog();
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('no', { status: 403 }))));
    await loadCatalog();
    const state = getCatalogState();
    expect(state.status).toBe('ready');
    if (state.status === 'ready') {
      expect(state.stale).toBe(true);
      expect(state.catalog.products).toHaveLength(14);
    }
  });

  it('una respuesta sin productos válidos queda como catálogo vacío, no como error ni con datos de relleno', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify({ version: 'v', brands: [], products: [] }), { status: 200 }))));
    await loadCatalog();
    const state = getCatalogState();
    expect(state.status).toBe('ready');
    if (state.status === 'ready') expect(state.catalog.products).toEqual([]);
  });
});
