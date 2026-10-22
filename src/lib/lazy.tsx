// Carga diferida de páginas y escenas: el JavaScript de lo que no se ve todavía se baja cuando hace falta.
import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { useNear } from './motion';

/** `lazy` para módulos con exportaciones con nombre: lazyNamed(() => import('./Catalog'), 'Catalog'). */
export function lazyNamed<T extends Record<string, unknown>, K extends keyof T>(load: () => Promise<T>, name: K) {
  return lazy(() => load().then((module) => ({ default: module[name] as ComponentType })));
}

/** Lo que se ve mientras llega el JavaScript de una página: el espacio ya reservado y una hoja que respira, sin saltos de layout. */
export function PageFallback() {
  return (
    <div role="status" aria-label="Cargando" className="grid min-h-[70vh] place-items-center">
      <span className="size-10 animate-pulse rounded-full border border-line-strong" />
    </div>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

/**
 * Monta (y por tanto descarga) una escena pesada solo cuando está a punto de entrar en pantalla.
 * Mientras tanto reserva su altura (`reserve`, una clase de Tailwind) para que lo de abajo no se mueva, y conserva el `id` para que los enlaces
 * internos y el riel de secciones la encuentren desde el primer momento.
 */
export function Defer({ id, reserve, children }: { id?: string; reserve: string; children: ReactNode }) {
  const [ref, near] = useNear<HTMLDivElement>(900);
  return (
    <div id={id} ref={ref} className={near ? undefined : reserve}>
      {near && <Suspense fallback={<div className={reserve} />}>{children}</Suspense>}
    </div>
  );
}
