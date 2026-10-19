// Compila el sitio y lo sube a Cloudflare.
//   node scripts/desplegar.mjs            → dirección de pruebas (*.workers.dev), con noindex para que Google no la tome
//   node scripts/desplegar.mjs --dominio  → goldrootsvitamins.com (el dominio tiene que estar ya en la cuenta de Cloudflare)
// Hace falta haber iniciado sesión una vez con `npx wrangler login`.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const dominio = process.argv.includes('--dominio');
const SITIO = dominio ? 'https://goldrootsvitamins.com' : (process.env.SITIO_PRUEBAS ?? 'https://goldroots-nutrition.mariaisabel06atauccancha23.workers.dev');
const env = { ...process.env, VITE_SITE_URL: SITIO };
const correr = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', env, shell: process.platform === 'win32' });

correr('npm', ['run', 'build']);
// En la dirección de pruebas se pide a los buscadores que no la indexen; en el dominio real, no.
writeFileSync('dist/_headers', dominio ? '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n' : '/*\n  X-Robots-Tag: noindex\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n');
correr('npx', ['wrangler', 'deploy', '-c', dominio ? 'wrangler.dominio.jsonc' : 'wrangler.jsonc']);
console.log(`\nPublicado en ${SITIO}`);
