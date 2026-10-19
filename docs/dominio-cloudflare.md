# Pasar goldrootsvitamins.com de Shopify a Cloudflare

Hoy el dominio está comprado en GoDaddy, sus DNS también (`ns11/ns12.domaincontrol.com`) y apunta a Shopify
(`A 23.227.38.32` y `www → shops.myshopify.com`). El correo del dominio también está en GoDaddy (`MX smtp.secureserver.net`
y `mailstore1.secureserver.net`): **no se toca**.

El sitio ya está publicado en Cloudflare como el Worker `goldroots-nutrition`
(https://goldroots-nutrition.mariaisabel06atauccancha23.workers.dev, con `noindex`). Falta mover el dominio. Se sigue en este
orden para que la tienda actual no se caiga mientras tanto.

## 1 · Agregar el dominio a Cloudflare (gratis)

1. Cloudflare → **Add a domain** → `goldrootsvitamins.com` → plan **Free**.
2. Cloudflare lee los registros actuales de GoDaddy y los copia. Revisa la lista:
   - **Conserva** los `MX` (smtp.secureserver.net, mailstore1.secureserver.net) y todos los `TXT` (SPF, verificaciones).
   - **Deja por ahora** el `A` de la raíz y el `CNAME www` que apuntan a Shopify, con la nube en gris (*DNS only*). Así la tienda
     sigue funcionando hasta el paso 4.
3. Cloudflare muestra **dos servidores de nombres** (algo como `xxx.ns.cloudflare.com`). Cópialos.

## 2 · Cambiar los servidores de nombres en GoDaddy

GoDaddy → *Mis productos* → el dominio → **DNS** → **Servidores de nombres** → *Cambiar* → «Usaré mis propios servidores de nombres»
→ pega los dos de Cloudflare. Si el dominio tiene **DNSSEC** activado, apágalo antes.

Cloudflare avisa por correo cuando la zona queda **Active** (de minutos a unas horas). Mientras tanto la tienda y el correo siguen igual.

## 3 · Avisar que ya está activo

Cuando Cloudflare diga *Active*, el cambio final se hace así (puede correrlo quien tenga `wrangler login`):

```bash
cd goldroots-nutrition
# en Cloudflare → DNS, borra el A de la raíz y el CNAME www que apuntan a Shopify (Cloudflare no deja crear el dominio sobre ellos)
npm run desplegar:dominio
```

`desplegar:dominio` compila con el dominio real (canonical, sitemap y QR salen con `https://goldrootsvitamins.com`) y publica el Worker en
`goldrootsvitamins.com` y `www.goldrootsvitamins.com`; Cloudflare crea solo los registros y el certificado HTTPS.

## 4 · Despedirse de Shopify

Solo cuando el sitio ya abra en el dominio: en Shopify → *Configuración → Dominios* quita `goldrootsvitamins.com` y, si ya no lo vas a usar,
cancela el plan (antes, exporta pedidos y clientes si los necesitas). El dominio sigue siendo tuyo en GoDaddy; solo cambió quién responde sus DNS.

## Qué cambia para los QR

El QR «Muestra» de cada marca abre `https://goldrootsvitamins.com/`: sigue igual, pero ahora responde esta página y no la tienda de Shopify.
Las fichas de producto viven en `/producto/<nombre>/` y las direcciones en inglés de la versión anterior (`/product/<nombre>`) redirigen solas.
