import { IconArrowRight, IconChevronLeft, IconChevronRight, IconFlask, IconLeaf, IconMessageCircle, IconSearch, IconTargetArrow, IconTruckDelivery } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { FormulaFinder } from '@/components/FormulaFinder';
import { ProductCard, ProductImage } from '@/components/ProductCard';
import { Accordion, buttonClass, GOAL_ICONS, Reveal, SectionHeading, TrustMarks, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { useOrder } from '@/lib/order';
import { countByGoal, featured, findProduct, GOALS, money, PRODUCTS, type GoalId } from '@/lib/products';
import { site } from '@/lib/site';
import { GENERAL_MESSAGE, orderMessage, type OrderLine } from '@/lib/whatsapp';

const cheapest = Math.min(...PRODUCTS.flatMap((p) => (p.price == null ? [] : [p.price])));

/* ───────────────────────────── Portada ───────────────────────────── */

function Hero() {
  const hero = findProduct('shilajit-gold')!;
  const alsoOnScreen = featured().filter((p) => p.slug !== hero.slug).slice(0, 3);
  const stats = [
    { n: String(PRODUCTS.length), label: 'fórmulas' },
    { n: String(GOALS.length), label: 'objetivos' },
    { n: money(cheapest).replace('.00', ''), label: 'desde' },
  ];
  return (
    <section className="border-b border-line bg-canvas">
      <div className="wrap grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p className="eyebrow">Suplementos en cápsulas vegetarianas</p>
          <h1 className="mt-3 text-[2.35rem] leading-[1.08] font-medium sm:text-[3.1rem]">
            Ingredientes de raíz.
            <span className="mt-1 block text-accent">Formulados con criterio.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.08rem] leading-relaxed text-muted">
            {PRODUCTS.length} fórmulas enfocadas en energía, corazón, mente, sueño, vista y defensas. Etiquetas claras, sin relleno, y un pedido que armas aquí en segundos y envías por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link to="/catalogo" className={buttonClass('primary')}>
              Ver el catálogo <IconArrowRight size={17} aria-hidden="true" />
            </Link>
            <a href="#buscador" className={buttonClass('outline')}>
              <IconSearch size={17} aria-hidden="true" /> Encuentra tu fórmula
            </a>
          </div>
          <div className="mt-9 border-t border-line pt-6">
            <TrustMarks
              items={[
                { Icon: IconLeaf, text: 'Cápsulas vegetarianas' },
                { Icon: IconFlask, text: 'Etiqueta ingrediente por ingrediente' },
                { Icon: IconMessageCircle, text: 'Atención directa por WhatsApp' },
              ]}
            />
          </div>
        </div>

        <div className="relative">
          <div className={`g-${hero.goal} goal-block overflow-hidden rounded-[1.5rem] p-6 sm:p-10`}>
            <ProductImage product={hero} width={520} eager className="mx-auto h-[20rem] w-auto object-contain sm:h-[26rem]" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {alsoOnScreen.map((p) => (
              <Link key={p.slug} to={`/${`producto/${p.slug}`}`} className={`g-${p.goal} goal-block card group relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl transition-colors hover:ring-1 hover:ring-line-strong`}>
                <ProductImage product={p} width={200} className="h-[68%] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.05]" />
                <span className="absolute bottom-1.5 left-2 max-w-[90%] truncate text-[0.68rem] font-medium text-fg/70">{p.name}</span>
              </Link>
            ))}
          </div>
          <dl className="mt-6 flex divide-x divide-line rounded-xl border border-line bg-surface">
            {stats.map((s) => (
              <div key={s.label} className="flex-1 px-4 py-3">
                <dd className="font-display text-[1.45rem] leading-none font-medium">{s.n}</dd>
                <dt className="mt-1 text-[0.78rem] text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Compra por objetivo ───────────────────────────── */

function Goals() {
  return (
    <section aria-labelledby="objetivos-title" className="wrap section">
      <Reveal>
        <SectionHeading eyebrow="Compra por objetivo" title={<span id="objetivos-title">¿Qué quieres apoyar?</span>} lead="Cada fórmula tiene un trabajo claro. Empieza por lo que quieres lograr y te mostramos lo que encaja." />
      </Reveal>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GOALS.map((g, i) => {
          const IconG = GOAL_ICONS[g.id];
          const n = countByGoal(g.id);
          return (
            <li key={g.id}>
              <Reveal delay={Math.min(i, 5) * 50} className="h-full">
                <Link to={`/catalogo?objetivo=${g.slug}`} className={`g-${g.id} card card-lift group flex h-full flex-col p-6`}>
                  <span className="goal-block text-goal grid size-11 place-items-center rounded-xl transition-colors group-hover:bg-[color-mix(in_srgb,var(--gb)_70%,var(--gi))]">
                    <IconG size={21} stroke={1.9} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.15rem] font-medium">{g.label}</h3>
                  <p className="mt-1.5 flex-1 text-[0.9rem] leading-relaxed text-muted">{g.blurb}</p>
                  <span className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[0.82rem] font-semibold text-fg">
                    {n} {n === 1 ? 'fórmula' : 'fórmulas'}
                    <IconArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
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
  const chip = (active: boolean) => `shrink-0 rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors ${active ? 'bg-night text-white' : 'border border-line-strong bg-surface text-muted hover:border-fg hover:text-fg'}`;

  return (
    <section aria-labelledby="favoritos-title" className="border-y border-line bg-sand">
      <div className="wrap section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading eyebrow="Lo más pedido" title={<span id="favoritos-title">Las favoritas de la línea</span>} />
          </Reveal>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scroll(-1)} className="grid size-10 place-items-center rounded-full border border-line-strong bg-surface text-fg transition-colors hover:bg-night hover:text-white" aria-label="Productos anteriores">
              <IconChevronLeft size={19} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scroll(1)} className="grid size-10 place-items-center rounded-full border border-line-strong bg-surface text-fg transition-colors hover:bg-night hover:text-white" aria-label="Productos siguientes">
              <IconChevronRight size={19} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div role="group" aria-label="Filtrar las favoritas" className="scroll-x -mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          <button type="button" aria-pressed={tab === 'favoritos'} onClick={() => setTab('favoritos')} className={chip(tab === 'favoritos')}>
            Favoritas
          </button>
          {GOALS.map((g) => (
            <button key={g.id} type="button" aria-pressed={tab === g.id} onClick={() => setTab(g.id)} className={chip(tab === g.id)}>
              {g.short}
            </button>
          ))}
        </div>

        <ul ref={row} key={tab} className="scroll-x mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [animation:fade-in_0.3s_both]">
          {list.map((p) => (
            <li key={p.slug} className="w-[16.5rem] shrink-0 snap-start sm:w-[17.5rem]">
              <ProductCard product={p} />
            </li>
          ))}
          <li className="grid w-[16.5rem] shrink-0 snap-start place-items-center sm:w-[17.5rem]">
            <Link to="/catalogo" className={buttonClass('outline', 'w-full justify-center')}>
              Ver las {PRODUCTS.length} <IconArrowRight size={16} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </div>
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
    { n: '01', title: 'Elige tus fórmulas', text: 'Recorre el catálogo o usa el buscador y agrega lo que quieras.' },
    { n: '02', title: 'Revisa «Mi pedido»', text: 'Ajusta las cantidades y mira el total referencial al instante. Aquí no se cobra nada.' },
    { n: '03', title: 'Envíalo por WhatsApp', text: 'Se abre el chat con tu pedido ya escrito. Confirmamos disponibilidad, envío y pago contigo.' },
  ];
  return (
    <section aria-labelledby="como-title" className="wrap section">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeading as="h2" eyebrow="Cómo pedir" title={<span id="como-title">Tres pasos, sin cuentas ni tarjetas</span>} lead="La vitrina no cobra: escribe tu pedido y lo coordinamos en el chat." />
          <ol className="mt-9 space-y-6">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="font-display text-[0.95rem] leading-none font-medium text-accent">{s.n}</span>
                <div className="border-l border-line pl-5">
                  <h3 className="font-display text-[1.1rem] font-medium">{s.title}</h3>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/catalogo" className={`${buttonClass('primary')} mt-9`}>
            Empezar mi pedido <IconArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <Reveal delay={80}>
          <figure className="mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_20px_50px_-30px_rgb(35_35_31/0.35)]">
              <div className="flex items-center gap-3 border-b border-line bg-sand px-4 py-3">
                <span className="grid size-8 place-items-center rounded-lg bg-night text-white">
                  <IconLeaf size={16} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[0.85rem] leading-tight font-semibold">{site.brand}</p>
                  <p className="text-[0.72rem] text-muted">WhatsApp</p>
                </div>
              </div>
              <div className="bg-[#eae6dd] p-4">
                <div className="ml-auto max-w-[92%] rounded-xl rounded-tr-sm bg-[#dff0d8] p-3.5 text-[0.8rem] leading-relaxed whitespace-pre-line text-fg">{message}</div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-[0.82rem] text-muted">{real ? 'Este es el mensaje de tu pedido de ahora mismo.' : 'Así llega tu pedido (ejemplo). Se arma solo con lo que elijas.'}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── Por qué, ingredientes, mayoristas, preguntas ───────────────────────────── */

function Why() {
  const items = [
    { Icon: IconTargetArrow, title: 'Fórmulas enfocadas', text: 'Cada producto tiene un trabajo claro, en vez de una pared de frascos parecidos.' },
    { Icon: IconFlask, title: 'Etiquetas claras', text: 'Ves exactamente qué lleva cada fórmula, ingrediente por ingrediente y en su cantidad.' },
    { Icon: IconLeaf, title: 'Cápsulas vegetarianas', text: 'Sin relleno innecesario, con ingredientes de larga tradición de uso.' },
    { Icon: IconTruckDelivery, title: 'Trato directo', text: 'Disponibilidad, envío y pago se conversan contigo, sin intermediarios ni formularios que no responden.' },
  ];
  return (
    <section aria-labelledby="porque-title" className="border-y border-line bg-surface">
      <div className="wrap section">
        <Reveal>
          <SectionHeading center eyebrow="Por qué Gold Roots" title={<span id="porque-title">Poca línea, bien pensada</span>} lead="Prefiere pocas fórmulas con un objetivo claro antes que un catálogo que repite lo mismo en doce frascos." />
        </Reveal>
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={Math.min(i, 5) * 60} className="h-full">
                <div className="h-full">
                  <span className="grid size-10 place-items-center rounded-xl bg-sand text-fg">
                    <Icon size={20} stroke={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.05rem] font-medium">{title}</h3>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
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
    <section aria-labelledby="ingredientes-title" className="wrap section">
      <Reveal>
        <SectionHeading eyebrow="Busca por ingrediente" title={<span id="ingredientes-title">¿Ya sabes lo que buscas?</span>} lead="Toca un ingrediente y te mostramos las fórmulas que lo llevan." />
      </Reveal>
      <ul className="mt-8 flex flex-wrap gap-2">
        {INGREDIENTS.map(([label, q]) => (
          <li key={q}>
            <Link to={`/catalogo?q=${q}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong bg-surface px-4 text-[0.88rem] font-medium text-fg transition-colors hover:border-fg hover:bg-night hover:text-white">
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
    <section aria-labelledby="mayor-title" className="wrap pb-4">
      <div className="g-immune goal-block rounded-2xl p-8 sm:p-12">
        <div className="max-w-2xl">
          <p className="eyebrow !text-[color:var(--gi)]">Tiendas, farmacias y distribuidores</p>
          <h2 id="mayor-title" className="mt-2 font-display text-[1.75rem] leading-[1.2] font-medium sm:text-[2.1rem]">
            Lleva la línea a tu tienda
          </h2>
          <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[color:var(--gi)]">
            {PRODUCTS.length} fórmulas con fotos, fichas y un QR por producto listos para exhibir. Cuéntanos de tu negocio y te respondemos por WhatsApp.
          </p>
          <div className="mt-7">
            <Link to="/mayoristas" className={buttonClass('night')}>
              Quiero vender Gold Roots <IconArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="wrap section grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <Reveal>
        <SectionHeading eyebrow="Preguntas frecuentes" title={<span id="faq-title">Lo que más nos preguntan</span>} lead="¿Otra duda? Escríbenos y la resolvemos en el chat." />
        <WhatsAppButton text={GENERAL_MESSAGE} variant="outline" className="mt-6">
          Preguntar por WhatsApp
        </WhatsAppButton>
      </Reveal>
      <Reveal delay={80}>
        <div className="border-t border-line">
          <Accordion title="¿Cómo hago mi pedido?" defaultOpen>
            Agrega las fórmulas a «Mi pedido» y toca «Enviar mi pedido por WhatsApp». Se abre el chat con la lista, las cantidades y el total referencial ya escritos; solo lo envías.
          </Accordion>
          <Accordion title="¿Puedo pagar en la página?">No. Esta es una vitrina informativa: no hay carrito ni pago en línea. La disponibilidad, el envío y la forma de pago se confirman contigo en la conversación.</Accordion>
          <Accordion title="¿Hacen envíos a mi país?">El envío y su costo se coordinan por WhatsApp según tu ciudad o país. Indícalo en tu pedido para que la respuesta sea más rápida.</Accordion>
          <Accordion title="¿Cómo se toman las cápsulas?">Sigue siempre la indicación de la etiqueta y consulta con un profesional de la salud antes de empezar, sobre todo si estás embarazada, en lactancia o tomas medicamentos.</Accordion>
          <Accordion title="¿Para qué sirve el código QR de cada producto?">Cada ficha genera un QR que abre esa misma página. Puedes imprimirlo para el envase, un exhibidor o una hoja de catálogo.</Accordion>
          <Accordion title="¿Son medicamentos?">No. Son suplementos alimenticios y no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.</Accordion>
        </div>
      </Reveal>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="border-t border-line bg-night">
      <div className="wrap py-16 text-center sm:py-20">
        <h2 id="final-title" className="mx-auto max-w-2xl font-display text-[1.8rem] leading-[1.2] font-medium text-white sm:text-[2.3rem]">
          Empieza por el objetivo, no por el frasco
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[1.02rem] leading-relaxed text-white/65">Escoge, arma tu pedido y escríbenos. Del otro lado hay una persona lista para ayudarte.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link to="/catalogo" className={buttonClass('primary')}>
            Ver el catálogo <IconArrowRight size={17} aria-hidden="true" />
          </Link>
          <WhatsAppButton text={GENERAL_MESSAGE} variant="light">
            Hablar con nosotros
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  usePageMeta({
    title: 'Gold Roots Nutrition — Suplementos en cápsulas vegetarianas',
    description: 'Catorce suplementos enfocados en energía, corazón, mente, sueño, vista y piel, y defensas. Fórmulas claras, en cápsulas vegetarianas. Arma tu pedido y envíalo por WhatsApp.',
    path: '/',
    image: 'products/shilajit-gold.webp',
  });
  return (
    <>
      <Hero />
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
