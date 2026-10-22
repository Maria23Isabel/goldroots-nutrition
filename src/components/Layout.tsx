import { IconArrowUpRight, IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandWhatsapp, IconMenu2, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { LeafMark, Logo, WhatsAppFloat } from './ui';
import { GOALS, PRODUCTS } from '@/lib/products';
import { isConfirmed, site } from '@/lib/site';
import { INFO_MESSAGE, waLink } from '@/lib/whatsapp';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Fórmulas' },
  { to: '/nosotros', label: 'La marca' },
  { to: '/contacto', label: 'Contacto' },
];

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
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-line bg-canvas/96 shadow-[0_12px_32px_-28px_rgb(34_55_92/0.55)] backdrop-blur-lg' : 'border-transparent bg-canvas'}`}>
      <div className="wrap flex h-[4.75rem] items-center justify-between gap-5">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `link-swipe py-2 text-[0.84rem] font-semibold tracking-[0.02em] transition-colors ${isActive ? 'text-night' : 'text-muted hover:text-night'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/catalogo" className="hidden min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.82rem] font-semibold text-night transition-colors hover:border-night hover:bg-night hover:text-white sm:inline-flex">
            Explorar la línea <IconArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-movil" aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'} className="grid size-10 place-items-center rounded-full border border-line-strong text-night lg:hidden">
            {open ? <IconX size={19} aria-hidden="true" /> : <IconMenu2 size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="menu-movil" aria-label="Menú" className="wrap border-t border-line pb-5 pt-3 lg:hidden">
          <ul className="grid gap-1">
            {NAV.map((item) => (
              <li key={item.to}><NavLink to={item.to} end={item.end} className={({ isActive }) => `block rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-sand text-night' : 'text-muted'}`}>{item.label}</NavLink></li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const socials = [
    { label: 'Instagram', href: site.instagram, Icon: IconBrandInstagram },
    { label: 'Facebook', href: site.facebook, Icon: IconBrandFacebook },
    { label: 'TikTok', href: site.tiktok, Icon: IconBrandTiktok },
  ].filter((item) => isConfirmed(item.href));
  const linkClass = 'text-[0.87rem] text-white/60 transition-colors hover:text-white';
  return (
    <footer className="mt-24 bg-night text-white">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1.15fr]">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-sm text-[0.92rem] leading-relaxed text-white/62">Una línea de {PRODUCTS.length} fórmulas organizada para conocer ingredientes, objetivos y presentaciones con claridad.</p>
          {socials.length > 0 && <ul className="mt-5 flex gap-2">{socials.map(({ label, href, Icon }) => <li key={label}><a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/18 text-white/70 hover:border-accent hover:text-accent"><Icon size={18} aria-hidden="true" /></a></li>)}</ul>}
        </div>
        <nav aria-label="Secciones">
          <h2 className="text-[0.76rem] font-semibold tracking-[0.14em] text-accent uppercase">Explora</h2>
          <ul className="mt-5 space-y-3">{NAV.map((item) => <li key={item.to}><Link to={item.to} className={linkClass}>{item.label}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Objetivos">
          <h2 className="text-[0.76rem] font-semibold tracking-[0.14em] text-accent uppercase">Por objetivo</h2>
          <ul className="mt-5 space-y-3">{GOALS.slice(0, 4).map((goal) => <li key={goal.id}><Link to={`/catalogo?objetivo=${goal.slug}`} className={linkClass}>{goal.label}</Link></li>)}</ul>
        </nav>
        <div>
          <h2 className="text-[0.76rem] font-semibold tracking-[0.14em] text-accent uppercase">Contacto</h2>
          <ul className="mt-5 space-y-3">
            <li><a href={waLink(INFO_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[0.87rem] text-white/60 transition-colors hover:text-white"><IconBrandWhatsapp size={16} aria-hidden="true" /> Escribir por WhatsApp</a></li>
            <li><Link to="/contacto" className={linkClass}>Datos de la marca</Link></li>
          </ul>
          <LeafMark className="mt-7 size-10 opacity-80" />
        </div>
      </div>
      <div className="wrap border-t border-white/10 py-8">
        <p className="max-w-4xl text-[0.8rem] leading-relaxed text-white/48">Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos de EE. UU. (FDA). Estos productos no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[0.78rem] text-white/45">
          <p>© {new Date().getFullYear()} {site.brand}. Sitio informativo.</p>
          <div className="flex gap-5"><Link to="/legal/terminos" className="hover:text-white">Términos</Link><Link to="/legal/privacidad" className="hover:text-white">Privacidad</Link></div>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return (
    <>
      <a href="#contenido" className="absolute top-3 left-3 z-[70] -translate-y-24 rounded-full bg-night px-5 py-3 font-semibold text-white focus:translate-y-0">Saltar al contenido</a>
      <Header />
      <main id="contenido" className="min-h-[70vh]"><Outlet /></main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
