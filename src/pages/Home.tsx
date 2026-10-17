import { IconArrowRight, IconChevronLeft, IconChevronRight, IconLeaf, IconMessageCircle, IconSparkles, IconTag, IconTargetArrow } from '@tabler/icons-react';
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Link } from 'react-router';
import { FormulaFinder } from '@/components/FormulaFinder';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { Accordion, buttonClass, GOAL_ICONS, Reveal, SectionHeading, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { useOrder } from '@/lib/order';
import { countByGoal, featured, findProduct, GOALS, money, percentOff, PRODUCTS, type GoalId } from '@/lib/products';
import { site } from '@/lib/site';
import { GENERAL_MESSAGE, orderMessage, type OrderLine } from '@/lib/whatsapp';

const cheapest = Math.min(...PRODUCTS.flatMap((p) => (p.price == null ? [] : [p.price])));
const bestOff = Math.max(...PRODUCTS.map(percentOff));

/* ───────────────────────────── Portada ───────────────────────────── */

function HeroStage() {
  const box = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    el.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };
  const leave = () => {
    box.current?.style.setProperty('--mx', '0');
    box.current?.style.setProperty('--my', '0');
  };
  const shift = (x: number, y: number): CSSProperties => ({ translate: `calc(var(--mx, 0) * ${x}px) calc(var(--my, 0) * ${y}px)`, transition: 'translate 0.25s ease-out' });

  const back1 = findProduct('lions-mane-blend-complex')!;
  const back2 = findProduct('ashwagandha-melatonin-magnesium')!;
  const hero = findProduct('shilajit-gold')!;

  return (
    <div ref={box} onPointerMove={move} onPointerLeave={leave} className="relative mx-auto aspect-[1/1.05] w-full max-w-[34rem]" aria-hidden="true">
      <div className="animate-spin-slow absolute inset-[4%] rounded-full border-2 border-dashed border-white/20" />
      <div className="absolute inset-[16%] rounded-full bg-gradient-to-br from-sun/30 to-rose/30 blur-2xl" />

      <div className="absolute top-[10%] left-[0%] w-[38%]" style={shift(-18, 10)}>
        <div className={`g-${back1.goal} grad-goal -rotate-6 overflow-hidden rounded-[1.75rem] p-3 shadow-2xl ring-1 ring-white/30`}>
          <ProductImage product={back1} width={260} eager className="mx-auto w-full" />
        </div>
      </div>
      <div className="absolute top-[18%] right-[0%] w-[38%]" style={shift(18, 14)}>
        <div className={`g-${back2.goal} grad-goal rotate-6 overflow-hidden rounded-[1.75rem] p-3 shadow-2xl ring-1 ring-white/30`}>
          <ProductImage product={back2} width={260} eager className="mx-auto w-full" />
        </div>
      </div>
      <div className="absolute inset-x-[24%] top-[2%]" style={shift(0, -8)}>
        <div className="animate-float [--r:0deg]">
          <div className="grad-sun overflow-hidden rounded-[2.25rem] p-4 shadow-[0_40px_80px_-20px_rgb(255_93_59/0.7)] ring-2 ring-white/50">
            <ProductImage product={hero} width={420} eager className="mx-auto w-full" />
          </div>
        </div>
      </div>

      <div className="animate-float absolute top-[6%] right-[4%] hidden rounded-full bg-paper px-4 py-2 text-sm font-extrabold text-night shadow-xl [--r:3deg] [animation-delay:-2s] sm:block" style={shift(26, -10)}>
        ⚡ Energía
      </div>
      <div className="animate-float absolute bottom-[14%] left-[-2%] rounded-full bg-paper px-4 py-2 text-sm font-extrabold text-night shadow-xl [--r:-3deg] [animation-delay:-4s]" style={shift(-24, 12)}>
        🌱 Cápsulas vegetarianas
      </div>
      {bestOff > 0 && (
        <div className="animate-float absolute right-[2%] bottom-[8%] grid size-24 place-items-center rounded-full bg-lagoon text-center text-night shadow-xl [--r:8deg] [animation-delay:-1s]" style={shift(20, 18)}>
          <span className="font-display text-xs leading-tight font-extrabold">
            hasta
            <span className="block text-2xl leading-none">−{bestOff}%</span>
          </span>
        </div>
      )}
    </div>
  );
}

