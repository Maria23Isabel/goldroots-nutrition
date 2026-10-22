// Experiencia B — «Producto destacado». La fotografía oficial del Zinc queda fija mientras se baja y sus datos
// verificables se van encendiendo de uno en uno. Ningún texto se escribe a mano: todo sale de la ficha del catálogo.
import { IconArrowRight } from '@tabler/icons-react';
import { useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { buttonClass, GoalBadge, Reveal, WhatsAppButton } from '@/components/ui';
import { EASE_OUT, useDesktop, useQuietMotion } from '@/lib/motion';
import { asset, findProduct } from '@/lib/products';
import { infoAbout } from '@/lib/whatsapp';
import { beatsOf, stepAt } from '@/lib/showcase';

const zinc = findProduct('zinc-triple-play')!;
const beats = beatsOf(zinc);
const scene = { small: asset('brand/zinc-scene.webp') };

export function ProductSpotlight() {
  const section = useRef<HTMLElement>(null);
  const desktop = useDesktop();
  const quiet = useQuietMotion();
  const [lit, setLit] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  /* La foto se despega apenas unos grados: es lo que delata que la escena está viva sin mover el layout. */
  const photoY = useTransform(scrollYProgress, [0, 1], ['2%', '-4%']);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.75, 0.45]);
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = stepAt((value - 0.12) / 0.78, beats.length);
    setLit((current) => (current === next ? current : next));
  });

  const heading = (
    <div className="max-w-lg">
      <GoalBadge goal={zinc.goal} />
      <h2 id="spotlight-title" className="mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] text-night">
        {zinc.headline}
      </h2>
      <p className="mt-5 text-[1rem] leading-relaxed text-muted">{zinc.summary}</p>
    </div>
  );

  if (!desktop || quiet) {
    /* Sin escena anclada la ficha se lee de una vez: la foto arriba y los cinco datos ya encendidos. */
    return (
      <section ref={section} className="overflow-clip border-y border-line bg-surface" aria-labelledby="spotlight-title">
        <div className="wrap grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-24">
          <Reveal kind="fade">{heading}</Reveal>
          <Reveal kind="mask" className="relative">
            <div className="zinc-stage relative overflow-hidden rounded-[2.5rem] px-6 py-10 sm:px-12">
              <img src={scene.small} width="1400" height="800" loading="lazy" decoding="async" alt="Frasco de Zinc Triple Play Gold Roots con sus cápsulas" className="shot block h-auto w-full" />
              <p className="relative mt-6 text-center text-[0.78rem] font-semibold tracking-[0.16em] text-accent-deep uppercase">{zinc.format}</p>
            </div>
          </Reveal>
          <ul className="lg:col-span-2">
            {beats.map((beat, index) => (
              <li key={beat.key}>
                <Reveal kind="slide" delay={index * 60}>
                  <BeatRow beat={beat} on />
                </Reveal>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <Link to={`/producto/${zinc.slug}`} className={buttonClass('primary')}>Ver producto <IconArrowRight size={17} aria-hidden="true" /></Link>
            <WhatsAppButton text={infoAbout(zinc.name)} variant="outline">Preguntar por este producto</WhatsAppButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative border-y border-line bg-surface" aria-labelledby="spotlight-title">
      <div className="h-[200svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="wrap grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* La escena oficial, quieta: solo se desliza unos píxeles y su luz respira con el avance. */}
            <div className="relative">
              <m.span aria-hidden="true" className="absolute inset-[12%] rounded-full bg-accent/16 blur-3xl" style={{ opacity: glow }} />
              <m.div className="zinc-stage relative overflow-hidden rounded-[2.5rem] px-6 py-10 sm:px-12" style={{ y: photoY }}>
                <img src={scene.small} width="1400" height="800" loading="eager" decoding="async" alt="Frasco de Zinc Triple Play Gold Roots con sus cápsulas" className="shot block h-auto w-full" />
                <p className="relative mt-6 text-center text-[0.78rem] font-semibold tracking-[0.16em] text-accent-deep uppercase">{zinc.format}</p>
              </m.div>
            </div>

            {/* Los datos se encienden en orden, con el riel dorado marcando cuál toca. */}
            <div>
              {heading}
              <ul className="mt-9 border-t border-line">
                {beats.map((beat, index) => (
                  <li key={beat.key}>
                    <m.div initial={false} animate={{ opacity: index <= lit ? 1 : 0.3, x: index <= lit ? 0 : 14 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                      <BeatRow beat={beat} on={index <= lit} />
                    </m.div>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to={`/producto/${zinc.slug}`} className={buttonClass('primary')}>Ver producto <IconArrowRight size={17} aria-hidden="true" /></Link>
                <WhatsAppButton text={infoAbout(zinc.name)} variant="outline">Preguntar por este producto</WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeatRow({ beat, on = false }: { beat: { label: string; text: string }; on?: boolean }) {
  return (
    <div className="flex items-start gap-4 border-b border-line py-4">
      <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full transition-colors duration-500 ${on ? 'bg-accent' : 'bg-line-strong'}`} />
      <div className="min-w-0">
        <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-accent-deep uppercase">{beat.label}</p>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-fg">{beat.text}</p>
      </div>
    </div>
  );
}
