import { useEffect } from 'react';
import { absoluteAsset, absoluteUrl } from './products';

/** Título, descripción, canonical y tarjetas sociales por pantalla: sin esto todo el sitio comparte el <title> de index.html. */
export function usePageMeta({ title, description, image, path }: { title: string; description: string; image?: string; path: string }) {
  useEffect(() => {
    document.title = title;
    const set = (selector: string, attr: 'name' | 'property', key: string, value: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.append(tag);
      }
      tag.content = value;
    };
    set('meta[name="description"]', 'name', 'description', description);
    set('meta[property="og:title"]', 'property', 'og:title', title);
    set('meta[property="og:description"]', 'property', 'og:description', description);
    set('meta[property="og:url"]', 'property', 'og:url', absoluteUrl(path));
    if (image) set('meta[property="og:image"]', 'property', 'og:image', absoluteAsset(image));

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.append(link);
    }
    link.href = absoluteUrl(path);
  }, [title, description, image, path]);
}