function Hero() {
  const stats = [
    { n: String(PRODUCTS.length), label: 'fórmulas' },
    { n: String(GOALS.length), label: 'objetivos' },
    { n: money(cheapest).replace('.00', ''), label: 'desde' },
  ];
  return (
    <section className="grain relative overflow-hidden bg-ink pt-32 pb-28 text-white sm:pt-40 sm:pb-36">
      <div className="animate-drift pointer-events-none absolute -top-40 -left-32 size-[34rem] rounded-full bg-violet-600/40 blur-3xl" aria-hidden="true" />
      <div className="animate-drift pointer-events-none absolute top-1/3 -right-40 size-[38rem] rounded-full bg-coral/35 blur-3xl [animation-delay:-5s]" aria-hidden="true" />
      <div className="animate-drift pointer-events-none absolute -bottom-52 left-1/3 size-[30rem] rounded-full bg-lagoon/25 blur-3xl [animation-delay:-9s]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/20 backdrop-blur [animation:sheet-up_0.6s_both]">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-wa opacity-70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-wa" />
            </span>
            Pedidos directos por WhatsApp
          </p>
          <h1 className="mt-6 text-[2.9rem] leading-[0.98] font-extrabold sm:text-7xl [animation:sheet-up_0.7s_0.1s_both]">
            Ingredientes de raíz.
            <span className="text-grad mt-1 block">Resultados poderosos.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl [animation:sheet-up_0.7s_0.2s_both]">
            Catorce fórmulas enfocadas en energía, corazón, mente, sueño, vista y defensas. Cápsulas vegetarianas, etiquetas claras y un pedido que armas aquí en segundos y envías por WhatsApp.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 [animation:sheet-up_0.7s_0.3s_both]">
            <Link to="/catalogo" className={buttonClass('sun')}>
              Armar mi pedido <IconArrowRight size={19} aria-hidden="true" />
            </Link>
            <a href="#buscador" className={buttonClass('ghost-light')}>
              <IconSparkles size={19} aria-hidden="true" /> Encuentra tu fórmula
            </a>
          </div>
          <dl className="mt-12 flex gap-8 sm:gap-12 [animation:sheet-up_0.7s_0.4s_both]">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-4xl font-extrabold sm:text-5xl">{s.n}</dd>
                <dt className="text-sm font-semibold text-white/60">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <HeroStage />
      </div>

      <svg className="absolute inset-x-0 bottom-[-1px] w-full text-cream" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 90V50C240 0 480 0 720 30s480 50 720 0v60z" />
      </svg>
    </section>
  );
}

/* ───────────────────────────── Cinta de ingredientes ───────────────────────────── */

const WORDS = ['Shilajit', 'Maca', 'Cúrcuma', 'Astaxantina', 'Melena de león', 'Ashwagandha', 'Magnesio', 'Zinc', 'Selenio', 'Cardo mariano', 'Remolacha', 'Coenzima Q10', 'Resveratrol', 'L-Arginina', 'Vitamina K2', 'Vitamina D3'];

function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <li key={w} className="flex items-center gap-8 font-display text-2xl font-extrabold whitespace-nowrap text-fg sm:text-3xl">
          {w}
          <IconLeaf size={24} className="text-white" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative z-10 -mt-6 -rotate-1 overflow-hidden bg-gradient-to-r from-sun via-coral to-rose py-4 shadow-xl" aria-label="Algunos de los ingredientes de la línea">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ───────────────────────────── Objetivos ───────────────────────────── */

