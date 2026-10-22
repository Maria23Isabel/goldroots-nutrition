// Compila el sitio y lo sube a Cloudflare. El destino se elige siempre a propósito:
//   node scripts/desplegar.mjs --qa       → Worker «goldroots-nutrition-qa» (qa.goldrootsvitamins.com y *.workers.dev), con noindex
//   node scripts/desplegar.mjs --dominio  → Worker «goldroots-nutrition» = PRODUCCIÓN (goldrootsvitamins.com y www)
// Sin bandera no despliega nada: ese Worker es el de producción y no debe recibir builds de prueba por descuido.
// Hace falta haber iniciado sesión una vez con `npx wrangler login`.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { cabeceras } from './cabeceras.mjs';

const destino = process.argv.includes('--dominio') ? 'dominio' : process.argv.includes('--qa') ? 'qa' : null;
if (!destino) {
  console.error('Indica el destino: --qa (pruebas) o --dominio (producción).');
  process.exit(1);
}
const DESTINOS = {
  dominio: { sitio: 'https://goldrootsvitamins.com', config: 'wrangler.dominio.jsonc', noindex: false },
  qa: { sitio: process.env.SITIO_QA ?? 'https://qa.goldrootsvitamins.com', config: 'wrangler.qa.jsonc', noindex: true },
};
const { sitio, config, noindex } = DESTINOS[destino];
const env = { ...process.env, VITE_SITE_URL: sitio };
const correr = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', env, shell: process.platform === 'win32' });

correr('npm', ['run', 'build']);
writeFileSync('dist/_headers', cabeceras({ noindex }));
correr('npx', ['wrangler', 'deploy', '-c', config]);
console.log(`\nPublicado (${destino}) en ${sitio}`);
