import { IconLeaf } from '@tabler/icons-react';
import { Link, useParams } from 'react-router';
import { buttonClass } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { PRODUCTS } from '@/lib/products';

const FDA = 'Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos de EE. UU. (FDA). Estos productos no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.';

const PAGES: Record<string, { title: string; blocks: Array<{ h: string; p: string[] }> }> = {
  terminos: {
    title: 'Términos y políticas',
    blocks: [
      {
        h: 'Sobre este sitio',
        p: [
          'Este sitio muestra la línea Gold Roots Nutrition. Es una vitrina informativa: no tiene carrito, no recibe pagos ni guarda pedidos. Los pedidos se coordinan por WhatsApp.',
          '[Por revisar: la razón social detrás de la marca, el país y la jurisdicción aplicables, y la política de devoluciones y garantía.]',
        ],
      },
      { h: 'Información de los productos', p: ['Los nombres, precios, beneficios, ingredientes y presentaciones provienen de los productos tal como la marca los publica. Pueden cambiar sin previo aviso.', FDA] },
      { h: 'Consulta a un profesional', p: ['Habla con un profesional de la salud calificado antes de empezar cualquier suplemento, sobre todo si estás embarazada, en lactancia, tomas medicamentos o tienes una condición de salud.'] },
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    blocks: [
      { h: 'Qué datos recoge este sitio', p: ['Ninguno. «Mi pedido» y los formularios de contacto y de mayoristas solo escriben un mensaje y abren WhatsApp en tu dispositivo; este sitio no recibe, envía ni guarda lo que escribes. Lo que envíes después por WhatsApp lo gestionan WhatsApp y la marca.', 'Tu pedido en curso se guarda únicamente en tu propio navegador (almacenamiento local) para que no lo pierdas al recargar; puedes vaciarlo cuando quieras.'] },
      { h: 'Cuando el sitio salga a producción', p: ['[Por redactar: qué datos personales recoge la marca, para qué, por cuánto tiempo, con quién los comparte y cómo pedir que se eliminen.]'] },
      { h: 'Cookies y analítica', p: ['[Por confirmar: si el sitio usará analítica o cookies de marketing, y qué aviso de consentimiento se mostrará.]'] },
    ],
  },
};

/** Direcciones en inglés de la versión anterior del sitio, por si alguien las tiene guardadas. */
const OLD: Record<string, string> = { terms: 'terminos', privacy: 'privacidad' };

export function Legal() {
  const { page = 'terminos' } = useParams();
  const key = page in PAGES ? page : (OLD[page] ?? 'terminos');
  const content = PAGES[key];

  usePageMeta({ title: `${content.title} — Gold Roots Nutrition`, description: `${content.title} de la vitrina de Gold Roots Nutrition.`, path: `/legal/${key}` });

  return (
    <article className="wrap max-w-3xl py-16 sm:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2.5 text-[2rem] font-medium sm:text-[2.4rem]">{content.title}</h1>
      <p className="mt-4 inline-block rounded-full bg-accent-soft px-3 py-1.5 text-[0.82rem] font-medium text-accent-deep">Borrador para la marca: aún no está revisado ni en vigor.</p>
      {content.blocks.map((b) => (
        <section key={b.h} className="mt-9 border-t border-line pt-6">
          <h2 className="font-display text-[1.25rem] font-medium">{b.h}</h2>
          {b.p.map((text) => (
            <p key={text} className="mt-3 text-[0.98rem] leading-relaxed text-muted">
              {text}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}

export function NotFound() {
  usePageMeta({ title: 'Página no encontrada — Gold Roots Nutrition', description: 'Esta página no existe en la vitrina de Gold Roots Nutrition.', path: '/' });
  return (
    <div className="wrap grid max-w-2xl place-items-center py-24 text-center">
      <IconLeaf size={40} stroke={1.6} aria-hidden="true" className="text-line-strong" />
      <p className="eyebrow mt-4">Error 404</p>
      <h1 className="mt-2.5 text-[2rem] font-medium sm:text-[2.4rem]">No encontramos esa página</h1>
      <p className="mt-4 text-[1rem] text-muted">Puede que la fórmula haya cambiado de nombre. El catálogo muestra todo lo que hay hoy en la línea.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link to="/catalogo" className={buttonClass('primary')}>
          Ver las {PRODUCTS.length} fórmulas
        </Link>
        <Link to="/" className={buttonClass('outline')}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
