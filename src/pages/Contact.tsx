import { IconBrandInstagram, IconClock, IconMapPin, IconTruckDelivery, type Icon } from '@tabler/icons-react';
import { useSearchParams } from 'react-router';
import { InquiryForm } from '@/components/InquiryForm';
import { PageHero } from '@/components/PageHero';
import { Pending, Reveal, SectionHeading, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { findProduct } from '@/lib/products';
import { isConfirmed, prettyPhone, site } from '@/lib/site';
import { GENERAL_MESSAGE } from '@/lib/whatsapp';

const CHANNELS: Array<{ Icon: Icon; label: string; value: string | null; hint: string; pending: string }> = [
  { Icon: IconClock, label: 'Horario de atención', value: site.hours, hint: 'Respondemos por orden de llegada', pending: 'horario de atención' },
  { Icon: IconMapPin, label: 'Dirección', value: site.address, hint: 'Solo atención en línea por ahora', pending: 'dirección fiscal y país de envío' },
  { Icon: IconBrandInstagram, label: 'Redes sociales', value: site.instagram, hint: 'Para novedades de la marca', pending: 'cuentas de redes' },
  { Icon: IconTruckDelivery, label: 'Envío y pago', value: null, hint: 'Se confirman contigo en el chat', pending: '' },
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
      <PageHero eyebrow="Contacto" title={<>Hablemos por <span className="text-grad">WhatsApp</span></>} lead="Pregunta por una fórmula, haz tu pedido o ve cómo vender la línea. No hay caja de pago aquí: te respondemos en el chat y coordinamos disponibilidad, envío y pago contigo.">
        <WhatsAppButton text={GENERAL_MESSAGE}>Abrir el chat ahora</WhatsAppButton>
        <span className="inline-flex min-h-12 items-center rounded-full bg-white/10 px-6 font-bold ring-1 ring-white/20">{prettyPhone(site.whatsapp)}</span>
      </PageHero>

      <section className="mx-auto max-w-6xl px-5">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ Icon, label, value, hint, pending }, i) => (
            <li key={label}>
              <Reveal delay={i * 70} className="h-full">
                <div className="h-full rounded-[2rem] bg-surface p-6 ring-1 ring-line">
                  <span className="grad-sun grid size-12 place-items-center rounded-2xl text-night">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-lg font-extrabold">{label}</h2>
                  <p className="mt-1 font-semibold">{isConfirmed(value) ? value : pending ? <Pending>{pending}</Pending> : 'Por WhatsApp'}</p>
                  <p className="mt-1 text-sm text-muted">{hint}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="escribe-title" className="mx-auto mt-24 grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading eyebrow="Escríbenos" title={<span id="escribe-title">Pregunta lo que necesites</span>} lead="Dudas sobre una fórmula, pedidos, venta al por mayor o ese producto que tus clientes te piden. Tu mensaje se abre en WhatsApp, listo para enviar." />
          {!site.whatsappConfirmed && (
            <p className="mt-6">
              <Pending>número de WhatsApp definitivo de la marca</Pending>
            </p>
          )}
        </Reveal>
        <Reveal delay={100}>
          <InquiryForm kind="contact" defaultProduct={asked} />
        </Reveal>
      </section>
    </>
  );
}
