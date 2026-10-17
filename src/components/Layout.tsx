import { IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandWhatsapp, IconHome2, IconMenu2, IconMoon, IconPackage, IconShoppingBag, IconSun, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { OrderDrawer } from './OrderDrawer';
import { Logo, Pending, WhatsAppButton } from './ui';
import { orderActions, useOrder } from '@/lib/order';
import { GOALS } from '@/lib/products';
import { useTheme } from '@/lib/theme';
import { isConfirmed, prettyPhone, site } from '@/lib/site';
import { GENERAL_MESSAGE, waLink } from '@/lib/whatsapp';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/mayoristas', label: 'Mayoristas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

function OrderButton({ className = '' }: { className?: string }) {
  const { totals } = useOrder();
  return (
    <button type="button" onClick={orderActions.open} className={`relative inline-flex min-h-11 items-center gap-2 rounded-full bg-inv px-5 font-bold text-inv-fg transition hover:opacity-85 ${className}`}>
      <IconShoppingBag size={19} aria-hidden="true" />
      Mi pedido
      {totals.units > 0 && (
        <span key={totals.units} className="pop grad-sun grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-xs font-extrabold text-night" aria-label={`${totals.units} en el pedido`}>
          {totals.units}
        </span>
      )}
    </button>
  );
}

function ThemeToggle() {
  const { theme, set } = useTheme();
  const seg = (active: boolean) => `grid size-9 place-items-center rounded-full transition ${active ? 'bg-inv text-inv-fg shadow' : 'text-muted hover:text-fg'}`;
  return (
    <div role="group" aria-label="Tema de la página" className="flex items-center rounded-full bg-fg/5 p-1 ring-1 ring-line">
      <button type="button" onClick={() => set('light')} aria-pressed={theme === 'light'} aria-label="Tema claro" className={seg(theme === 'light')}>
        <IconSun size={18} aria-hidden="true" />
      </button>
      <button type="button" onClick={() => set('dark')} aria-pressed={theme === 'dark'} aria-label="Tema oscuro" className={seg(theme === 'dark')}>
        <IconMoon size={18} aria-hidden="true" />
      </button>
    </div>
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className={`glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 ring-1 transition-shadow ${scrolled ? 'shadow-xl shadow-ink/10 ring-line' : 'shadow-md shadow-ink/5 ring-white/60'}`}>
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `rounded-full px-4 py-2 text-[0.93rem] font-bold transition ${isActive ? 'bg-inv text-inv-fg' : 'text-fg/75 hover:bg-fg/5 hover:text-fg'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <OrderButton className="max-sm:!hidden" />
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-movil" aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'} className="grid size-11 place-items-center rounded-full bg-fg/5 transition hover:bg-sun lg:hidden">
            {open ? <IconX size={22} aria-hidden="true" /> : <IconMenu2 size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Menú" className="glass mx-auto mt-2 max-w-6xl rounded-[2rem] p-3 shadow-xl ring-1 ring-line [animation:sheet-up_0.25s_both] lg:hidden">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end} className={({ isActive }) => `block rounded-2xl px-5 py-3.5 text-lg font-bold ${isActive ? 'bg-inv text-inv-fg' : 'text-night hover:bg-sun/30'}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/** En el celular: barra de pestañas abajo, como una app. */
function BottomBar() {
  const { totals } = useOrder();
  const tab = 'flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.7rem] font-bold text-fg/70';
  return (
    <nav aria-label="Atajos" className="glass fixed inset-x-3 bottom-3 z-40 flex items-center rounded-full px-2 shadow-2xl shadow-ink/20 ring-1 ring-line sm:hidden">
      <NavLink to="/" end className={({ isActive }) => `${tab} ${isActive ? '!text-coral-deep' : ''}`}>
        <IconHome2 size={22} aria-hidden="true" />
        Inicio
      </NavLink>
      <NavLink to="/catalogo" className={({ isActive }) => `${tab} ${isActive ? '!text-coral-deep' : ''}`}>
        <IconPackage size={22} aria-hidden="true" />
        Catálogo
      </NavLink>
      <button type="button" onClick={orderActions.open} className="relative -mt-6 grid size-16 shrink-0 place-items-center rounded-full bg-inv text-inv-fg shadow-xl shadow-ink/40 ring-4 ring-cream" aria-label={`Mi pedido${totals.units ? `, ${totals.units} unidades` : ''}`}>
        <IconShoppingBag size={26} aria-hidden="true" />
        {totals.units > 0 && (
          <span key={totals.units} className="pop grad-sun absolute -top-1 -right-1 grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-xs font-extrabold text-night">
            {totals.units}
          </span>
        )}
      </button>
      <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className={tab}>
        <IconBrandWhatsapp size={22} aria-hidden="true" />
        WhatsApp
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
      <NavLink to="/contacto" className={({ isActive }) => `${tab} ${isActive ? '!text-coral-deep' : ''}`}>
        <IconMenu2 size={22} aria-hidden="true" />
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
  const col = 'space-y-2.5 text-white/70 [&_a]:transition [&_a:hover]:text-sun';
  return (
    <footer className="grain relative mt-28 overflow-hidden bg-ink pt-16 pb-32 text-white sm:pb-14">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-coral/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs leading-relaxed text-white/70">{site.tagline}. Catorce fórmulas enfocadas, en cápsulas vegetarianas y con etiquetas claras.</p>
          {socials.length > 0 && (
            <ul className="mt-5 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-sun hover:text-night">
                    <Icon size={20} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Secciones">
          <h2 className="font-display text-lg font-bold">Explora</h2>
          <ul className={`mt-4 ${col}`}>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Por objetivo">
          <h2 className="font-display text-lg font-bold">Por objetivo</h2>
          <ul className={`mt-4 ${col}`}>
            {GOALS.map((g) => (
              <li key={g.id}>
                <Link to={`/catalogo?objetivo=${g.slug}`}>{g.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-lg font-bold">Pedidos y consultas</h2>
          <ul className={`mt-4 ${col}`}>
            <li>
              WhatsApp:{' '}
              <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="font-bold text-white">
                {prettyPhone(site.whatsapp)}
              </a>
              {!site.whatsappConfirmed && (
                <div className="mt-2">
                  <Pending>número definitivo de la marca</Pending>
                </div>
              )}
            </li>
            <li>{site.hours ?? 'Horario: se acuerda en el chat'}</li>
            <li>
              <WhatsAppButton text={GENERAL_MESSAGE} className="mt-2 !min-h-11 !px-5 !text-sm">
                Escríbenos
              </WhatsAppButton>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative mx-auto mt-14 max-w-6xl border-t border-white/10 px-5 pt-8 text-sm text-white/55">
        <p className="max-w-3xl leading-relaxed">
          Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos de EE. UU. (FDA). Estos productos no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad. Consulta a un profesional de la salud antes de usar cualquier suplemento.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {site.brand}. Vitrina informativa: no hay pagos en línea.</p>
          <ul className="flex gap-5 font-semibold [&_a:hover]:text-sun">
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
    <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)" className="animate-pulse-ring fixed right-6 bottom-6 z-40 hidden size-16 place-items-center rounded-full bg-wa text-night shadow-2xl shadow-wa/40 transition hover:scale-110 sm:grid">
      <IconBrandWhatsapp size={34} aria-hidden="true" />
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
      <a href="#contenido" className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-inv px-5 py-3 font-bold text-inv-fg focus:translate-y-0">
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
