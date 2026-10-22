/** Lo que la marca aún no ha confirmado no se inventa: se queda null y la pantalla lo marca. */
export const site = {
  brand: 'Gold Roots Nutrition',
  tagline: 'Nutrición esencial para tu bienestar diario',
  /**
   * Número de WhatsApp de contacto, con código de país y solo dígitos.
   * [PROVISIONAL] Número de ejemplo de EE. UU. (+1 202 555 0143, del rango ficticio 555-01xx) para ver el diseño completo;
   * no es de la marca. El oficial se pone aquí o con VITE_WHATSAPP al compilar y el botón flotante, el pie, el
   * héroe, el destacado y Contacto lo siguen al instante.
   */
  whatsapp: (import.meta.env.VITE_WHATSAPP as string | undefined)?.replace(/\D/g, '') || '12025550143',
  /** Mientras el número sea provisional, Contacto lo muestra para probar el diseño; con el oficial queda en true. */
  whatsappConfirmed: true,
  /** [por confirmar] horario de atención */
  hours: null as string | null,
  /** [por confirmar] dirección fiscal y país de envío */
  address: null as string | null,
  /** [por confirmar] redes sociales */
  instagram: null as string | null,
  facebook: null as string | null,
  tiktok: null as string | null,
};

export const isConfirmed = (value: string | null) => Boolean(value);

/** «51940176917» → «+51 940 176 917» */
export function prettyPhone(digits: string): string {
  if (digits.startsWith('51') && digits.length === 11) return `+51 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  if (digits.startsWith('1') && digits.length === 11) return `+1 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return `+${digits}`;
}
