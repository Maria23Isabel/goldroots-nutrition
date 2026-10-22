// Compila el sitio y lo sube a Cloudflare. Hay tres destinos y cada uno es un Worker distinto:
//   node scripts/desplegar.mjs            → Worker «goldroots-nutrition» (la dirección de pruebas actual, *.workers.dev), con noindex
//   node scripts/desplegar.mjs --qa       → Worker «goldroots-nutrition-qa» (validación antes de tocar lo anterior), con noindex
//   node scripts/desplegar.mjs --dominio  → goldrootsvitamins.com (el dominio tiene que estar ya en la cuenta de Cloudflare)
// Hace falta haber iniciado sesión una vez con `npx wrangler login`.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { cabeceras } from './cabeceras.mjs';

const SUBDOMINIO = 'mariaisabel06atauccancha23.workers.dev';
const destino = process.argv.includes('--dominio') ? 'dominio' : process.argv.includes('--qa') ? 'qa' : 'pruebas';
const DESTINOS = {
  dominio: { sitio: 'https://goldrootsvitamins.com', config: 'wrangler.dominio.jsonc', noindex: false },
  qa: { sitio: process.env.SITIO_QA ?? `https://goldroots-nutrition-qa.${SUBDOMINIO}`, config: 'wrangler.qa.jsonc', noindex: true },
  pruebas: { sitio: process.env.SITIO_PRUEBAS ?? `https://goldroots-nutrition.${SUBDOMINIO}`, config: 'wrangler.jsonc', noindex: true },
};
const { sitio, config, noindex } = DESTINOS[destino];
const env = { ...process.env, VITE_SITE_URL: sitio };
const correr = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', env, shell: process.platform === 'win32' });

correr('npm', ['run', 'build']);
writeFileSync('dist/_headers', cabeceras({ noindex }));
correr('npx', ['wrangler', 'deploy', '-c', config]);
console.log(`\nPublicado (${destino}) en ${sitio}`);
