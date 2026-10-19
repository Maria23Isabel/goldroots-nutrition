import { IconCheck, IconCopy, IconDownload, IconQrcode } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { absoluteUrl, productPath } from '@/lib/products';

/**
 * QR de la ficha del producto: se genera en el navegador desde la dirección real por la que se está viendo el sitio,
 * así el código que se imprime en el envase lleva al cliente a esta misma página.
 */
export function QrCard({ slug, name }: { slug: string; name: string }) {
  const url = absoluteUrl(productPath(slug));
  const [png, setPng] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let vivo = true;
    // El generador de QR solo hace falta en las fichas: se carga aparte para no pesar en el resto del sitio.
    import('qrcode')
      .then(({ default: QRCode }) => QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 2, width: 320, color: { dark: '#23231f', light: '#ffffff' } }))
      .then((data) => vivo && setPng(data))
      .catch(() => vivo && setPng(null));
    return () => {
      vivo = false;
    };
  }, [url]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = () => {
    navigator.clipboard
      ?.writeText(url)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  return (
    <section aria-labelledby="qr-title" className="rounded-2xl border border-line bg-surface p-6">
      <h2 id="qr-title" className="eyebrow">
        Código QR del producto
      </h2>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">Escanéalo con la cámara de cualquier celular para abrir esta página. Sirve en el envase, en un exhibidor o en una hoja de catálogo.</p>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <div className="grid size-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface p-1">
          {png ? <img src={png} alt={`Código QR que abre la página de ${name}`} width={128} height={128} className="size-full object-contain" /> : <IconQrcode size={36} className="text-line-strong" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-muted uppercase">Lleva a</p>
          <p className="mt-1 text-[0.85rem] break-all text-fg select-all">{url}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={copy} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[0.85rem] font-semibold text-fg transition-colors hover:border-fg hover:bg-sand">
              {copied ? <IconCheck size={16} stroke={2.4} aria-hidden="true" /> : <IconCopy size={16} aria-hidden="true" />}
              {copied ? 'Copiado' : 'Copiar enlace'}
            </button>
            <a
              href={png ?? undefined}
              download={`goldroots-${slug}-qr.png`}
              aria-disabled={!png}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full bg-night px-4 text-[0.85rem] font-semibold text-white transition-colors hover:bg-fg/85 ${png ? '' : 'pointer-events-none opacity-40'}`}
            >
              <IconDownload size={16} aria-hidden="true" /> Descargar PNG
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
