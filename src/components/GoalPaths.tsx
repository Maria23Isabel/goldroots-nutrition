// «Seis puertas de entrada» como un árbol: una línea dorada baja desde el título, se parte en dos y cada rama se abre
// en tres puertas. El trazo y la aparición de cada puerta van ligados al scroll, pero el tramo es corto (≈ 600 px):
// termina de dibujarse antes de que las tarjetas salgan de la pantalla. Solo se anima pathLength, opacity y transform.
import { useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuietMotion } from '@/lib/motion';

/* El árbol se dibuja en píxeles reales (no en un viewBox estirado) para que el trazo conserve su grosor y su animación de
   pathLength. Las posiciones salen de los centros de las seis columnas (1/12 + n/6 del ancho); el tronco baja al centro y las
   dos ramas llegan a las columnas 2 y 5, de donde salen las tres hojas de cada lado. */
const HEIGHT = 128;
const COLUMN = [1 / 12, 3 / 12, 5 / 12, 7 / 12, 9 / 12, 11 / 12];

function treePaths(width: number) {
  const x = (fraction: number) => +(width * fraction).toFixed(1);
  const mid = HEIGHT * 0.5;
  const fork = HEIGHT * 0.24;
  const trunk = `M${x(0.5)} 0V${fork}`;
  const branches = [0.25, 0.75].map((at) => `M${x(0.5)} ${fork}C${x(0.5)} ${HEIGHT * 0.4} ${x(at)} ${HEIGHT * 0.34} ${x(at)} ${mid}`);
  const leaves = COLUMN.map((end, index) => {
    const from = index < 3 ? 0.25 : 0.75;
    return end === from ? `M${x(from)} ${mid}V${HEIGHT}` : `M${x(from)} ${mid}C${x(from)} ${HEIGHT * 0.76} ${x(end)} ${HEIGHT * 0.72} ${x(end)} ${HEIGHT}`;
  });
  return { trunk, branches, leaves };
}

/** Una puerta: aparece cuando la línea llega a ella (tramo [from, from + 0.16] del avance). */
function Door({ progress, from, children }: { progress: MotionValue<number>; from: number; children: ReactNode }) {
  const opacity = useTransform(progress, [from, from + 0.16], [0, 1]);
  const y = useTransform(progress, [from, from + 0.16], [26, 0]);
  return (
    <m.div className="h-full" style={{ opacity, y }}>
      {children}
    </m.div>
  );
}

export function GoalTree({ count, children }: { count: number; children: (index: number) => ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = strip.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const { trunk: trunkPath, branches, leaves } = treePaths(width);
  const quiet = useQuietMotion();
  const still = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: box, offset: ['start 82%', 'end 62%'] });
  const progress = quiet ? still : scrollYProgress;

  const trunk = useTransform(progress, [0, 0.16], [0, 1]);
  const branch = useTransform(progress, [0.14, 0.34], [0, 1]);
  const leaf = useTransform(progress, [0.3, 0.56], [0, 1]);
  const dot = useTransform(progress, [0.14, 0.3], [0, 1]);

  return (
    <div ref={box}>
      {/* Franja del árbol: se mide su ancho real y las rutas se calculan en píxeles. */}
      <div ref={strip} className="relative" style={{ height: HEIGHT }} aria-hidden="true">
        {width > 0 && (
          <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="absolute inset-0 overflow-visible">
            <m.path d={trunkPath} className="gold-line" strokeWidth="1.6" style={{ pathLength: trunk }} />
            {branches.map((d) => (
              <m.path key={d} d={d} className="gold-line" strokeWidth="1.6" style={{ pathLength: branch }} />
            ))}
            {leaves.map((d) => (
              <m.path key={d} d={d} className="gold-line" strokeWidth="1.6" style={{ pathLength: leaf }} />
            ))}
          </svg>
        )}
        {[25, 75].map((at) => (
          <m.span key={at} className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-accent/20" style={{ left: `${at}%`, top: '50%', scale: dot }} />
        ))}
      </div>
      <ul className="grid grid-cols-6">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="px-2">
            <Door progress={progress} from={0.5 + index * 0.07}>{children(index)}</Door>
          </li>
        ))}
      </ul>
    </div>
  );
}
