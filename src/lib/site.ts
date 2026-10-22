/** Lo que la marca aún no ha confirmado no se inventa: se queda null y la pantalla lo marca. */
export const site = {
  brand: 'Gold Roots Nutrition',
  tagline: 'Nutrición esencial para tu bienestar diario',
  /**
   * Número de WhatsApp de contacto, con código de país y solo dígitos.
   * [por confirmar] Hoy usa el de Herbavida (+51 940 176 917), que es el que estaba configurado en el proyecto:
   * no se inventa ninguno. Se cambia aquí o con VITE_WHATSAPP al compilar y el botón flotante, el pie, el
   * héroe, el destacado y Contacto lo siguen al instante.
   */
  whatsapp: (import.meta.env.VITE_WHATSAPP as string | undefined)?.replace(/\D/g, '') || '51940176917',
  /** Marca el número de arriba como oficial de Gold Roots. Mientras esté en false, el dato sigue en revisión. */
  whatsappConfirmed: false,
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
  return `+${digits}`;
}
