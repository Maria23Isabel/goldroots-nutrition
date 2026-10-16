// Todo el contacto de la vitrina pasa por WhatsApp: cada botón abre el chat con el mensaje ya escrito.
// Sin número confirmado (site.whatsapp = null) el enlace abre WhatsApp para elegir contacto; con número, abre el chat de la marca.
import { money, type Product } from './products';
import { site } from './site';

export const waLink = (text: string) => `https://wa.me/${site.whatsapp ?? ''}?text=${encodeURIComponent(text)}`;

export const GENERAL_MESSAGE = `Hello ${site.brand}! I have a question.`;

export function productMessage(product: Product): string {
  const price = product.price != null ? ` (${money(product.price)})` : '';
  return `Hello ${site.brand}! I’m interested in ${product.name}${price}. Could you tell me about availability, shipping and how to order?`;
}

export function inquiryMessage(input: { kind: 'contact' | 'wholesale'; name: string; message: string; product?: string; business?: string; country?: string }): string {
  const lines = [`Hello ${site.brand}! My name is ${input.name.trim()}.`];
  if (input.kind === 'wholesale') {
    lines.push('Topic: Wholesale');
    if (input.business?.trim()) lines.push(`Store or company: ${input.business.trim()}`);
    if (input.country?.trim()) lines.push(`Country: ${input.country.trim()}`);
  } else if (input.product) {
    lines.push(`Formula: ${input.product}`);
  }
  return `${lines.join('\n')}\n\n${input.message.trim()}`;
}
