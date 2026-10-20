import { IconBrandInstagram, IconClock, IconMapPin, IconTruckDelivery, type Icon } from '@tabler/icons-react';
import { useSearchParams } from 'react-router';
import { InquiryForm } from '@/components/InquiryForm';
import { PageHero } from '@/components/PageHero';
import { Reveal, SectionHeading, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { findProduct } from '@/lib/products';
import { isConfirmed, prettyPhone, site } from '@/lib/site';
import { GENERAL_MESSAGE } from '@/lib/whatsapp';

/** Lo que la marca no ha confirmado se queda fuera de la tarjeta: sin rellenos ni avisos internos a la vista. */
const CHANNELS: Array<{ Icon: Icon; label: string; value: string | null; hint: string }> = [
  { Icon: IconClock, label: 'Horario de atención', value: site.hours, hint: 'Respondemos por orden de llegada' },
  { Icon: IconMapPin, label: 'Dirección', value: site.address, hint: 'Solo atención en línea por ahora' },
  { Icon: IconBrandInstagram, label: 'Redes sociales', value: site.instagram, hint: 'Para novedades de la marca' },
  { Icon: IconTruckDelivery, label: 'Envío y pago', value: null, hint: 'Se confirman contigo en el chat' },
];

export function Contact() {
  const [params] = useSearchParams();
  const asked = findProduct(params.get('producto') ?? undefined)?.slug;
  usePageMeta({
    title: 'Contacto — Gold Roots Nutrition',
    description: 'Escríbenos por WhatsApp: consultas sobre una fórmula, pedidos y venta al por mayor.',
    path: '/contacto',
  });
  return (
    <>
      <PageHero eyebrow="Contacto" title="Hablemos por WhatsApp" lead="Pregunta por una fórmula, haz tu pedido o ve cómo vender la línea. No hay caja de pago aquí: te respondemos en el chat y coordinamos disponibilidad, envío y pago contigo.">
        <WhatsAppButton text={GENERAL_MESSAGE}>Abrir el chat ahora</WhatsAppButton>
        <span className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-5 text-[0.9rem] font-semibold text-fg">{prettyPhone(site.whatsapp)}</span>
      </PageHero>

      <section className="wrap section">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ Icon, label, value, hint }, i) => (
            <li key={label}>
              <Reveal delay={Math.min(i, 5) * 60} className="h-full">
                <div className="card h-full p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-sand text-fg">
                    <Icon size={19} stroke={1.8} aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-[1rem] font-medium">{label}</h2>
                  {isConfirmed(value) && <p className="mt-1 text-[0.9rem] font-medium">{value}</p>}
                  <p className="mt-1 text-[0.82rem] text-muted">{hint}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="escribe-title" className="border-t border-line bg-surface">
        <div className="wrap section grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <SectionHeading eyebrow="Escríbenos" title={<span id="escribe-title">Pregunta lo que necesites</span>} lead="Dudas sobre una fórmula, pedidos, venta al por mayor o ese producto que tus clientes te piden. Tu mensaje se abre en WhatsApp, listo para enviar." />
          </Reveal>
          <Reveal delay={90}>
            <InquiryForm kind="contact" defaultProduct={asked} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
