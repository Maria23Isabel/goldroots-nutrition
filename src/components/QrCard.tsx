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
      .then(({ default: QRCode }) => QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 2, width: 320, color: { dark: '#14112e', light: '#ffffff' } }))
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
    <section aria-labelledby="qr-title" className="rounded-[2rem] bg-surface p-6 ring-1 ring-line">
      <h2 id="qr-title" className="eyebrow">
        Código QR del producto
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Escanéalo con la cámara de cualquier celular para abrir esta página. Sirve en el envase, en un exhibidor o en una hoja de catálogo.</p>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <div className="grid size-36 shrink-0 place-items-center overflow-hidden rounded-3xl bg-surface p-1 ring-1 ring-line">
          {png ? <img src={png} alt={`Código QR que abre la página de ${name}`} width={144} height={144} className="size-full object-contain" /> : <IconQrcode size={40} className="text-line" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.16em] text-muted uppercase">Lleva a</p>
          <p className="mt-1 text-sm break-all text-fg select-all">{url}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-fg/15 bg-surface px-4 text-sm font-bold text-fg transition hover:border-fg">
              {copied ? <IconCheck size={17} stroke={3} aria-hidden="true" /> : <IconCopy size={17} aria-hidden="true" />}
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </button>
            <a
              href={png ?? undefined}
              download={`goldroots-${slug}-qr.png`}
              aria-disabled={!png}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-inv px-4 text-sm font-bold text-inv-fg transition hover:opacity-85 ${png ? '' : 'pointer-events-none opacity-40'}`}
            >
              <IconDownload size={17} aria-hidden="true" /> Descargar PNG
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
