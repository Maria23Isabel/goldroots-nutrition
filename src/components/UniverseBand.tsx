// Experiencia C — «Universo Gold Roots». La escena oficial de los frascos flotantes con cintas doradas dibujadas
// por encima: la foto baja más despacio que el texto, las cintas se trazan con el scroll y una luz cruza la escena.
import { useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef } from 'react';
import { EASE_OUT, useDesktop, useQuietMotion } from '@/lib/motion';
import { asset } from '@/lib/products';

const art = { xs: asset('brand/floating-640.webp'), small: asset('brand/floating-900.webp'), large: asset('brand/floating.webp') };

const LINES = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const LINE = { hidden: { y: '112%' }, show: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } } };
const SOFT = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } } };

export function UniverseBand() {
  const section = useRef<HTMLElement>(null);
  const desktop = useDesktop();
  const quiet = useQuietMotion();
  const live = desktop && !quiet;

  /* La banda entra antes de verse y sale después de pasar: el recorrido completo da para un parallax largo. */
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const copyY = useTransform(scrollYProgress, [0, 0.6], ['-4%', '7%']);
  const sweep = useTransform(scrollYProgress, [0.1, 0.9], ['-30%', '112%']);
  const ribbonA = useTransform(scrollYProgress, [0.18, 0.62], [0, 1]);
  const ribbonB = useTransform(scrollYProgress, [0.26, 0.72], [0, 1]);
  /* El fondo pasa de marfil a tinta al final de la banda: es lo que une esta escena con la historia oscura. */
  const veil = useTransform(scrollYProgress, [0.62, 1], [0, 1]);

  return (
    <section ref={section} className="float-band relative overflow-clip border-b border-line py-16 sm:py-20" aria-labelledby="float-title">
      <m.div className="float-copy wrap relative z-10 text-center" style={live ? { y: copyY } : undefined}>
        <m.p variants={LINES} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -18% 0px' }} className="eyebrow">
          Universo Gold Roots
        </m.p>
        {/* El titular grande ya vive dentro de la pieza oficial («Every capsule…»): aquí el HTML baja de
            tamaño para que la foto mande y el texto sea el pie, no un segundo titular. */}
        <m.h2 id="float-title" variants={LINES} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -18% 0px' }} className="mx-auto mt-4 max-w-2xl text-[clamp(1.35rem,2.3vw,2rem)] leading-[1.25] text-night">
          <span className="line-mask">
            <m.span variants={LINE} className="block">Toda la línea responde al mismo</m.span>
          </span>
          <span className="line-mask">
            <m.span variants={LINE} className="block">criterio de presentación.</m.span>
          </span>
        </m.h2>
        <m.p variants={SOFT} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -18% 0px' }} className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted">
          Cada frasco se muestra con su nombre, su objetivo y su composición completa. Aquí no hay que adivinar nada.
        </m.p>
      </m.div>

      <div className="relative mt-10 sm:mt-14">
        <m.div className="relative" style={live ? { y: photoY } : undefined}>
          <img src={art.large} srcSet={`${art.xs} 640w, ${art.small} 900w, ${art.large} 1600w`} sizes="100vw" width="1600" height="914" loading="lazy" decoding="async" alt="Frasco de suplementos Gold Roots flotando entre cintas doradas e ingredientes" className="float-art block h-auto w-full" />
          {/* Las cintas que se dibujan siguen la curva de las que ya trae la fotografía; la luz cruza una sola vez. */}
          <svg viewBox="0 0 1600 914" aria-hidden="true" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
            <defs>
              <linearGradient id="ribbon-oro" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
                <stop offset="0.45" stopColor="var(--color-gold-light)" />
                <stop offset="1" stopColor="var(--color-accent-deep)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <m.path d="M-40 640C260 520 470 760 760 640S1240 380 1660 500" className="gold-thread" strokeWidth="2.5" style={{ pathLength: live ? ribbonA : 1, opacity: 0.55 }} />
            <m.path d="M-40 300C300 380 520 180 840 260S1300 420 1660 300" className="gold-thread" strokeWidth="1.6" style={{ pathLength: live ? ribbonB : 1, opacity: 0.4 }} />
          </svg>
          {live && (
            <m.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" style={{ x: sweep }} />
          )}
        </m.div>
        <m.span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night" style={live ? { opacity: veil } : undefined} />
      </div>
    </section>
  );
}
