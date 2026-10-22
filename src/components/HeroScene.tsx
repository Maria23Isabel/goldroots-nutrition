// La portada cinematográfica. Todo el movimiento va por valores de Motion (transform, opacity, clip-path, pathLength):
// React no se re-renderiza en ningún cuadro del scroll ni del puntero.
import { IconArrowDown, IconArrowRight } from '@tabler/icons-react';
import { useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, type PointerEvent } from 'react';
import { Link } from 'react-router';
import { LeafMark, WhatsAppButton, buttonClass } from '@/components/ui';
import { EASE_OUT, useDesktop, useFinePointer, useQuietMotion } from '@/lib/motion';
import { asset } from '@/lib/products';
import { INFO_MESSAGE } from '@/lib/whatsapp';

const cover = { xs: asset('brand/hero-gold-640.webp'), small: asset('brand/hero-gold-900.webp'), large: asset('brand/hero-gold.webp') };

/* El titular entra línea por línea, destapado desde abajo: cada línea vive dentro de su propia máscara. */
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } };
const UP = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } } };
const LINE = { hidden: { y: '112%' }, show: { y: '0%', transition: { duration: 0.75, ease: EASE_OUT } } };

export function HeroScene() {
  const section = useRef<HTMLElement>(null);
  const desktop = useDesktop();
  const fine = useFinePointer();
  const quiet = useQuietMotion();
  const live = desktop && fine && !quiet;

  /* Cierre de la portada: al empezar a bajar, la tarjeta se encoge, sube y se redondea más, el texto se despega
     hacia arriba y el hilo dorado se dibuja hacia la banda siguiente. */
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const cardRadius = useTransform(scrollYProgress, [0, 1], ['1.25rem', '3.5rem']);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const thread = useTransform(scrollYProgress, [0.08, 0.62], [0, 1]);

  /* El puntero mueve dos capas a distinta profundidad: la foto cede poco y las luces del fondo, mucho. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 });
  const artX = useTransform(sx, [-1, 1], [14, -14]);
  const artY = useTransform(sy, [-1, 1], [10, -10]);
  const orbX = useTransform(sx, [-1, 1], [-42, 42]);
  const orbY = useTransform(sy, [-1, 1], [-26, 26]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!live || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - box.left) / box.width) * 2 - 1);
    py.set(((event.clientY - box.top) / box.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      ref={section}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="hero-shell relative isolate min-h-[calc(100svh-4.75rem)] overflow-hidden border-b border-line"
    >
      <m.span className="hero-orb hero-orb-a" aria-hidden="true" style={live ? { x: orbX, y: orbY } : undefined} />
      <m.span className="hero-orb hero-orb-b" aria-hidden="true" style={live ? { x: orbX, y: orbY } : undefined} />

      <div className="wrap grid min-h-[calc(100svh-4.75rem)] items-center gap-5 py-6 sm:gap-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:py-16">
        {/* Columna de texto: entra escalonada (logotipo, titular, filete, párrafo, botones) y se despega al bajar. */}
        <m.div className="relative z-10 order-2 max-w-2xl lg:order-none" style={{ y: copyY, opacity: copyOpacity }} variants={STAGGER} initial="hidden" animate="show">
          <m.p variants={UP} className="eyebrow flex items-center gap-3 text-accent-deep">
            <LeafMark className="size-5" />
            Gold Roots Nutrition
          </m.p>
          <h1 className="mt-4 text-[clamp(2.55rem,5.4vw,5.2rem)] leading-[0.94] sm:mt-5 font-medium tracking-[-0.045em] text-night">
            <span className="line-mask">
              <m.span variants={LINE} className="block">Bienestar que</m.span>
            </span>
            <span className="line-mask">
              <m.span variants={LINE} className="block">empieza en la raíz.</m.span>
            </span>
          </h1>
          <m.div variants={UP} className="rule-gold mt-5 w-40 origin-left sm:mt-7" aria-hidden="true" />
          <m.p variants={UP} className="mt-4 max-w-xl text-[1.04rem] leading-relaxed text-muted sm:mt-6 sm:text-[1.14rem]">
            Una línea de suplementos presentada con claridad: conoce sus ingredientes, sus objetivos y cada detalle antes de elegir.
          </m.p>
          <m.div variants={UP} className="mt-6 flex flex-wrap gap-3 sm:mt-9">
            <Link to="/catalogo" className={buttonClass('primary')}>Explorar catálogo <IconArrowRight size={17} aria-hidden="true" /></Link>
            <WhatsAppButton text={INFO_MESSAGE} variant="outline" icon={false}>Conocer más</WhatsAppButton>
          </m.div>
          <m.a variants={UP} href="#historia" className="mt-8 inline-flex items-center gap-3 text-[0.8rem] sm:mt-12 font-semibold tracking-[0.08em] text-muted uppercase">
            Descubre la línea
            <span className="grid size-9 place-items-center rounded-full border border-line-strong motion-safe:animate-[nudge_2.6s_ease-in-out_infinite]">
              <IconArrowDown size={16} aria-hidden="true" />
            </span>
          </m.a>
        </m.div>

        {/* La portada oficial: entra destapándose de abajo a arriba dentro de su tarjeta, respira con CSS y se cierra
            con el scroll. El puntero mueve un envoltorio aparte para no pelearse con ninguna de las dos. */}
        <div className="order-1 -mx-5 sm:-mx-8 lg:order-none lg:mx-0">
          <m.div style={{ x: live ? artX : undefined, y: live ? artY : undefined }} className="relative">
            <m.div
              initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
              animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
              className="relative overflow-hidden lg:mx-auto lg:max-w-[62rem] lg:rounded-[1.25rem]"
            >
              <span className="hero-plate hidden lg:block" aria-hidden="true" />
              <m.div style={desktop && !quiet ? { scale: cardScale, y: cardY, borderRadius: cardRadius } : undefined} className="hero-card">
                <img src={cover.large} srcSet={`${cover.xs} 640w, ${cover.small} 900w, ${cover.large} 1600w`} sizes="(max-width: 1024px) 100vw, 62vw" width="1600" height="914" fetchPriority="high" decoding="async" alt="La línea completa de suplementos Gold Roots presentada sobre fondo blanco, rodeada de sus ingredientes" className="hero-art block h-auto w-full" />
              </m.div>
            </m.div>
          </m.div>
        </div>
      </div>

      {/* El hilo dorado: se dibuja con el scroll y cruza la costura entre la portada y la banda de frascos. */}
      <m.svg viewBox="0 0 24 168" aria-hidden="true" className="absolute bottom-0 left-1/2 z-10 hidden h-42 w-6 -translate-x-1/2 translate-y-[52%] lg:block" initial={false}>
        <defs>
          <linearGradient id="thread-oro" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--color-gold-light)" />
            <stop offset="1" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <path d="M12 2C4 46 20 112 12 166" className="gold-thread" stroke="var(--color-line-strong)" strokeWidth="1.2" pathLength={1} />
        <m.path d="M12 2C4 46 20 112 12 166" className="gold-thread" strokeWidth="1.6" style={{ pathLength: thread }} />
      </m.svg>
    </section>
  );
}
