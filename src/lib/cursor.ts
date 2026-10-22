// Tarjetas que reaccionan al cursor: una luz que sigue al puntero y una inclinación mínima (±4°).
// Solo con puntero fino y sin «reducir movimiento»; en pantallas táctiles no se escribe nada y la tarjeta queda quieta.
import { useCallback, useRef, type PointerEvent } from 'react';
import { useFinePointer, useQuietMotion } from './motion';

export function useCursorCard<T extends HTMLElement>(tilt = 4) {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const fine = useFinePointer();
  const quiet = useQuietMotion();
  const live = fine && !quiet;

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (event.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el) return;
      const { clientX, clientY } = event;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const x = (clientX - box.left) / box.width;
        const y = (clientY - box.top) / box.height;
        el.dataset.live = 'true';
        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        el.style.setProperty('--ry', `${((x - 0.5) * tilt * 2).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${((0.5 - y) * tilt * 2).toFixed(2)}deg`);
      });
    },
    [tilt],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.dataset.live = 'false';
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }, []);

  return live ? { ref, onPointerMove, onPointerLeave } : { ref };
}
