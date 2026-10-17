// Tema claro u oscuro: se guarda en el navegador y se aplica con data-theme en <html> (el script de index.html lo pone antes de pintar, sin parpadeo).
import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';
const KEY = 'gold-roots:tema';
const listeners = new Set<() => void>();

export const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#16133a' : '#fbf7f1');
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // sin almacenamiento: el tema vale solo mientras la página esté abierta
  }
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => void listeners.delete(l);
    },
    currentTheme,
    () => 'dark' as Theme,
  );
  return { theme, set: setTheme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}
