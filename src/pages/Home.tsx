import { IconArrowDown, IconArrowRight, IconBrandWhatsapp, IconFlask, IconQrcode, IconRoute, IconShieldCheck } from '@tabler/icons-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { FormulaFinder } from '@/components/FormulaFinder';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { Accordion, buttonClass, CountUp, d, LeafMark, Reveal, SectionHeading } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { asset, featured, findProduct, GOALS, PRODUCTS } from '@/lib/products';
import { INFO_MESSAGE, waLink } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

const storyProducts = [findProduct('shilajit-gold')!, findProduct('lions-mane-blend-complex')!, findProduct('turmeric-curcumin')!];
const zinc = findProduct('zinc-triple-play')!;

/** El mismo archivo oficial en dos tamaños: el de 900 px pesa menos de la mitad en el móvil. */
const cover = { small: asset('brand/hero-cover-900.webp'), large: asset('brand/hero-cover.webp') };
const floatArt = { small: asset('brand/floating-900.webp'), large: asset('brand/floating.webp') };

function Hero() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        /* La portada se despega despacio del titular: el parallax de la entrada, sin forzar el scroll. */
        gsap.fromTo('.hero-art-wrap', { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: 1.1 } });
      });
      return () => media.revert();
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="hero-shell relative isolate min-h-[calc(100svh-4.75rem)] overflow-hidden border-b border-line">
      <span className="hero-orb hero-orb-a" aria-hidden="true" />
      <span className="hero-orb hero-orb-b" aria-hidden="true" />
      <div className="wrap grid min-h-[calc(100svh-4.75rem)] items-center gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:py-16">
        <div className="relative z-10 order-2 max-w-2xl lg:order-none">
          <p className="eyebrow rise flex items-center gap-3 text-accent-deep" style={d(40)}><LeafMark className="size-5" />Gold Roots Nutrition</p>
          <h1 className="rise mt-5 text-[clamp(2.9rem,5.4vw,5.2rem)] leading-[0.94] font-medium tracking-[-0.045em] text-night" style={d(110)}>
            Bienestar que empieza en la raíz.
          </h1>
          <div className="rule-gold rise mt-7 w-40" style={d(160)} aria-hidden="true" />
          <p className="rise mt-6 max-w-xl text-[1.04rem] leading-relaxed text-muted sm:text-[1.14rem]" style={d(190)}>
            Una línea de suplementos presentada con claridad: conoce sus ingredientes, sus objetivos y cada detalle antes de elegir.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={d(270)}>
            <Link to="/catalogo" className={buttonClass('primary')}>Explorar catálogo <IconArrowRight size={17} aria-hidden="true" /></Link>
            <a href={waLink(INFO_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonClass('outline')}>Conocer más</a>
          </div>
          <a href="#historia" className="rise mt-12 inline-flex items-center gap-3 text-[0.8rem] font-semibold tracking-[0.08em] text-muted uppercase" style={d(360)}>
            Descubre la línea <span className="grid size-9 place-items-center rounded-full border border-line-strong"><IconArrowDown size={16} aria-hidden="true" /></span>
          </a>
        </div>
        {/* La portada oficial va suelta, sin marco: su fondo de estudio se funde con el marfil y el lema impreso
            queda dentro de la imagen, sin repetirlo en HTML. El rise va en el contenedor y el parallax en el
            interior: una animación CSS con fill «both» sobre el mismo nodo se impondría al transform de GSAP.
            En móvil la composición alternativa es a sangre y arriba: a 390 px el lema impreso no se lee, así que
            el mensaje lo lleva el titular que viene debajo y la foto abre la página de punta a punta. */}
        <div className="rise order-1 -mx-5 sm:-mx-8 lg:order-none lg:mx-0" style={d(160)}>
          <div className="hero-art-wrap">
            <img src={cover.large} srcSet={`${cover.small} 900w, ${cover.large} 1600w`} sizes="(max-width: 1024px) 100vw, 62vw" width="1600" height="914" fetchPriority="high" decoding="async" alt="La línea completa de suplementos Gold Roots presentada sobre fondo blanco, rodeada de sus ingredientes" className="hero-art block h-auto w-full lg:max-w-[62rem]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** La escena de los frascos flotando con las cintas doradas: la banda que acompaña el descenso. */
function FloatBand() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.float-art', { yPercent: 7 }, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: 1.15 } });
        gsap.fromTo('.float-copy', { yPercent: -5 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'center center', scrub: 1.4 } });
        gsap.utils.toArray<HTMLElement>('.line-mask > span').forEach((line, index) => {
          gsap.from(line, { yPercent: 112, duration: 1.1, delay: index * 0.09, ease: 'power3.out', scrollTrigger: { trigger: line, start: 'top 88%' } });
        });
      });
      return () => media.revert();
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="float-band relative overflow-clip border-b border-line py-16 sm:py-20" aria-labelledby="float-title">
      <div className="float-copy wrap relative z-10 text-center">
        <p className="eyebrow">La colección en movimiento</p>
        {/* El titular grande ya vive dentro de la pieza oficial («Every capsule…»): aquí el HTML baja de
            tamaño para que la foto mande y el texto sea el pie, no un segundo titular. */}
        <h2 id="float-title" className="mx-auto mt-4 max-w-2xl text-[clamp(1.35rem,2.3vw,2rem)] leading-[1.25] text-night">
          <span className="line-mask"><span>Toda la línea responde al mismo</span></span>
          <span className="line-mask"><span>criterio de presentación.</span></span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted">Cada frasco se muestra con su nombre, su objetivo y su composición completa. Aquí no hay que adivinar nada.</p>
      </div>
      <div className="relative mt-10 sm:mt-14">
        <img src={floatArt.large} srcSet={`${floatArt.small} 900w, ${floatArt.large} 1600w`} sizes="100vw" width="1600" height="914" loading="lazy" decoding="async" alt="Frasco de suplementos Gold Roots flotando entre cintas doradas e ingredientes" className="float-art block h-auto w-full" />
      </div>
    </section>
  );
}

