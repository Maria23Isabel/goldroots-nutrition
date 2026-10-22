import { IconMessageCircle, IconPhoneCall, IconShieldCheck } from '@tabler/icons-react';
import { useSearchParams } from 'react-router';
import { InquiryForm } from '@/components/InquiryForm';
import { PageHero } from '@/components/PageHero';
import { LeafMark, Reveal, SectionHeading, WhatsAppButton } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { useCatalogState } from '@/lib/catalog';
import { findProduct } from '@/lib/products';
import { prettyPhone, site } from '@/lib/site';
import { INFO_MESSAGE } from '@/lib/whatsapp';

export function Contact() {
  const [params] = useSearchParams();
  const products = useCatalogState().catalog?.products ?? [];
  const asked = findProduct(products, params.get('producto') ?? undefined)?.slug;
  usePageMeta({ title: 'Contacto — Gold Roots Nutrition', description: `Contacto institucional de Gold Roots Nutrition: escribe por WhatsApp para conocer las fórmulas de la línea.`, path: '/contacto' });

  return (
    <>
      <PageHero eyebrow="Contacto institucional" title="Una conversación que empieza con información." lead="Escribe a la marca por WhatsApp: es el canal directo para consultar fórmulas, ingredientes y disponibilidad de la información.">
        <WhatsAppButton text={INFO_MESSAGE}>Contactar por WhatsApp</WhatsAppButton>
      </PageHero>

      <section className="wrap section grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <Reveal><div><SectionHeading eyebrow="Consultas" title="Pregunta sobre la línea" lead="Puedes elegir una fórmula para dar contexto a tu mensaje. Este canal es únicamente informativo: no hay carrito ni proceso de compra." /><div className="mt-8 space-y-4"><div className="flex gap-4 rounded-2xl bg-sand p-5"><IconMessageCircle size={21} className="mt-0.5 shrink-0 text-accent-deep" aria-hidden="true" /><div><h2 className="text-[1rem]">WhatsApp</h2><p className="mt-1 text-[0.86rem] leading-relaxed text-muted">El mensaje se prepara aquí y se abre en WhatsApp con {prettyPhone(site.whatsapp)}. Es un canal de contacto directo: no responde un bot.</p></div></div><div className="flex gap-4 rounded-2xl border border-line p-5"><IconShieldCheck size={21} className="mt-0.5 shrink-0 text-accent-deep" aria-hidden="true" /><div><h2 className="text-[1rem]">Privacidad</h2><p className="mt-1 text-[0.86rem] leading-relaxed text-muted">La página no guarda mensajes ni información personal: solo arma el texto que tú envías.</p></div></div><div className="flex gap-4 rounded-2xl border border-line p-5"><IconPhoneCall size={21} className="mt-0.5 shrink-0 text-accent-deep" aria-hidden="true" /><div><h2 className="text-[1rem]">Datos corporativos</h2><p className="mt-1 text-[0.86rem] leading-relaxed text-muted">Razón social, dirección y redes oficiales se publicarán cuando la marca los confirme.</p></div></div></div></div></Reveal>
        <Reveal delay={80}><div className="relative"><InquiryForm defaultProduct={asked} /><div className="mt-6 flex items-center gap-4 rounded-[1.5rem] bg-sand px-6 py-5"><LeafMark className="size-9 shrink-0" /><p className="text-[0.86rem] leading-relaxed text-muted">Gold Roots Nutrition presenta su línea de forma corporativa e informativa. Cualquier consulta sobre una fórmula se responde por este mismo canal.</p></div></div></Reveal>
      </section>
    </>
  );
}
