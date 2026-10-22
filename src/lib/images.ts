// Tamaño de las fotos que vienen de Herbavida. Cada foto se pide del tamaño que se va a ver, no la grande: una tarjeta de 300 px no baja 1 000 px.
const GOOGLE = /^(https:\/\/lh3\.googleusercontent\.com\/[^=\s]+)(=[a-z0-9-]+)?$/i;
// Las fotos del almacén de Herbavida: <16 hex>.<ext> en la raíz del bucket tienen una versión -480 y otra -160 al lado
const PHOTO_BUCKET = /^(https:\/\/fotos(?:-qa)?\.herbavidaperu\.com\/)([a-f0-9]{16})\.(webp|png|jpg)$/;

/** El enlace de la foto en el tamaño pedido (en píxeles de pantalla; se pide el doble para pantallas nítidas, hasta 1 000). */
export function imageUrl(url: string, width: number): string {
  const wanted = Math.min(1000, Math.max(160, Math.round(width * 2)));
  const google = GOOGLE.exec(url);
  if (google) return `${google[1]}=w${wanted}`;
  const bucket = PHOTO_BUCKET.exec(url);
  if (bucket && wanted <= 480) return `${bucket[1]}${bucket[2]}-${wanted <= 160 ? 160 : 480}.${bucket[3]}`;
  return url;
}
