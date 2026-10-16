import { IconCopy, IconDownload, IconQrcode } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { absoluteUrl } from '@/lib/products';

/**
 * QR de la ficha del producto: se genera en el navegador desde la dirección real por la que se está viendo el sitio,
 * así el código que se imprime en el envase lleva al cliente a esta misma página.
 */
export function QrCard({ slug, name }: { slug: string; name: string }) {
  const url = absoluteUrl(`product/${slug}`);
  const [png, setPng] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let vivo = true;
    // El generador de QR solo hace falta en las fichas: se carga aparte para no pesar en el resto del sitio.
    import('qrcode')
      .then(({ default: QRCode }) => QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 2, width: 320, color: { dark: '#0d2a1e', light: '#ffffff' } }))
      .then((data) => vivo && setPng(data))
      .catch(() => vivo && setPng(null));
    return () => {
      vivo = false;
    };
  }, [url]);

  const copy = () => {
    navigator.clipboard
      ?.writeText(url)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  return (
    <section aria-labelledby="qr-title" className="rounded-3xl border border-line bg-white p-6">
      <h2 id="qr-title" className="font-sans text-sm font-bold tracking-[0.2em] text-gold-deep uppercase">
        Product QR code
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Scan it with any phone camera to open this page — useful on the bottle, a shelf talker or a catalog sheet.</p>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <div className="grid size-36 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-white">
          {png ? (
            <img src={png} alt={`QR code that opens the ${name} page`} width={144} height={144} className="size-full object-contain" />
          ) : (
            <IconQrcode size={40} className="text-line" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Encodes</p>
          <p className="mt-1 text-sm break-all text-forest select-all">{url}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-bold tracking-wider text-forest uppercase transition hover:border-gold">
              <IconCopy size={17} aria-hidden="true" /> Copy link
            </button>
            <a
              href={png ?? undefined}
              download={`goldroots-${slug}-qr.png`}
              aria-disabled={!png}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-4 text-sm font-bold tracking-wider text-white uppercase transition hover:bg-forest-2 ${png ? '' : 'pointer-events-none opacity-40'}`}
            >
              <IconDownload size={17} aria-hidden="true" /> Download PNG
            </a>
          </div>
          <p role="status" aria-live="polite" className="mt-3 h-5 text-sm font-semibold text-moss">
            {copied ? 'Link copied.' : ''}
          </p>
        </div>
      </div>
    </section>
  );
}
