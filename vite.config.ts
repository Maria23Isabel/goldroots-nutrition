import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub Pages sirve el sitio en /goldroots-nutrition/; con dominio propio va en la raíz.
// Las rutas limpias (/product/shilajit-gold) las resuelve el 404.html que escribe scripts/postbuild.mjs.
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/goldroots-nutrition/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5176 },
  build: { assetsInlineLimit: 2048 },
}));
