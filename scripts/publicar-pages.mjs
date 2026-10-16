// Sube el contenido de dist/ a la rama de GitHub Pages sin tocar la copia de trabajo:
// clona la rama en un directorio desechable dentro de node_modules, la reemplaza con el build y la empuja.
// Uso: node scripts/publicar-pages.mjs   (antes hace falta npm run build:pages)
import { execFileSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(RAIZ, 'dist');
const TEMP = resolve(RAIZ, 'node_modules', '.gh-pages');
const RAMA = process.env.PAGES_BRANCH || 'gh-pages';

const origen = execFileSync('git', ['config', '--get', 'remote.origin.url'], { cwd: RAIZ, encoding: 'utf8' }).trim();
if (!origen) throw new Error('Este proyecto no tiene remoto origin; crea el repositorio antes de publicar.');

const git = (args, opciones = {}) => execFileSync('git', args, { cwd: opciones.cwd ?? TEMP, stdio: opciones.capture ? 'pipe' : 'inherit', encoding: 'utf8', ...opciones });

const existe = git(['ls-remote', '--heads', origen, RAMA], { cwd: RAIZ, capture: true }).trim();

rmSync(TEMP, { recursive: true, force: true, maxRetries: 6, retryDelay: 250 });
if (existe) {
  git(['clone', '-q', '--depth', '1', '-b', RAMA, origen, TEMP], { cwd: RAIZ });
  git(['rm', '-r', '-q', '--ignore-unmatch', '.']);
} else {
  git(['init', '-q', '-b', RAMA]);
  git(['remote', 'add', 'origin', origen]);
}

cpSync(DIST, TEMP, { recursive: true });
git(['add', '-A']);

const cambios = git(['status', '--porcelain'], { capture: true }).trim();
if (!cambios) {
  console.log(`publicar: ${RAMA} ya tiene exactamente este build, no hay nada que subir.`);
} else {
  const archivos = git(['ls-files'], { capture: true }).split('\n').filter(Boolean).length;
  git(['commit', '-q', '-m', `Publicar la vitrina en ${RAMA} (${archivos} archivos)`]);
  git(['push', '-q', 'origin', RAMA]);
  console.log(`publicar: subido el build (${archivos} archivos) a ${RAMA} en ${origen}`);
}

rmSync(TEMP, { recursive: true, force: true, maxRetries: 6, retryDelay: 250 });
