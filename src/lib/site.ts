/** Lo que María aún no ha confirmado no se inventa: se queda null y la pantalla lo marca. */
export const site = {
  brand: 'Gold Roots Nutrition',
  tagline: 'Essential nutrition for daily wellness',
  /** [to be confirmed] número de WhatsApp de la marca, con código de país y solo dígitos (ej. «15551234567») */
  whatsapp: null as string | null,
  /** [to be confirmed] horario de atención */
  hours: null as string | null,
  /** [to be confirmed] dirección fiscal y país de envío */
  address: null as string | null,
  /** [to be confirmed] redes sociales */
  instagram: null as string | null,
  facebook: null as string | null,
  tiktok: null as string | null,
  originalShop: 'https://goldrootsvitamins.com/',
};

export const isConfirmed = (value: string | null) => Boolean(value);