function Story() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.story-bottle-a', { xPercent: -18, yPercent: 22, rotate: -8 }, { xPercent: 8, yPercent: -8, rotate: 2, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
        gsap.fromTo('.story-bottle-b', { yPercent: 18, scale: 0.84 }, { yPercent: -16, scale: 1.06, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top 75%', end: 'bottom 20%', scrub: 1 } });
        gsap.fromTo('.story-bottle-c', { xPercent: 20, yPercent: 30, rotate: 7 }, { xPercent: -8, yPercent: -4, rotate: -3, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: 1.35 } });
        gsap.utils.toArray<HTMLElement>('.story-copy').forEach((item) => gsap.fromTo(item, { opacity: 0.28 }, { opacity: 1, scrollTrigger: { trigger: item, start: 'top 68%', end: 'bottom 48%', scrub: true } }));
      });
      return () => media.revert();
    }, section);
    return () => context.revert();
  }, []);

  const steps = [
    { n: '01', eyebrow: 'Conocer', title: 'Empieza por el objetivo.', text: 'La línea se organiza en seis territorios de bienestar para que la exploración tenga un punto de partida claro.' },
    { n: '02', eyebrow: 'Comprender', title: 'Lee la fórmula completa.', text: 'Cada ficha reúne descripción, ingredientes, presentación y beneficios declarados por el catálogo de la marca.' },
    { n: '03', eyebrow: 'Profundizar', title: 'Lleva la ficha contigo.', text: 'El QR de cada producto abre su página informativa y mantiene disponibles sus detalles en una ruta estable.' },
  ];

  /* Las fotos oficiales llegan sobre fondo blanco: en el bloque tinta cada frasco va montado en su propia
     placa marfil, que es la que se mueve con el scroll. */
  const plates = [
    'lg:absolute lg:bottom-[3%] lg:left-[1%] lg:h-[62%] lg:w-[35%]',
    'lg:absolute lg:top-[1%] lg:left-[32%] lg:z-10 lg:h-[72%] lg:w-[37%]',
    'lg:absolute lg:right-[1%] lg:bottom-[2%] lg:h-[58%] lg:w-[34%]',
  ];

  return (
    <section id="historia" ref={section} className="story-section relative overflow-clip bg-night text-white">
      <div className="wrap grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div className="relative py-14 lg:sticky lg:top-[4.75rem] lg:h-[calc(100svh-4.75rem)] lg:py-12">
          <div className="absolute inset-[14%_6%] rounded-full bg-accent/12 blur-3xl" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-[38rem] lg:h-full">
            <p className="eyebrow !text-accent lg:absolute lg:top-[7%] lg:left-[2%] lg:max-w-[13rem]">Una línea, varios caminos</p>
            <p className="mt-3 max-w-[16rem] text-[0.9rem] leading-relaxed text-white/62 lg:absolute lg:top-[15%] lg:left-[2%] lg:mt-0 lg:max-w-[13rem]">La composición cambia mientras avanzas: objetivo, fórmula y ficha.</p>
            <div className="story-stage mt-8 grid grid-cols-3 gap-3 lg:absolute lg:inset-[30%_0_5%_0] lg:mt-0 lg:block lg:gap-0">
              {storyProducts.map((product, index) => (
                <div key={product.slug} className={`story-bottle story-bottle-${String.fromCharCode(97 + index)} rounded-[1.5rem] bg-gradient-to-b from-white to-[#efe9dc] p-2 shadow-[0_26px_50px_-26px_rgb(6_12_22/0.85)] ring-1 ring-white/15 lg:p-4 ${plates[index]}`}>
                  <ProductImage product={product} width={420} eager className="mx-auto h-full max-h-full w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative py-10 lg:py-[26vh]">
          {steps.map((step) => (
            <article key={step.n} className="story-copy flex min-h-[34vh] items-center border-t border-white/14 py-12 first:border-t-0 lg:min-h-[68vh] lg:py-16">
              <div>
                <p className="flex items-center gap-3 text-[0.74rem] font-semibold tracking-[0.16em] text-accent uppercase"><span>{step.n}</span><span className="h-px w-10 bg-accent/60" />{step.eyebrow}</p>
                <h2 className="mt-6 max-w-lg text-[clamp(2.3rem,5vw,4.6rem)] leading-[0.98] font-medium tracking-[-0.04em]">{step.title}</h2>
                <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-white/62">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Goals() {
  return (
    <section className="wrap section" aria-labelledby="goals-title">
      <Reveal><SectionHeading eyebrow="Explora por objetivo" title={<span id="goals-title">Seis puertas de entrada</span>} lead="No son diagnósticos ni recomendaciones médicas. Son categorías para orientarte dentro del catálogo y revisar la información de cada fórmula." /></Reveal>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GOALS.map((goal, index) => (
          <li key={goal.id}>
            <Reveal delay={index * 45} className="h-full">
              <Link to={`/catalogo?objetivo=${goal.slug}`} className={`g-${goal.id} goal-block group flex h-full min-h-56 flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1`}>
                <span className="text-goal text-[0.72rem] font-bold tracking-[0.14em] uppercase">0{index + 1}</span>
                <h3 className="mt-auto text-[1.55rem] leading-tight">{goal.label}</h3>
                <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-muted">{goal.blurb}.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-semibold text-night">Explorar <IconArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Producto destacado: la fotografía individual del Zinc, en su propio escenario. */
function Spotlight() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.spot-photo', { yPercent: 6, scale: 1.02 }, { yPercent: -6, scale: 1.02, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      });
      return () => media.revert();
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="overflow-clip border-y border-line bg-surface" aria-labelledby="spotlight-title">
      <div className="wrap grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-24">
        <div>
          <Reveal>
            <p className="eyebrow">Producto destacado</p>
            <h2 id="spotlight-title" className="mt-4 text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.02] text-night">{zinc.headline}</h2>
            <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-muted">{zinc.summary}</p>
          </Reveal>
          <Reveal delay={90}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {zinc.ingredients.slice(0, 5).map((ingredient) => <li key={ingredient} className="rounded-full border border-line-strong px-3.5 py-1.5 text-[0.8rem] font-medium text-fg">{ingredient}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={`/producto/${zinc.slug}`} className={buttonClass('primary')}>Ver producto <IconArrowRight size={17} aria-hidden="true" /></Link>
              <a href={waLink(`${INFO_MESSAGE} (Zinc Triple Play)`)} target="_blank" rel="noopener noreferrer" className={buttonClass('outline')}><IconBrandWhatsapp size={17} aria-hidden="true" /> Preguntar por este producto</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={60} className="relative">
          <div className="zinc-stage relative overflow-hidden rounded-[2.5rem] px-6 py-10 sm:px-12">
            <img src={asset('brand/zinc-scene.webp')} width="1400" height="800" loading="lazy" decoding="async" alt="Frasco de Zinc Triple Play Gold Roots con sus cápsulas" className="spot-photo shot block h-auto w-full" />
            <p className="relative mt-6 text-center text-[0.78rem] font-semibold tracking-[0.16em] text-accent-deep uppercase">{zinc.format}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Collection() {
  const products = featured().slice(0, 4);
  return (
    <section className="border-y border-line bg-sand" aria-labelledby="collection-title">
      <div className="wrap section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><SectionHeading eyebrow="Selección de la línea" title={<span id="collection-title">Fórmulas para mirar de cerca</span>} lead="Una primera selección para conocer el lenguaje, los ingredientes y la diversidad de la colección." /></Reveal>
          <Link to="/catalogo" className={buttonClass('outline')}>Ver las {PRODUCTS.length} fórmulas <IconArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => <li key={product.slug}><Reveal delay={index * 55} className="h-full"><ProductCard product={product} /></Reveal></li>)}
        </ul>
      </div>
    </section>
  );
}

function BrandMoment() {
  return (
    <section className="wrap section" aria-labelledby="brand-title">
      <div className="grid overflow-hidden rounded-[2rem] border border-line bg-surface lg:grid-cols-[0.78fr_1.22fr]">
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
          <p className="eyebrow text-accent-deep">La colección completa</p>
          <h2 id="brand-title" className="mt-4 text-[clamp(2.2rem,4.5vw,4rem)] leading-[0.98]">Un lenguaje visual. Distintos objetivos.</h2>
          <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-muted">Frascos, ingredientes y fichas conviven en un sistema consistente para que comparar resulte más simple.</p>
          <dl className="mt-9 grid grid-cols-2 gap-5 border-t border-line pt-7">
            <div><dd className="font-display text-4xl text-night"><CountUp to={PRODUCTS.length} /></dd><dt className="mt-1 text-[0.78rem] font-medium text-muted">fórmulas documentadas</dt></div>
            <div><dd className="font-display text-4xl text-night"><CountUp to={GOALS.length} /></dd><dt className="mt-1 text-[0.78rem] font-medium text-muted">objetivos para explorar</dt></div>
          </dl>
        </div>
        <div className="relative min-h-[24rem] overflow-hidden bg-[#f1eee7] lg:min-h-[38rem]">
          <img src={asset('brand/flatlay.webp')} alt="Composición de la línea Gold Roots con sus ingredientes" width="1400" height="800" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]" />
          {/* El degradado de la izquierda es lo que hace que la foto salga del panel blanco en vez de cortarse en seco. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface via-surface/70 to-transparent lg:w-32" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* Solo lo que esta web puede sostener por sí misma: lo que muestra, lo que enlaza y lo que no afirma.
   Los sellos de las piezas gráficas de la marca no se publican hasta tener su respaldo documental. */
function Quality() {
  const items = [
    { Icon: IconFlask, title: 'Fórmula completa', text: `Ingredientes, presentación y objetivo declarado en cada una de las ${PRODUCTS.length} fichas.` },
    { Icon: IconRoute, title: 'Información primero', text: 'Sin precios, sin carrito y sin presión: la página describe, no vende.' },
    { Icon: IconQrcode, title: 'Rutas que permanecen', text: 'Cada ficha conserva una dirección propia y un QR descargable para volver a consultarla.' },
    { Icon: IconShieldCheck, title: 'Límites claros', text: 'Suplementos alimenticios: no sustituyen una dieta variada ni reemplazan la consulta profesional.' },
  ];
  return (
    <section className="border-y border-line bg-surface" aria-labelledby="quality-title">
      <div className="wrap section">
        <Reveal><SectionHeading center eyebrow="Nuestra calidad" title={<span id="quality-title">Lo que esta página sí puede garantizar</span>} lead="Una declaración de calidad solo es útil si se puede comprobar en la propia web. Esto es lo que se puede verificar aquí, fórmula por fórmula." /></Reveal>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, text }, index) => (
            <li key={title}>
              <Reveal delay={index * 60}>
                <Icon size={24} stroke={1.5} className="text-accent-deep" aria-hidden="true" />
                <h3 className="mt-5 text-[1.12rem]">{title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="wrap section grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20" aria-labelledby="faq-title">
      <Reveal><SectionHeading eyebrow="Preguntas frecuentes" title={<span id="faq-title">Antes de explorar</span>} lead="La página presenta la información disponible en el catálogo y no sustituye la orientación de un profesional de la salud." /></Reveal>
      <div className="border-t border-line">
        <Accordion title="¿Puedo comprar desde esta página?" defaultOpen>No. Gold Roots funciona aquí como una experiencia corporativa e informativa. No hay precios, carrito, cantidades ni flujo de compra. Para cualquier consulta, el canal es WhatsApp.</Accordion>
        <Accordion title="¿Qué información tiene cada ficha?">Nombre, objetivo, descripción, ingredientes, presentación, beneficios declarados por el catálogo y un QR que abre la misma página.</Accordion>
        <Accordion title="¿El sitio recomienda qué suplemento tomar?">No. Las categorías ayudan a navegar la línea, pero no constituyen una recomendación médica ni reemplazan la evaluación de un profesional.</Accordion>
        <Accordion title="¿Para qué sirve el código QR?">Permite abrir y compartir la ficha informativa de un producto mediante una dirección estable. No afirma autenticidad por sí solo.</Accordion>
        <Accordion title="¿Son medicamentos?">No. Son suplementos alimenticios y no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.</Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="wrap pb-2" aria-labelledby="final-title">
      <div className="relative overflow-hidden rounded-[2rem] bg-night px-7 py-14 text-center text-white sm:px-12 sm:py-20">
        <span className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-accent/14 blur-3xl" aria-hidden="true" />
        <LeafMark className="relative mx-auto size-9" />
        <h2 id="final-title" className="relative mx-auto mt-5 max-w-3xl text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.98]">Encuentra la fórmula que quieres conocer.</h2>
        <p className="relative mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed text-white/62">Recorre el catálogo completo, filtra por objetivo o escribe directamente a la marca.</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/catalogo" className={buttonClass('primary')}>Explorar catálogo <IconArrowRight size={17} aria-hidden="true" /></Link>
          <a href={waLink(INFO_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonClass('ghost-dark')}><IconBrandWhatsapp size={17} aria-hidden="true" /> Contactar por WhatsApp</a>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  usePageMeta({
    title: 'Gold Roots Nutrition — Fórmulas para tu bienestar diario',
    description: `Conoce las ${PRODUCTS.length} fórmulas de Gold Roots Nutrition: ingredientes, objetivos, presentaciones y fichas informativas con QR.`,
    path: '/',
    image: 'brand/hero-cover.webp',
  });
  return <><Hero /><FloatBand /><Story /><Goals /><FormulaFinder /><Spotlight /><Collection /><BrandMoment /><Quality /><Faq /><FinalCta /></>;
}
