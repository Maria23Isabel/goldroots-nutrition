// Los estados del catálogo que viene de Herbavida: cargando, error y vacío. Una pantalla que depende del catálogo se envuelve aquí y recibe los datos ya listos;
// mientras llegan, el bloque conserva su tamaño (esqueleto) para que la página no salte, y nunca se muestran productos de ejemplo.
import { IconPlugConnectedX } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { buttonClass } from './ui';
import { type Catalog, retryCatalog, useCatalogState } from '@/lib/catalog';

/** Esqueleto de una tarjeta de producto: mismas proporciones que ProductCard. */
export function CardSkeleton() {
  return (
    <div aria-hidden="true" className="card overflow-hidden">
      <div className="aspect-[4/3.6] animate-pulse bg-sand" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-24 animate-pulse rounded-full bg-sand" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-sand" />
        <div className="h-4 w-full animate-pulse rounded bg-sand" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-sand" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <CardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function CatalogError({ className = '' }: { className?: string }) {
  return (
    <div role="alert" className={`mx-auto max-w-xl rounded-3xl border border-line bg-surface p-10 text-center ${className}`}>
      <IconPlugConnectedX size={34} stroke={1.5} className="mx-auto text-accent-deep" aria-hidden="true" />
      <h2 className="mt-4 text-[1.4rem]">No pudimos cargar el catálogo</h2>
      <p className="mx-auto mt-3 max-w-md text-[0.94rem] text-muted">Revisa tu conexión e inténtalo de nuevo. La información de las fórmulas se actualiza desde la marca.</p>
      <button type="button" onClick={() => void retryCatalog()} className={buttonClass('night', 'mt-6')}>
        Reintentar
      </button>
    </div>
  );
}

export function CatalogEmpty({ className = '' }: { className?: string }) {
  return (
    <div className={`mx-auto max-w-xl rounded-3xl border border-line bg-surface p-10 text-center ${className}`}>
      <h2 className="text-[1.4rem]">Aún no hay fórmulas publicadas</h2>
      <p className="mx-auto mt-3 max-w-md text-[0.94rem] text-muted">Cuando la marca publique su catálogo, lo verás aquí.</p>
    </div>
  );
}

/**
 * Entrega el catálogo a quien lo necesita.
 * - `loading`: lo que se muestra mientras llega (por defecto, nada: la sección conserva su espacio con su propio tamaño reservado).
 * - `error`: por defecto el aviso con «Reintentar»; `null` lo oculta (para secciones secundarias de la portada).
 * - `empty`: cuando la respuesta no trae productos; `null` oculta la sección.
 */
export function CatalogGate({ children, loading = null, error = <CatalogError className="my-16" />, empty = <CatalogEmpty className="my-16" /> }: { children: (catalog: Catalog) => ReactNode; loading?: ReactNode; error?: ReactNode; empty?: ReactNode }) {
  const state = useCatalogState();
  if (state.status === 'loading') return <>{loading}</>;
  if (state.status === 'error') return <>{error}</>;
  if (!state.catalog.products.length) return <>{empty}</>;
  return <>{children(state.catalog)}</>;
}
