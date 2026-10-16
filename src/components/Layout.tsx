import { IconBrandWhatsapp, IconSearch, IconX, IconMenu2 } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { asset, goalLabel, money, searchProducts } from '@/lib/products';
import { site } from '@/lib/site';
import { GENERAL_MESSAGE, waLink } from '@/lib/whatsapp';
import { buttonClass, Logo } from './ui';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalog', label: 'Catalog' },
  { to: '/wholesale', label: 'Wholesale' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const results = q.trim() ? searchProducts(q, 'all', 'featured').slice(0, 6) : searchProducts('', 'all', 'featured').slice(0, 4);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-forest/70 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div role="dialog" aria-modal="true" aria-label="Search products" className="mx-auto mt-16 w-[min(42rem,92vw)] rounded-3xl bg-ivory p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/catalog?q=${encodeURIComponent(q)}`);
            onClose();
          }}
          className="flex items-center gap-3 rounded-full border border-line bg-white px-5"
        >
          <IconSearch size={20} className="text-gold-deep" aria-hidden="true" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, benefit or ingredient…"
            aria-label="Search products"
            className="h-14 flex-1 bg-transparent text-base outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="grid size-10 place-items-center text-muted hover:text-forest">
            <IconX size={20} />
          </button>
        </form>
        <p className="mt-4 mb-2 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{q.trim() ? 'Results' : 'Popular right now'}</p>
        <ul className="grid gap-1">
          {results.map((p) => (
            <li key={p.slug}>
              <Link to={`/product/${p.slug}`} onClick={onClose} className="flex items-center gap-4 rounded-2xl p-2 hover:bg-sand/70">
                {p.image && <img src={asset(p.image)} alt="" className="size-14 rounded-xl bg-white object-contain" />}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold tracking-wide text-forest uppercase">{p.name}</span>
                  <span className="block text-xs text-muted">{goalLabel(p.goal)}</span>
                </span>
                <span className="text-sm text-muted">{p.price != null ? money(p.price) : 'Soon'}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && <li className="p-3 text-muted">No products match “{q}”.</li>}
        </ul>
      </div>
    </div>
  );
}

function Header() {
  const [searching, setSearching] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const link = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-full px-3 py-2 text-sm font-bold tracking-[0.16em] uppercase transition hover:text-gold-deep ${isActive ? 'text-gold-deep' : 'text-forest'}`;

  return (
    <header className={`sticky top-0 z-40 transition-shadow ${scrolled ? 'border-b border-line bg-ivory/95 shadow-sm backdrop-blur' : 'bg-ivory'}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={link}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <div className="hidden sm:block">
            <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonClass('wa', '!min-h-11 !px-5')}>
              <IconBrandWhatsapp size={20} aria-hidden="true" /> <span className="xl:hidden">WhatsApp</span>
              <span className="hidden xl:inline">Order on WhatsApp</span>
              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
            </a>
          </div>
          <button type="button" onClick={() => setSearching(true)} aria-label="Search products" className="grid size-11 place-items-center rounded-full text-forest hover:bg-sand">
            <IconSearch size={22} />
          </button>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-label="Main menu"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            className="grid size-11 place-items-center rounded-full text-forest hover:bg-sand lg:hidden"
          >
            {menu ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>
      {menu && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-ivory px-5 py-4 lg:hidden">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end} className={({ isActive }) => `block rounded-xl px-3 py-3 text-base font-bold tracking-[0.14em] uppercase ${isActive ? 'bg-sand text-gold-deep' : 'text-forest'}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonClass('wa', 'w-full')}>
                <IconBrandWhatsapp size={20} aria-hidden="true" /> Order on WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
      {searching && <SearchOverlay onClose={() => setSearching(false)} />}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-forest text-white/80">
      <div className="h-1 gold-fill" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm leading-relaxed">{site.tagline}. Pure, safe and effective formulas made with integrity.</p>
          <a href={waLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonClass('wa', 'mt-6')}>
            <IconBrandWhatsapp size={20} aria-hidden="true" /> Chat with us
            <span className="sr-only"> (opens WhatsApp in a new tab)</span>
          </a>
        </div>
        <nav aria-label="Catalog">
          <p className="eyebrow !text-gold">Catalog</p>
          <ul className="mt-4 grid gap-2.5">
            <li><Link to="/catalog" className="hover:text-gold">All 14 formulas</Link></li>
            <li><Link to="/catalog?goal=energy" className="hover:text-gold">Energy &amp; Vitality</Link></li>
            <li><Link to="/catalog?goal=heart" className="hover:text-gold">Heart &amp; Circulation</Link></li>
            <li><Link to="/catalog?goal=immune" className="hover:text-gold">Immune &amp; Antioxidant</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="eyebrow !text-gold">Company</p>
          <ul className="mt-4 grid gap-2.5">
            <li><Link to="/about" className="hover:text-gold">About us</Link></li>
            <li><Link to="/wholesale" className="hover:text-gold">Wholesale</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className="eyebrow !text-gold">Legal</p>
          <ul className="mt-4 grid gap-2.5">
            <li><Link to="/legal/terms" className="hover:text-gold">Terms &amp; policies</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-gold">Privacy policy</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs leading-relaxed text-white/55">
        <p className="mx-auto max-w-4xl">
          These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease.{' '}
          <em>[Legal text to be reviewed before launch.]</em>
        </p>
        <p className="mt-3">© {new Date().getFullYear()} GOLD ROOTS NUTRITION</p>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-forest">
        Skip to content
      </a>
      <div className="bg-forest px-4 py-2.5 text-center text-[11px] font-semibold tracking-[0.22em] text-gold-soft uppercase sm:text-xs">
        Premium wellness • Trusted quality • Fast shipping
      </div>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <a
        href={waLink(GENERAL_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp (opens in a new tab)"
        className="fixed right-4 bottom-4 z-30 grid size-14 animate-pulse-ring place-items-center rounded-full bg-wa text-forest shadow-xl transition hover:scale-105 sm:right-6 sm:bottom-6"
      >
        <IconBrandWhatsapp size={30} aria-hidden="true" />
      </a>
    </>
  );
}
