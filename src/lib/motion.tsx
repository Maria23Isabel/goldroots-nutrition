// Base del movimiento de la web. Motion para React hace los estados y las transiciones; todo lo que va ligado al scroll
// usa valores de movimiento (no re-renderiza React en cada cuadro) y solo anima transform, opacity y clip-path.
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';

// Dos niveles de funciones: las de animación (entradas, variantes, salida, hover/tap, whileInView) van en el paquete inicial para que
// el primer texto de la portada no espere un archivo más; las de layout compartido (la raya del menú, el selector, el riel) se bajan
// aparte con LayoutMotion, porque solo las usan esos tres lugares y pesan unos 25 KB comprimidos.
const layoutFeatures = () => import('./motion-features').then((module) => module.default);

/** «reducedMotion=user»: si el sistema pide menos movimiento, Motion deja de animar transformaciones y deja las transiciones de opacidad. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}

/** Una media query como estado de React, sin parpadeo en el primer cuadro. */
export function useMedia(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => (typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : fallback),
    () => fallback,
  );
}

/** Escritorio: ancho para las escenas ancladas y el puntero fino. En celular las escenas se simplifican. */
export const useDesktop = () => useMedia('(min-width: 900px)');
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)');
export const useQuietMotion = () => useMedia('(prefers-reduced-motion: reduce)');

/** true cuando el elemento está a menos de `margin` píxeles de la pantalla: sirve para montar las escenas pesadas justo antes de que se vean. */
export function useNear<T extends Element>(margin = 700) {
  const [node, setNode] = useState<T | null>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!node || near) return;
    if (typeof IntersectionObserver === 'undefined') return void setNear(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin}px 0px` },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, near, margin]);
  return [setNode, near] as const;
}

/** Curvas que usa toda la web: una de entrada que frena al final y otra más ligera para lo que responde al toque. */
export const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

/** Envuelve lo que usa `layout` o `layoutId`: carga las funciones de layout en segundo plano; mientras llegan, las piezas se ven quietas. */
export function LayoutMotion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={layoutFeatures} strict>
      {children}
    </LazyMotion>
  );
}
