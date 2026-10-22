import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { lazyNamed, Page } from '@/lib/lazy';
import { MotionProvider } from '@/lib/motion';
import './styles.css';

/* Cada página se baja cuando se visita: la portada no carga el catálogo ni las fichas por adelantado. */
const About = lazyNamed(() => import('@/pages/About'), 'About');
const Catalog = lazyNamed(() => import('@/pages/Catalog'), 'Catalog');
const Contact = lazyNamed(() => import('@/pages/Contact'), 'Contact');
const Legal = lazyNamed(() => import('@/pages/Legal'), 'Legal');
const Product = lazyNamed(() => import('@/pages/Product'), 'Product');

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function OldProduct() {
  const { slug } = useParams();
  return <Navigate to={`/producto/${slug}`} replace />;
}

function Old({ to }: { to: string }) {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Page><Catalog /></Page>} />
          <Route path="producto/:slug" element={<Page><Product /></Page>} />
          <Route path="nosotros" element={<Page><About /></Page>} />
          <Route path="contacto" element={<Page><Contact /></Page>} />
          <Route path="legal/:page" element={<Page><Legal /></Page>} />
          <Route path="catalog" element={<Old to="/catalogo" />} />
          <Route path="product/:slug" element={<OldProduct />} />
          <Route path="mayoristas" element={<Old to="/nosotros" />} />
          <Route path="wholesale" element={<Old to="/nosotros" />} />
          <Route path="about" element={<Old to="/nosotros" />} />
          <Route path="contact" element={<Old to="/contacto" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </MotionProvider>
  </StrictMode>,
);
