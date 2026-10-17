// Todo el contacto y los pedidos de la vitrina pasan por WhatsApp: cada botón abre el chat con el mensaje ya escrito.
// La vitrina no cobra ni guarda nada; el pedido se arma aquí y se confirma (disponibilidad, envío y pago) en la conversación.
import { money, type Product } from './products';
import { site } from './site';

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const GENERAL_MESSAGE = `¡Hola ${site.brand}! Tengo una consulta.`;

export function productMessage(product: Product): string {
  const price = product.price != null ? ` (${money(product.price)})` : '';
  return `¡Hola ${site.brand}! Me interesa ${product.name}${price}. ¿Me cuentan sobre disponibilidad, envío y cómo hacer el pedido?`;
}

export interface OrderLine {
  product: Product;
  qty: number;
}

export interface OrderTotals {
  units: number;
  /** Suma de lo que tiene precio. */
  subtotal: number;
  /** Lo que se ahorra frente al precio normal. */
  saved: number;
  /** Productos del pedido que aún no tienen precio publicado. */
  unpriced: number;
}

export function orderTotals(lines: OrderLine[]): OrderTotals {
  let units = 0;
  let subtotal = 0;
  let saved = 0;
  let unpriced = 0;
  for (const { product, qty } of lines) {
    units += qty;
    if (product.price == null) {
      unpriced += 1;
      continue;
    }
    subtotal += product.price * qty;
    if (product.compareAt != null) saved += (product.compareAt - product.price) * qty;
  }
  return { units, subtotal: Math.round(subtotal * 100) / 100, saved: Math.round(saved * 100) / 100, unpriced };
}

/** Mensaje del pedido completo: una línea por producto, total referencial y los datos que quiera dejar el cliente. */
export function orderMessage(lines: OrderLine[], who: { name?: string; place?: string; note?: string } = {}): string {
  const totals = orderTotals(lines);
  const out = [`¡Hola ${site.brand}! 👋 Quisiera hacer este pedido:`, ''];
  for (const { product, qty } of lines) {
    const price = product.price != null ? ` — ${money(product.price * qty)}` : ' — precio por confirmar';
    out.push(`• ${qty} × ${product.name}${price}`);
  }
  out.push('');
  out.push(`Total referencial: ${money(totals.subtotal)}${totals.unpriced ? ` (+ ${totals.unpriced === 1 ? 'un producto' : `${totals.unpriced} productos`} por cotizar)` : ''}, sin envío.`);
  const name = who.name?.trim();
  const place = who.place?.trim();
  const note = who.note?.trim();
  if (name || place || note) out.push('');
  if (name) out.push(`Nombre: ${name}`);
  if (place) out.push(`Ciudad o país de entrega: ${place}`);
  if (note) out.push(`Nota: ${note}`);
  out.push('', '¿Me confirman disponibilidad, costo de envío y forma de pago? ¡Gracias!');
  return out.join('\n');
}

export function inquiryMessage(input: { kind: 'contact' | 'wholesale'; name: string; message: string; product?: string; business?: string; country?: string }): string {
  const lines = [`¡Hola ${site.brand}! Me llamo ${input.name.trim()}.`];
  if (input.kind === 'wholesale') {
    lines.push('Tema: venta al por mayor');
    if (input.business?.trim()) lines.push(`Tienda o empresa: ${input.business.trim()}`);
    if (input.country?.trim()) lines.push(`País: ${input.country.trim()}`);
  } else if (input.product) {
    lines.push(`Fórmula: ${input.product}`);
  }
  return `${lines.join('\n')}\n\n${input.message.trim()}`;
}
