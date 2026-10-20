import { IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandWhatsapp, IconHome2, IconMenu2, IconPackage, IconShoppingBag, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { OrderDrawer } from './OrderDrawer';
import { Logo, WhatsAppButton } from './ui';
import { orderActions, useOrder } from '@/lib/order';
import { GOALS, PRODUCTS } from '@/lib/products';
import { isConfirmed, prettyPhone, site } from '@/lib/site';
import { GENERAL_MESSAGE, waLink } from '@/lib/whatsapp';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/mayoristas', label: 'Mayoristas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

/* Lo que se puede afirmar del catálogo tal como está: nada de certificaciones ni reseñas inventadas. */
const FACTS = [
  `${PRODUCTS.length} fórmulas, seis objetivos`,
  'Cápsulas vegetarianas',
  'Etiquetas claras, ingrediente por ingrediente',
  'Pedido directo por WhatsApp',
  'Sin pagos en línea: se confirma todo en el chat',
];

function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {FACTS.map((f) => (
        <li key={f} className="flex items-center gap-4 pr-4 text-[0.78rem] font-medium whitespace-nowrap">
          {f}
          <span className="size-1 rounded-full bg-white/35" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden bg-night text-white/85" aria-label="Lo que ofrece la línea">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function OrderButton({ className = '' }: { className?: string }) {
  const { totals } = useOrder();
  return (
    <button type="button" onClick={orderActions.open} className={`relative inline-flex min-h-10 items-center gap-2 rounded-full bg-night px-4 text-[0.88rem] font-semibold text-white transition-colors hover:bg-fg/85 ${className}`}>
      <IconShoppingBag size={17} aria-hidden="true" />
      Mi pedido
      {totals.units > 0 && (
        <span key={totals.units} className="pop grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[0.7rem] font-bold text-white" aria-label={`${totals.units} en el pedido`}>
          {totals.units}
        </span>
      )}
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-canvas transition-shadow duration-200 sm:bg-canvas/97 sm:backdrop-blur-[2px]">
      <div className="hidden sm:block">
        <Marquee />
      </div>
      <div className={`wrap flex h-16 items-center justify-between gap-4 border-line ${scrolled ? 'shadow-[0_1px_0_0_var(--color-line)]' : ''}`}>
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `relative py-2 text-[0.9rem] font-medium transition-colors ${isActive ? 'text-fg after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-accent' : 'text-muted hover:text-fg'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)" className="hidden size-10 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-fg hover:text-fg sm:grid">
            <IconBrandWhatsapp size={19} aria-hidden="true" />
          </a>
          <OrderButton className="max-sm:hidden" />
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-movil" aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'} className="grid size-10 place-items-center rounded-full border border-line-strong text-fg transition-colors hover:bg-sand lg:hidden">
            {open ? <IconX size={19} aria-hidden="true" /> : <IconMenu2 size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Menú" className="wrap pb-4 lg:hidden">
          <ul className="grid gap-0.5 border-t border-line pt-3 [animation:fade-in_0.18s_both]">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end} className={({ isActive }) => `block rounded-lg px-3 py-2.5 font-medium ${isActive ? 'bg-sand text-fg' : 'text-muted hover:bg-sand/60 hover:text-fg'}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li className="px-3 pt-2">
              <OrderButton className="w-full justify-center" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/** En el celular: barra de pestañas abajo, como una app. */
function BottomBar() {
  const { totals } = useOrder();
  const tab = 'flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.68rem] font-medium text-muted';
  return (
    <nav aria-label="Atajos" className="fixed inset-x-3 bottom-3 z-40 flex items-center rounded-full border border-line bg-surface px-2 shadow-[0_8px_28px_-12px_rgb(35_35_31/0.28)] sm:hidden">
      <NavLink to="/" end className={({ isActive }) => `${tab} ${isActive ? '!text-fg' : ''}`}>
        <IconHome2 size={20} aria-hidden="true" />
        Inicio
      </NavLink>
      <NavLink to="/catalogo" className={({ isActive }) => `${tab} ${isActive ? '!text-fg' : ''}`}>
        <IconPackage size={20} aria-hidden="true" />
        Catálogo
      </NavLink>
      <button type="button" onClick={orderActions.open} className="relative -mt-5 grid size-14 shrink-0 place-items-center rounded-full bg-night text-white shadow-lg ring-4 ring-canvas" aria-label={`Mi pedido${totals.units ? `, ${totals.units} unidades` : ''}`}>
        <IconShoppingBag size={22} aria-hidden="true" />
        {totals.units > 0 && (
          <span key={totals.units} className="pop absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[0.68rem] font-bold text-white">
            {totals.units}
          </span>
        )}
      </button>
      <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className={tab}>
        <IconBrandWhatsapp size={20} aria-hidden="true" />
        WhatsApp
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
      <NavLink to="/contacto" className={({ isActive }) => `${tab} ${isActive ? '!text-fg' : ''}`}>
        <IconMenu2 size={20} aria-hidden="true" />
        Más
      </NavLink>
    </nav>
  );
}

function Footer() {
  const socials = [
    { label: 'Instagram', href: site.instagram, Icon: IconBrandInstagram },
    { label: 'Facebook', href: site.facebook, Icon: IconBrandFacebook },
    { label: 'TikTok', href: site.tiktok, Icon: IconBrandTiktok },
  ].filter((s) => isConfirmed(s.href));
  const col = 'space-y-2 text-[0.88rem] text-white/65 [&_a]:transition-colors [&_a:hover]:text-white';
  return (
    <footer className="mt-20 bg-night pb-32 text-white sm:pb-16">
      <div className="wrap grid gap-10 pt-14 md:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div>
          <Logo onDark />
          <p className="mt-4 max-w-xs text-[0.9rem] leading-relaxed text-white/65">{site.tagline}. {PRODUCTS.length} fórmulas enfocadas, en cápsulas vegetarianas y con etiquetas claras.</p>
          {socials.length > 0 && (
            <ul className="mt-5 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/20 text-white/75 transition-colors hover:border-white hover:text-white">
                    <Icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Secciones">
          <h2 className="font-display text-[0.95rem] font-medium text-white">Explora</h2>
          <ul className={`mt-4 ${col}`}>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Por objetivo">
          <h2 className="font-display text-[0.95rem] font-medium text-white">Por objetivo</h2>
          <ul className={`mt-4 ${col}`}>
            {GOALS.map((g) => (
              <li key={g.id}>
                <Link to={`/catalogo?objetivo=${g.slug}`}>{g.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-[0.95rem] font-medium text-white">Pedidos y consultas</h2>
          <ul className={`mt-4 space-y-2.5 ${col}`}>
            <li>
              WhatsApp:{' '}
              <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="font-semibold text-white">
                {prettyPhone(site.whatsapp)}
              </a>
            </li>
            <li>{site.hours ?? 'Horario: se acuerda en el chat'}</li>
            <li>
              <WhatsAppButton text={GENERAL_MESSAGE} className="mt-1 !min-h-10 !px-4 !text-[0.85rem]">
                Escríbenos
              </WhatsAppButton>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-12 border-t border-white/12 pt-7 text-[0.82rem] text-white/55">
        <p className="max-w-3xl leading-relaxed">
          Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos de EE. UU. (FDA). Estos productos no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad. Consulta a un profesional de la salud antes de usar cualquier suplemento.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {site.brand}. Vitrina informativa: no hay pagos en línea.</p>
          <ul className="flex gap-5 [&_a:hover]:text-white">
            <li>
              <Link to="/legal/terminos">Términos</Link>
            </li>
            <li>
              <Link to="/legal/privacidad">Privacidad</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)" className="fixed right-5 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-wa text-white shadow-lg transition-colors hover:bg-wa-deep sm:grid">
      <IconBrandWhatsapp size={26} aria-hidden="true" />
    </a>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return (
    <>
      <a href="#contenido" className="absolute top-3 left-3 z-[70] -translate-y-24 rounded-full bg-night px-5 py-3 font-semibold text-white focus:translate-y-0">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BottomBar />
      <OrderDrawer />
    </>
  );
}