function Goals() {
  return (
    <section aria-labelledby="objetivos-title" className="mx-auto mt-28 max-w-6xl px-5">
      <Reveal>
        <SectionHeading eyebrow="Elige por objetivo" title={<span id="objetivos-title">¿Qué quieres cuidar hoy?</span>} lead="Cada fórmula tiene un trabajo claro. Empieza por lo que quieres apoyar y te mostramos lo que encaja." />
      </Reveal>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GOALS.map((g, i) => {
          const IconG = GOAL_ICONS[g.id];
          return (
            <li key={g.id}>
              <Reveal delay={i * 70} className="h-full">
                <Link to={`/catalogo?objetivo=${g.slug}`} className={`g-${g.id} card-lift group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface p-7 ring-1 ring-line`}>
                  <span className="soft-goal absolute -top-12 -right-12 size-44 rounded-full transition duration-500 group-hover:scale-[1.8]" aria-hidden="true" />
                  <span className="grad-goal relative grid size-16 place-items-center rounded-2xl text-white shadow-lg transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <IconG size={32} aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-6 font-display text-2xl font-extrabold">{g.label}</h3>
                  <p className="relative mt-2 flex-1 leading-relaxed text-muted">{g.blurb}</p>
                  <span className="relative mt-6 flex items-center justify-between text-sm font-bold">
                    <span className="text-goal">{countByGoal(g.id)} {countByGoal(g.id) === 1 ? 'fórmula' : 'fórmulas'}</span>
                    <span className="grid size-10 place-items-center rounded-full bg-inv text-inv-fg transition group-hover:translate-x-1 group-hover:bg-coral">
                      <IconArrowRight size={18} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ───────────────────────────── Favoritos (carrusel con pestañas) ───────────────────────────── */

function Favorites() {
  const [tab, setTab] = useState<'favoritos' | GoalId>('favoritos');
  const row = useRef<HTMLUListElement>(null);
  const list = tab === 'favoritos' ? featured() : PRODUCTS.filter((p) => p.goal === tab);
  const scroll = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  const chip = (active: boolean) => `shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${active ? 'bg-inv text-inv-fg shadow-lg' : 'bg-surface text-fg ring-1 ring-line hover:bg-sun/40'}`;

  return (
    <section aria-labelledby="favoritos-title" className="mt-28">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5">
        <Reveal>
          <SectionHeading eyebrow="Lo más pedido" title={<span id="favoritos-title">Las favoritas de la línea</span>} />
        </Reveal>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} className="grid size-12 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:bg-inv hover:text-inv-fg" aria-label="Productos anteriores">
            <IconChevronLeft size={22} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scroll(1)} className="grid size-12 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:bg-inv hover:text-inv-fg" aria-label="Productos siguientes">
            <IconChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-5">
        <div role="group" aria-label="Filtrar las favoritas" className="scroll-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          <button type="button" aria-pressed={tab === 'favoritos'} onClick={() => setTab('favoritos')} className={chip(tab === 'favoritos')}>
            ⭐ Favoritas
          </button>
          {GOALS.map((g) => (
            <button key={g.id} type="button" aria-pressed={tab === g.id} onClick={() => setTab(g.id)} className={chip(tab === g.id)}>
              {g.short}
            </button>
          ))}
        </div>
      </div>

      <ul ref={row} key={tab} className="scroll-x mx-auto mt-6 flex max-w-[90rem] snap-x snap-mandatory gap-5 overflow-x-auto px-5 pt-2 pb-10 [animation:sheet-up_0.4s_both] sm:px-[max(1.25rem,calc((100vw_-_72rem)/2_+_1.25rem))] scroll-px-5 sm:scroll-px-[max(1.25rem,calc((100vw_-_72rem)/2_+_1.25rem))]">
        {list.map((p) => (
          <li key={p.slug} className="w-[17.5rem] shrink-0 snap-start sm:w-[19rem]">
            <ProductCard product={p} />
          </li>
        ))}
        <li className="grid w-[17.5rem] shrink-0 snap-start place-items-center sm:w-[19rem]">
          <Link to="/catalogo" className={buttonClass('outline')}>
            Ver las {PRODUCTS.length} fórmulas <IconArrowRight size={18} aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </section>
  );
}

/* ───────────────────────────── Cómo pedir (con vista previa del mensaje) ───────────────────────────── */

const SAMPLE: OrderLine[] = [
  { product: findProduct('zinc-triple-play')!, qty: 2 },
  { product: findProduct('maca-root-extra-strength')!, qty: 1 },
];

function HowTo() {
  const { lines } = useOrder();
  const real = lines.length > 0;
  const message = orderMessage(real ? lines : SAMPLE, { name: real ? '' : 'Tu nombre', place: real ? '' : 'Tu ciudad' });
  const steps = [
    { n: 1, title: 'Elige tus fórmulas', text: 'Recorre el catálogo o usa el buscador y agrega lo que quieras con un toque.' },
    { n: 2, title: 'Revisa «Mi pedido»', text: 'Ajusta las cantidades y mira el total referencial al instante. No se cobra nada aquí.' },
    { n: 3, title: 'Envíalo por WhatsApp', text: 'Se abre el chat con tu pedido ya escrito. Confirmamos disponibilidad, envío y pago contigo.' },
  ];
  return (
    <section aria-labelledby="como-title" className="mx-auto mt-28 max-w-6xl px-5">
      <div className="grain relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 text-white sm:px-14">
        <div className="animate-drift pointer-events-none absolute -top-32 -left-20 size-96 rounded-full bg-wa/20 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading light eyebrow="Así de fácil" title={<span id="como-title">Pídelo en tres pasos</span>} lead="Sin crear cuentas, sin tarjetas y sin esperar a que alguien te responda un formulario." />
            <ol className="mt-10 space-y-6">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span className="grad-sun grid size-12 shrink-0 place-items-center rounded-2xl font-display text-xl font-extrabold text-night shadow-lg shadow-coral/30">{s.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-white/70">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/catalogo" className={`${buttonClass('sun')} mt-10`}>
              Empezar mi pedido <IconArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>

          <figure className="mx-auto w-full max-w-sm">
            <div className="rounded-[2.5rem] bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur">
              <div className="overflow-hidden rounded-[2rem] bg-[#e7ddd0] text-fg">
                <div className="flex items-center gap-3 bg-[#0b6b3a] px-4 py-3 text-white">
                  <span className="grad-sun grid size-9 place-items-center rounded-full text-night">
                    <IconLeaf size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm leading-tight font-bold">{site.brand}</p>
                    <p className="text-xs text-white/70">en línea</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-3.5 text-[0.8rem] leading-relaxed whitespace-pre-line shadow-sm">{message}</div>
                </div>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-sm text-white/60">{real ? 'Este es el mensaje de tu pedido de ahora mismo.' : 'Así llega tu pedido (ejemplo). Se arma solo con lo que elijas.'}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Por qué, ingredientes, mayoristas, preguntas ───────────────────────────── */

function Why() {
  const items = [
    { Icon: IconTargetArrow, title: 'Fórmulas enfocadas', text: 'Cada producto tiene un trabajo claro, en vez de una pared de frascos parecidos.', tone: 'bg-sun' },
    { Icon: IconLeaf, title: 'Cápsulas vegetarianas', text: 'Sin relleno innecesario, con ingredientes de larga tradición de uso.', tone: 'bg-lagoon' },
    { Icon: IconTag, title: 'Etiquetas claras', text: 'Ves exactamente qué lleva cada fórmula, ingrediente por ingrediente.', tone: 'bg-rose' },
    { Icon: IconMessageCircle, title: 'Atención por chat', text: 'Resolvemos dudas y coordinamos el pedido directo en WhatsApp.', tone: 'bg-violet-400' },
  ];
  return (
    <section aria-labelledby="porque-title" className="mx-auto mt-28 max-w-6xl px-5">
      <Reveal>
        <SectionHeading center eyebrow="Por qué Gold Roots" title={<span id="porque-title">Puro, seguro y efectivo</span>} lead="Una línea pequeña a propósito: pocas fórmulas, bien pensadas, para que elijas por lo que quieres lograr." />
      </Reveal>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text, tone }, i) => (
          <li key={title}>
            <Reveal delay={i * 80} className="h-full">
              <div className="card-lift h-full rounded-[2rem] bg-surface p-7 ring-1 ring-line">
                <span className={`grid size-14 place-items-center rounded-2xl text-night ${tone}`}>
                  <Icon size={28} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

const INGREDIENTS: Array<[string, string]> = [
  ['Shilajit', 'shilajit'],
  ['Maca', 'maca'],
  ['Cúrcuma', 'curcuma'],
  ['Astaxantina', 'astaxantina'],
  ['Melena de león', 'melena'],
  ['Ashwagandha', 'ashwagandha'],
  ['Magnesio', 'magnesio'],
  ['Zinc', 'zinc'],
  ['Selenio', 'selenio'],
  ['Cardo mariano', 'cardo'],
  ['Remolacha', 'remolacha'],
  ['Coenzima Q10', 'coenzima'],
  ['Resveratrol', 'resveratrol'],
  ['L-Arginina', 'arginina'],
  ['Vitamina D3', 'd3'],
  ['Zeaxantina', 'zeaxantina'],
];

function Ingredients() {
  return (
    <section aria-labelledby="ingredientes-title" className="mx-auto mt-28 max-w-6xl px-5">
      <Reveal>
        <SectionHeading eyebrow="Busca por ingrediente" title={<span id="ingredientes-title">¿Ya sabes lo que buscas?</span>} lead="Toca un ingrediente y te mostramos las fórmulas que lo llevan." />
      </Reveal>
      <ul className="mt-8 flex flex-wrap gap-3">
        {INGREDIENTS.map(([label, q], i) => (
          <li key={q}>
            <Link to={`/catalogo?q=${q}`} className={`inline-flex min-h-11 items-center rounded-full px-5 font-display text-base font-bold ring-1 ring-line transition hover:-translate-y-0.5 hover:bg-inv hover:text-inv-fg ${i % 3 === 0 ? 'bg-sun/35' : i % 3 === 1 ? 'bg-surface' : 'bg-lagoon/25'}`}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function WholesaleBanner() {
  return (
    <section aria-labelledby="mayor-title" className="mx-auto mt-28 max-w-6xl px-5">
      <div className="grad-sun grain relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-night sm:px-14">
        <div className="absolute -right-6 -bottom-10 hidden size-80 rotate-12 overflow-hidden rounded-[3rem] bg-white/30 md:block" aria-hidden="true">
          <ProductImage product={findProduct('maca-root-extra-strength')!} width={320} className="absolute inset-0 size-full object-contain p-4" />
        </div>
        <div className="relative max-w-2xl">
          <p className="text-xs font-extrabold tracking-[0.2em] uppercase">Tiendas, farmacias y distribuidores</p>
          <h2 id="mayor-title" className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">
            Lleva la línea a tu tienda
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-fg/80">Catorce fórmulas con fotos, fichas y un QR por producto listos para exhibir. Cuéntanos de tu negocio y te respondemos por WhatsApp.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/mayoristas" className={buttonClass('ink')}>
              Quiero vender Gold Roots <IconArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto mt-28 grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Reveal>
        <SectionHeading eyebrow="Preguntas frecuentes" title={<span id="faq-title">Lo que más nos preguntan</span>} lead="¿Otra duda? Escríbenos y la resolvemos en el chat." />
        <WhatsAppButton text={GENERAL_MESSAGE} className="mt-7">
          Preguntar por WhatsApp
        </WhatsAppButton>
      </Reveal>
      <Reveal delay={100}>
        <div className="border-t border-line">
          <Accordion title="¿Cómo hago mi pedido?" defaultOpen>
            Agrega las fórmulas a «Mi pedido» y toca «Enviar mi pedido por WhatsApp». Se abre el chat con la lista, las cantidades y el total referencial ya escritos; solo lo envías.
          </Accordion>
          <Accordion title="¿Puedo pagar en la página?">No. Esta es una vitrina informativa: no hay carrito ni pago en línea. La disponibilidad, el envío y la forma de pago se confirman contigo en la conversación.</Accordion>
          <Accordion title="¿Hacen envíos a mi país?">El envío y su costo se coordinan por WhatsApp según tu ciudad o país. Indícalo en tu pedido para que la respuesta sea más rápida.</Accordion>
          <Accordion title="¿Cómo se toman las cápsulas?">Cada frasco trae 60 cápsulas vegetarianas. Sigue siempre la indicación de la etiqueta y consulta con un profesional de la salud antes de empezar, sobre todo si estás embarazada, en lactancia o tomas medicamentos.</Accordion>
          <Accordion title="¿Para qué sirve el código QR de cada producto?">Cada ficha genera un QR que abre esa misma página. Puedes imprimirlo para el envase, un exhibidor o una hoja de catálogo.</Accordion>
          <Accordion title="¿Son medicamentos?">No. Son suplementos alimenticios y no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.</Accordion>
        </div>
      </Reveal>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="mx-auto mt-28 max-w-6xl px-5">
      <div className="grain relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center text-white sm:px-14">
        <div className="animate-drift pointer-events-none absolute -top-24 left-1/4 size-80 rounded-full bg-coral/40 blur-3xl" aria-hidden="true" />
        <div className="animate-drift pointer-events-none absolute -right-10 -bottom-24 size-80 rounded-full bg-violet-600/40 blur-3xl [animation-delay:-7s]" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <h2 id="final-title" className="text-4xl leading-tight font-extrabold sm:text-6xl">
            Empieza hoy con <span className="text-grad">tu fórmula</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">Escoge, arma tu pedido y escríbenos. Del otro lado hay una persona lista para ayudarte.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/catalogo" className={buttonClass('sun')}>
              Ver el catálogo <IconArrowRight size={19} aria-hidden="true" />
            </Link>
            <WhatsAppButton text={GENERAL_MESSAGE}>
              Hablar con nosotros
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  usePageMeta({
    title: 'Gold Roots Nutrition — Nutrición esencial para tu bienestar diario',
    description: 'Catorce suplementos enfocados en energía, corazón, mente, sueño, vista y piel, y defensas. Fórmulas puras, seguras y efectivas. Arma tu pedido y envíalo por WhatsApp.',
    path: '/',
    image: 'products/shilajit-gold.webp',
  });
  return (
    <>
      <Hero />
      <Marquee />
      <Goals />
      <FormulaFinder />
      <Favorites />
      <HowTo />
      <Why />
      <Ingredients />
      <WholesaleBanner />
      <Faq />
      <FinalCta />
    </>
  );
}
