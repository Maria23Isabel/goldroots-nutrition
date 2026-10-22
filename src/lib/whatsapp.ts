import { site } from './site';

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const GENERAL_MESSAGE = `Hola, ${site.brand}. Quisiera hacer una consulta sobre la línea.`;
/** El mensaje precargado del botón flotante, tal como lo pidió la marca. */
export const INFO_MESSAGE = 'Hola, quisiera recibir información sobre los productos Gold Roots';

export function inquiryMessage(input: { name: string; message: string; product?: string }): string {
  const lines = [`Hola, ${site.brand}. Me llamo ${input.name.trim()}.`];
  if (input.product) lines.push(`Fórmula de interés: ${input.product}`);
  return `${lines.join('\n')}\n\n${input.message.trim()}`;
}
