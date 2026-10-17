import { IconBuildingStore, IconQrcode, IconTags, IconTruckDelivery } from '@tabler/icons-react';
import { Link } from 'react-router';
import { InquiryForm } from '@/components/InquiryForm';
import { PageHero } from '@/components/PageHero';
import { GoalBadge, Pending, PriceTag, Reveal, SectionHeading } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { PRODUCTS, productPath } from '@/lib/products';

const PERKS = [
  { Icon: IconTags, title: 'Una línea corta y clara', text: 'Catorce fórmulas organizadas por objetivo: fáciles de explicar y de exhibir.' },
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

      <section aria-labelledby="ventajas-title" className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading eyebrow="Qué recibes" title={<span id="ventajas-title">Una línea lista para la repisa</span>} />
        </Reveal>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 70} className="h-full">
                <div className="card-lift h-full rounded-[2rem] bg-surface p-7 ring-1 ring-line">
                  <span className="grad-sun grid size-14 place-items-center rounded-2xl text-night">
                    <Icon size={28} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-extrabold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Pending>pedido mínimo, cantidades por caja y precios por volumen</Pending>
        </p>
      </section>

      <section aria-labelledby="lista-title" className="mx-auto mt-24 max-w-6xl px-5">
        <Reveal>
          <SectionHeading eyebrow="Toda la línea" title={<span id="lista-title">Catorce productos, un solo catálogo</span>} />
        </Reveal>
        <div className="mt-8 overflow-x-auto rounded-[2rem] bg-surface ring-1 ring-line">
          <table className="w-full min-w-[40rem] text-left">
            <caption className="sr-only">La línea completa de Gold Roots con el objetivo de cada fórmula y su precio al público</caption>
            <thead>
              <tr className="border-b border-line text-xs tracking-[0.14em] text-muted uppercase">
                <th scope="col" className="px-6 py-4 font-extrabold">Fórmula</th>
                <th scope="col" className="px-6 py-4 font-extrabold">Objetivo</th>
                <th scope="col" className="px-6 py-4 font-extrabold">Presentación</th>
                <th scope="col" className="px-6 py-4 font-extrabold">Precio al público</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.slug} className="border-b border-line/60 last:border-0 hover:bg-sun/10">
                  <th scope="row" className="px-6 py-4 font-display text-base font-extrabold">
                    <Link to={`/${productPath(p.slug)}`} className="hover:text-coral-deep">
                      {p.name}
                    </Link>
                  </th>
                  <td className="px-6 py-4">
                    <GoalBadge goal={p.goal} small />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{p.format || 'Por confirmar'}</td>
                  <td className="px-6 py-4">
                    <PriceTag product={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="consulta-title" className="mx-auto mt-24 grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading eyebrow="Escríbenos" title={<span id="consulta-title">Cuéntanos de tu negocio</span>} lead="Llena el formulario y se abre WhatsApp con tu mensaje ya escrito. Te respondemos con las condiciones para mayoristas." />
          <p className="mt-6">
            <Pending>número de WhatsApp exclusivo para mayoristas</Pending>
          </p>
        </Reveal>
        <Reveal delay={100}>
          <InquiryForm kind="wholesale" />
        </Reveal>
      </section>
    </>
  );
}
