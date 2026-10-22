import { IconArrowUpRight, IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandWhatsapp, IconMenu2, IconX } from '@tabler/icons-react';
import { AnimatePresence, useScroll, useSpring } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { LeafMark, Logo, WhatsAppFloat } from './ui';
import { EASE_OUT, LayoutMotion } from '@/lib/motion';
import { useCatalogState } from '@/lib/catalog';
import { GOALS } from '@/lib/products';
import { isConfirmed, site } from '@/lib/site';
import { INFO_MESSAGE, waLink } from '@/lib/whatsapp';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Fórmulas' },
  { to: '/nosotros', label: 'La marca' },
  { to: '/contacto', label: 'Contacto' },
];

/** La barra dorada de arriba: lo que llevas leído de la página. Un solo transform (scaleX), nada de layout. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  return <m.div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-accent-deep via-gold-light to-accent" style={{ scaleX }} />;
}

const MENU = { hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, show: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.42, ease: EASE_OUT, staggerChildren: 0.06, delayChildren: 0.08 } }, exit: { opacity: 0, clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.28, ease: EASE_OUT } } };
const MENU_ITEM = { hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } }, exit: { opacity: 0 } };

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
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <LayoutMotion>
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-line bg-canvas/96 shadow-[0_12px_32px_-28px_rgb(34_55_92/0.55)] backdrop-blur-lg' : 'border-transparent bg-canvas'}`}>
      <div className="wrap flex h-[4.75rem] items-center justify-between gap-5">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `relative py-2 text-[0.84rem] font-semibold tracking-[0.02em] transition-colors ${isActive ? 'text-night' : 'text-muted hover:text-night'}`}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {/* La raya dorada viaja de un enlace al otro: es la misma pieza, no una nueva en cada página. */}
                  {isActive && <m.span layoutId="nav-active" transition={{ type: 'spring', stiffness: 420, damping: 36 }} className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-accent" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/catalogo" className="btn-shine group relative hidden min-h-10 items-center gap-2 overflow-hidden rounded-full border border-line-strong px-4 text-[0.82rem] font-semibold text-night transition-colors hover:border-night hover:bg-night hover:text-white sm:inline-flex">
            Explorar la línea <IconArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-movil" aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'} className="relative grid size-10 place-items-center rounded-full border border-line-strong text-night transition-colors hover:border-night lg:hidden">
            <AnimatePresence mode="wait" initial={false}>
              <m.span key={open ? 'x' : 'm'} initial={{ rotate: -80, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 80, opacity: 0, scale: 0.7 }} transition={{ duration: 0.2 }} className="grid place-items-center">
                {open ? <IconX size={19} aria-hidden="true" /> : <IconMenu2 size={19} aria-hidden="true" />}
              </m.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <m.nav key="menu" id="menu-movil" aria-label="Menú" variants={MENU} initial="hidden" animate="show" exit="exit" className="wrap overflow-hidden border-t border-line pb-5 pt-3 lg:hidden">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <m.li key={item.to} variants={MENU_ITEM}>
                  <NavLink to={item.to} end={item.end} className={({ isActive }) => `flex items-center justify-between rounded-xl px-4 py-3 font-medium transition-colors ${isActive ? 'bg-sand text-night' : 'text-muted active:bg-sand'}`}>
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />}
                      </>
                    )}
                  </NavLink>
                </m.li>
              ))}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
    </LayoutMotion>
  );
}

function Footer() {
  const total = useCatalogState().catalog?.products.length ?? 0;
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
          <p className="mt-5 max-w-sm text-[0.92rem] leading-relaxed text-white/62">Una línea{total > 0 ? ` de ${total} fórmulas` : ' de fórmulas'} organizada para conocer ingredientes, objetivos y presentaciones con claridad.</p>
          {socials.length > 0 && <ul className="mt-5 flex gap-2">{socials.map(({ label, href, Icon }) => <li key={label}><a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/18 text-white/70 hover:border-accent hover:text-accent"><Icon size={18} aria-hidden="true" /></a></li>)}</ul>}
        </div>
        <nav aria-label="Secciones">
          <h2 className="text-[0.76rem] font-semibold tracking-[0.14em] text-accent uppercase">Explora</h2>
          <ul className="mt-5 space-y-3">{NAV.map((item) => <li key={item.to}><Link to={item.to} className={`link-swipe ${linkClass}`}>{item.label}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Objetivos">
          <h2 className="text-[0.76rem] font-semibold tracking-[0.14em] text-accent uppercase">Por objetivo</h2>
          <ul className="mt-5 space-y-3">{GOALS.slice(0, 4).map((goal) => <li key={goal.id}><Link to={`/catalogo?objetivo=${goal.slug}`} className={`link-swipe ${linkClass}`}>{goal.label}</Link></li>)}</ul>
        </nav>
        <div>
          <h2 className="text-[0.76rem] font-semibold tracking-[0.14em] text-accent uppercase">Contacto</h2>
          <ul className="mt-5 space-y-3">
            <li><a href={waLink(INFO_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[0.87rem] text-white/60 transition-colors hover:text-white"><IconBrandWhatsapp size={16} aria-hidden="true" /> Escribir por WhatsApp</a></li>
            <li><Link to="/contacto" className={`link-swipe ${linkClass}`}>Datos de la marca</Link></li>
          </ul>
          <LeafMark className="mt-7 size-10 opacity-80" />
        </div>
      </div>
      <div className="wrap border-t border-white/10 py-8">
        <p className="max-w-4xl text-[0.8rem] leading-relaxed text-white/62">Estas declaraciones no han sido evaluadas por la Administración de Alimentos y Medicamentos de EE. UU. (FDA). Estos productos no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[0.78rem] text-white/62">
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
      <ScrollProgress />
      <Header />
      {/* Al cambiar de página la nueva entra con un fundido y una subida corta; no hay salida, así que navegar nunca se siente lento. */}
      <main id="contenido" className="min-h-[70vh]">
        <m.div key={pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
          <Outlet />
        </m.div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
