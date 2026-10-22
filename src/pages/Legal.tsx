import { useParams } from 'react-router';
import { usePageMeta } from '@/lib/meta';

const FDA = 'Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos de EE. UU. (FDA). Estos productos no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.';

const PAGES: Record<string, { title: string; blocks: Array<{ h: string; p: string[] }> }> = {
  terminos: {
    title: 'Términos y políticas',
    blocks: [
      { h: 'Sobre este sitio', p: ['Este sitio presenta la línea Gold Roots Nutrition con fines corporativos e informativos. No muestra precios, no tiene carrito, no recibe pagos y no procesa pedidos.', '[Por revisar: la razón social detrás de la marca, el país y la jurisdicción aplicables.]'] },
      { h: 'Información de los productos', p: ['Los nombres, descripciones, beneficios, ingredientes y presentaciones provienen del catálogo disponible de la marca y pueden actualizarse.', FDA] },
      { h: 'Consulta a un profesional', p: ['Habla con un profesional de la salud antes de empezar cualquier suplemento, sobre todo si estás embarazada, en lactancia, tomas medicamentos o tienes una condición de salud.'] },
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    blocks: [
      { h: 'Qué datos recoge este sitio', p: ['La navegación informativa, los filtros del catálogo y las fichas no solicitan datos personales ni guardan estado comercial en el navegador.', 'Si la marca habilita un canal externo de contacto, el sitio preparará la consulta en el dispositivo del visitante; el servicio externo y la marca gestionarán lo que la persona decida enviar.'] },
      { h: 'Cookies y analítica', p: ['[Por confirmar: si el sitio usará analítica o cookies de marketing, y qué aviso de consentimiento se mostrará.]'] },
    ],
  },
};

const OLD: Record<string, string> = { terms: 'terminos', privacy: 'privacidad' };

export function Legal() {
  const { page = 'terminos' } = useParams();
  const key = page in PAGES ? page : (OLD[page] ?? 'terminos');
  const content = PAGES[key];
  usePageMeta({ title: `${content.title} — Gold Roots Nutrition`, description: `${content.title} del sitio informativo de Gold Roots Nutrition.`, path: `/legal/${key}` });

  return <article className="wrap max-w-3xl py-16 sm:py-24"><p className="eyebrow text-accent-deep">Legal</p><h1 className="mt-4 text-[clamp(2.5rem,5vw,4.6rem)] leading-[0.98]">{content.title}</h1><p className="mt-5 inline-block rounded-full bg-accent-soft px-3 py-1.5 text-[0.8rem] font-semibold text-accent-deep">Borrador pendiente de revisión por la marca.</p>{content.blocks.map((block) => <section key={block.h} className="mt-10 border-t border-line pt-7"><h2 className="text-[1.3rem]">{block.h}</h2>{block.p.map((text) => <p key={text} className="mt-3 text-[0.96rem] leading-relaxed text-muted">{text}</p>)}</section>)}</article>;
}
