import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@/components/Layout';
import { About } from '@/pages/About';
import { Catalog } from '@/pages/Catalog';
import { Contact } from '@/pages/Contact';
import { Home } from '@/pages/Home';
import { Legal, NotFound } from '@/pages/Legal';
import { Product } from '@/pages/Product';
import { Wholesale } from '@/pages/Wholesale';
import './styles.css';

// Rutas limpias (/product/shilajit-gold): el QR y el SEO las necesitan. En GitHub Pages las resuelve el 404.html que copia postbuild.mjs.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="wholesale" element={<Wholesale />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="legal/:page" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
