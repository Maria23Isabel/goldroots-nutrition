// Valores predeterminados de la ficha, en un solo lugar. Se usan SOLO cuando Herbavida no trae el dato, y nunca inventan información de un suplemento:
// no hay dosis, ingredientes, beneficios ni certificaciones de relleno. Lo que no se puede suplir con un texto neutro simplemente no se muestra.
export const DEFAULTS = {
  /** Imagen de respaldo cuando el producto no tiene foto: la marca sobre fondo neutro (public/brand/placeholder-producto.webp) */
  image: 'brand/placeholder-producto.webp',
  /** Descripción corta neutra */
  summary: 'Suplemento alimenticio de la línea Gold Roots. Revisa la etiqueta del envase para conocer su composición.',
  /** Titular y frase corta neutros (la presentación, si existe, va en la frase corta) */
  headline: 'Suplemento alimenticio de la línea Gold Roots',
  tagline: 'Suplemento alimenticio',
  /** Aviso cuando la ficha no trae ingredientes */
  ingredientsMissing: 'Información de ingredientes no disponible.',
  /** Marca que se muestra si Herbavida no trae el nombre */
  brandName: 'Gold Roots',
  /** Presentación cuando no está */
  formatMissing: 'Por confirmar',
} as const;
