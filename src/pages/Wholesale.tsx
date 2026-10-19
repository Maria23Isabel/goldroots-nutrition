import { IconBuildingStore, IconQrcode, IconTags, IconTruckDelivery } from '@tabler/icons-react';
import { Link } from 'react-router';
import { InquiryForm } from '@/components/InquiryForm';
import { PageHero } from '@/components/PageHero';
import { GoalBadge, Pending, PriceTag, Reveal, SectionHeading } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { PRODUCTS, productPath } from '@/lib/products';

const PERKS = [
  { Icon: IconTags, title: 'Una línea corta y clara', text: `${PRODUCTS.length} fórmulas organizadas por objetivo: fáciles de explicar y de exhibir.` },
  { Icon: IconQrcode, title: 'Un QR por producto', text: 'Cada ficha genera su código QR para el envase, el exhibidor o tu catálogo.' },
  { Icon: IconBuildingStore, title: 'Material listo', text: 'Fotos limpias, descripciones y listas de ingredientes por cada fórmula.' },
  { Icon: IconTruckDelivery, title: 'Trato directo', text: 'Cantidades, precios y envíos se conversan contigo por WhatsApp.' },
];

export function Wholesale() {
  usePageMeta({
    title: 'Mayoristas y distribuidores — Gold Roots Nutrition',
    description: 'Lleva la línea Gold Roots Nutrition a tu tienda, farmacia o red de distribución. Cuéntanos de tu negocio por WhatsApp.',
    path: '/mayoristas',
  });
  return (
    <>
      <PageHero eyebrow="Mayoristas y distribución" title="Lleva la línea a tu tienda" lead="Si tienes una tienda, farmacia, gimnasio o red de venta, hablemos. Te contamos cómo trabajar con Gold Roots Nutrition." />

      <section aria-labelledby="ventajas-title" className="wrap section">
        <Reveal>
          <SectionHeading eyebrow="Qué recibes" title={<span id="ventajas-title">Una línea lista para la repisa</span>} />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={Math.min(i, 5) * 60} className="h-full">
                <div className="card card-lift h-full p-6">
                  <span className="grid size-10 place-items-center rounded-xl bg-sand text-fg">
                    <Icon size={20} stroke={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.02rem] font-medium">{title}</h3>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Pending>pedido mínimo, cantidades por caja y precios por volumen</Pending>
        </p>
      </section>

      <section aria-labelledby="lista-title" className="border-y border-line bg-surface">
        <div className="wrap section">
          <Reveal>
            <SectionHeading eyebrow="Toda la línea" title={<span id="lista-title">{PRODUCTS.length} productos, un solo catálogo</span>} lead="El precio que ves aquí es el de la vitrina al público; las condiciones por volumen se conversan contigo." />
          </Reveal>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[40rem] text-left">
              <caption className="sr-only">La línea completa de Gold Roots con el objetivo de cada fórmula y su precio al público</caption>
              <thead>
                <tr className="border-b border-line bg-canvas text-[0.72rem] tracking-[0.12em] text-muted uppercase">
                  <th scope="col" className="px-5 py-3 font-semibold">Fórmula</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Objetivo</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Presentación</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Precio al público</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.slug} className="border-b border-line/70 last:border-0 transition-colors hover:bg-sand/60">
                    <th scope="row" className="px-5 py-3.5 font-display text-[0.95rem] font-medium">
                      <Link to={`/${productPath(p.slug)}`} className="transition-colors hover:text-accent">
                        {p.name}
                      </Link>
                    </th>
                    <td className="px-5 py-3.5">
                      <GoalBadge goal={p.goal} small />
                    </td>
                    <td className="px-5 py-3.5 text-[0.85rem] text-muted">{p.format || 'Por confirmar'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <PriceTag product={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="consulta-title" className="wrap section grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <SectionHeading eyebrow="Escríbenos" title={<span id="consulta-title">Cuéntanos de tu negocio</span>} lead="Llena el formulario y se abre WhatsApp con tu mensaje ya escrito. Te respondemos con las condiciones para mayoristas." />
          <p className="mt-5">
            <Pending>número de WhatsApp exclusivo para mayoristas</Pending>
          </p>
        </Reveal>
        <Reveal delay={90}>
          <InquiryForm kind="wholesale" />
        </Reveal>
      </section>
    </>
  );
}
