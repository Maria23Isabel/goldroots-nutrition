import { IconLeaf } from '@tabler/icons-react';
import { Link } from 'react-router';
import { buttonClass } from '@/components/ui';
import { usePageMeta } from '@/lib/meta';
import { PRODUCTS } from '@/lib/products';

export function NotFound() {
  usePageMeta({ title: 'Página no encontrada — Gold Roots Nutrition', description: 'Esta página no existe en el sitio de Gold Roots Nutrition.', path: '/' });
  return <div className="wrap grid max-w-2xl place-items-center py-24 text-center"><IconLeaf size={40} stroke={1.6} className="text-accent-deep" aria-hidden="true" /><p className="eyebrow mt-5">Error 404</p><h1 className="mt-3 text-[2.2rem] sm:text-[3rem]">No encontramos esa página</h1><p className="mt-4 text-[0.98rem] text-muted">El catálogo contiene las fichas disponibles actualmente.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/catalogo" className={buttonClass('primary')}>Ver las {PRODUCTS.length} fórmulas</Link><Link to="/" className={buttonClass('outline')}>Volver al inicio</Link></div></div>;
}
