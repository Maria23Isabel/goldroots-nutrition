import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import { Layout } from '@/components/Layout';
import { About } from '@/pages/About';
import { Catalog } from '@/pages/Catalog';
import { Contact } from '@/pages/Contact';
import { Home } from '@/pages/Home';
import { Legal, NotFound } from '@/pages/Legal';
import { Product } from '@/pages/Product';
import './styles.css';

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
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="producto/:slug" element={<Product />} />
          <Route path="nosotros" element={<About />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="legal/:page" element={<Legal />} />
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
  </StrictMode>,
);
